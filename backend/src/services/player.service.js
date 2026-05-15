const Game = require('../models/game.model');
const ApiFeatures = require('../utils/apiFeatures');

const getBasePlayerAggregation = () => {
  return [
    {
      $project: {
        player: [
          { username: '$players.white.username', rating: '$players.white.rating' },
          { username: '$players.black.username', rating: '$players.black.rating' }
        ]
      }
    },
    { $unwind: '$player' },
    {
      $group: {
        _id: '$player.username',
        username: { $first: '$player.username' },
        averageRating: { $avg: '$player.rating' },
        totalMatches: { $sum: 1 }
      }
    }
  ];
};

const getAllPlayers = async (query) => {
  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 20;
  const skip = (page - 1) * limit;
  
  const pipeline = getBasePlayerAggregation();

  const matchStage = {};
  if (query.search) {
    matchStage.username = new RegExp(query.search, 'i');
  }
  if (query.minRating) {
    matchStage.averageRating = { $gte: Number(query.minRating) };
  }

  if (Object.keys(matchStage).length > 0) {
    pipeline.push({ $match: matchStage });
  }

  let sortStage = { totalMatches: -1 };
  if (query.sort) {
    if (query.sort === 'rating') sortStage = { averageRating: -1 };
    else if (query.sort === '-rating') sortStage = { averageRating: 1 };
  }
  
  pipeline.push({ $sort: sortStage });

  const countPipeline = [...pipeline, { $count: 'total' }];
  
  pipeline.push({ $skip: skip });
  pipeline.push({ $limit: limit });

  const [data, countResult] = await Promise.all([
    Game.aggregate(pipeline),
    Game.aggregate(countPipeline)
  ]);

  const count = countResult.length > 0 ? countResult[0].total : 0;

  return { data, count, pagination: { page, limit } };
};

const getPlayerDetails = async (username) => {
  const pipeline = [
    {
      $match: {
        $or: [
          { 'players.white.username': username },
          { 'players.black.username': username }
        ]
      }
    },
    {
      $facet: {
        basicStats: [
          {
            $group: {
              _id: null,
              totalMatches: { $sum: 1 },
              wins: {
                $sum: {
                  $cond: [
                    {
                      $or: [
                        { $and: [{ $eq: ['$winner', 'white'] }, { $eq: ['$players.white.username', username] }] },
                        { $and: [{ $eq: ['$winner', 'black'] }, { $eq: ['$players.black.username', username] }] }
                      ]
                    },
                    1, 0
                  ]
                }
              },
              losses: {
                $sum: {
                  $cond: [
                    {
                      $or: [
                        { $and: [{ $eq: ['$winner', 'black'] }, { $eq: ['$players.white.username', username] }] },
                        { $and: [{ $eq: ['$winner', 'white'] }, { $eq: ['$players.black.username', username] }] }
                      ]
                    },
                    1, 0
                  ]
                }
              },
              draws: {
                $sum: { $cond: [{ $eq: ['$winner', 'draw'] }, 1, 0] }
              },
              avgRating: {
                $avg: {
                  $cond: [
                    { $eq: ['$players.white.username', username] },
                    '$players.white.rating',
                    '$players.black.rating'
                  ]
                }
              }
            }
          }
        ],
        openings: [
          {
            $group: {
              _id: '$opening.name',
              count: { $sum: 1 }
            }
          },
          { $sort: { count: -1 } },
          { $limit: 5 }
        ]
      }
    }
  ];

  const result = await Game.aggregate(pipeline);
  if (!result || result[0].basicStats.length === 0) return null;

  const stats = result[0].basicStats[0];
  const openings = result[0].openings;

  return {
    username,
    averageRating: Math.round(stats.avgRating),
    totalMatches: stats.totalMatches,
    wins: stats.wins,
    losses: stats.losses,
    draws: stats.draws,
    mostPlayedOpenings: openings
  };
};

const getPlayerHistory = async (username, queryString) => {
  const query = {
    ...queryString,
    search: username 
  };
  
  const features = new ApiFeatures(Game.find(), query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const data = await features.query;
  const countFeatures = new ApiFeatures(Game.find(), query).filter();
  const count = await countFeatures.query.countDocuments();

  return { data, count, pagination: features.paginationParams };
};

const getPlayerStats = async (username) => {
  const pipeline = [
    {
      $match: {
        $or: [
          { 'players.white.username': username },
          { 'players.black.username': username }
        ]
      }
    },
    {
      $group: {
        _id: null,
        totalMatches: { $sum: 1 },
        ratedMatches: { $sum: { $cond: [{ $eq: ['$rated', true] }, 1, 0] } },
        unratedMatches: { $sum: { $cond: [{ $eq: ['$rated', false] }, 1, 0] } },
        totalTurns: { $sum: '$turns' },
        wins: {
          $sum: {
            $cond: [
              {
                $or: [
                  { $and: [{ $eq: ['$winner', 'white'] }, { $eq: ['$players.white.username', username] }] },
                  { $and: [{ $eq: ['$winner', 'black'] }, { $eq: ['$players.black.username', username] }] }
                ]
              },
              1, 0
            ]
          }
        },
        losses: {
          $sum: {
            $cond: [
              {
                $or: [
                  { $and: [{ $eq: ['$winner', 'black'] }, { $eq: ['$players.white.username', username] }] },
                  { $and: [{ $eq: ['$winner', 'white'] }, { $eq: ['$players.black.username', username] }] }
                ]
              },
              1, 0
            ]
          }
        },
        draws: { $sum: { $cond: [{ $eq: ['$winner', 'draw'] }, 1, 0] } }
      }
    }
  ];

  const result = await Game.aggregate(pipeline);
  if (!result || result.length === 0) return null;

  const stats = result[0];
  const winRate = ((stats.wins / stats.totalMatches) * 100).toFixed(2);
  const lossRate = ((stats.losses / stats.totalMatches) * 100).toFixed(2);
  const drawRate = ((stats.draws / stats.totalMatches) * 100).toFixed(2);
  const avgTurns = (stats.totalTurns / stats.totalMatches).toFixed(1);

  return {
    totalMatches: stats.totalMatches,
    ratedMatches: stats.ratedMatches,
    unratedMatches: stats.unratedMatches,
    winRate: `${winRate}%`,
    lossRate: `${lossRate}%`,
    drawRate: `${drawRate}%`,
    averageTurns: Number(avgTurns)
  };
};

const getTopRated = async (query) => {
  const limit = parseInt(query.limit, 10) || 10;
  const pipeline = getBasePlayerAggregation();
  
  pipeline.push({ $match: { totalMatches: { $gte: 5 } } });
  pipeline.push({ $sort: { averageRating: -1 } });
  pipeline.push({ $limit: limit });

  return await Game.aggregate(pipeline);
};

const getTopActive = async (query) => {
  const limit = parseInt(query.limit, 10) || 10;
  const pipeline = getBasePlayerAggregation();
  
  pipeline.push({ $sort: { totalMatches: -1 } });
  pipeline.push({ $limit: limit });

  return await Game.aggregate(pipeline);
};

module.exports = {
  getAllPlayers,
  getPlayerDetails,
  getPlayerHistory,
  getPlayerStats,
  getTopRated,
  getTopActive
};
