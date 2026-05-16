const Game = require('../models/game.model');

const searchOpenings = async (query) => {
  const q = query.q || '';
  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 20;
  const skip = (page - 1) * limit;

  const pipeline = [
    { $match: { 'opening.name': { $regex: q, $options: 'i' } } },
    {
      $group: {
        _id: '$opening.name',
        eco: { $first: '$opening.eco' },
        totalGames: { $sum: 1 },
        whiteWins: { $sum: { $cond: [{ $eq: ['$winner', 'white'] }, 1, 0] } },
        blackWins: { $sum: { $cond: [{ $eq: ['$winner', 'black'] }, 1, 0] } },
        draws: { $sum: { $cond: [{ $eq: ['$winner', 'draw'] }, 1, 0] } }
      }
    },
    {
      $project: {
        _id: 0,
        name: '$_id',
        eco: 1,
        totalGames: 1,
        whiteWinRate: { $round: [{ $multiply: [{ $divide: ['$whiteWins', '$totalGames'] }, 100] }, 2] },
        blackWinRate: { $round: [{ $multiply: [{ $divide: ['$blackWins', '$totalGames'] }, 100] }, 2] },
        drawRate: { $round: [{ $multiply: [{ $divide: ['$draws', '$totalGames'] }, 100] }, 2] }
      }
    },
    { $sort: { totalGames: -1 } }
  ];

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

const searchPlayers = async (query) => {
  const q = query.q || '';
  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 20;
  const skip = (page - 1) * limit;

  const pipeline = [
    {
      $match: {
        $or: [
          { 'players.white.username': { $regex: q, $options: 'i' } },
          { 'players.black.username': { $regex: q, $options: 'i' } }
        ]
      }
    },
    {
      $project: {
        player: [
          { username: '$players.white.username', rating: '$players.white.rating' },
          { username: '$players.black.username', rating: '$players.black.rating' }
        ]
      }
    },
    { $unwind: '$player' },
    { $match: { 'player.username': { $regex: q, $options: 'i' } } },
    {
      $group: {
        _id: '$player.username',
        averageRating: { $avg: '$player.rating' },
        totalMatches: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0,
        username: '$_id',
        averageRating: { $round: ['$averageRating', 0] },
        totalMatches: 1
      }
    },
    { $sort: { totalMatches: -1 } }
  ];

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

const searchEco = async (query) => {
  const q = query.q || '';
  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 20;
  const skip = (page - 1) * limit;

  const pipeline = [
    { $match: { 'opening.eco': { $regex: q, $options: 'i' } } },
    {
      $group: {
        _id: { eco: '$opening.eco', name: '$opening.name' },
        totalGames: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0,
        eco: '$_id.eco',
        name: '$_id.name',
        totalGames: 1
      }
    },
    { $sort: { eco: 1, totalGames: -1 } }
  ];

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

const getAutocomplete = async (query) => {
  const q = query.q || '';
  if (!q) return { openings: [], players: [], eco: [] };
  
  const limit = parseInt(query.limit, 10) || 5;

  const [openings, players, eco] = await Promise.all([
    Game.aggregate([
      { $match: { 'opening.name': { $regex: q, $options: 'i' } } },
      { $group: { _id: '$opening.name', totalGames: { $sum: 1 } } },
      { $sort: { totalGames: -1 } },
      { $limit: limit },
      { $project: { _id: 0, name: '$_id' } }
    ]),
    Game.aggregate([
      {
        $match: {
          $or: [
            { 'players.white.username': { $regex: q, $options: 'i' } },
            { 'players.black.username': { $regex: q, $options: 'i' } }
          ]
        }
      },
      {
        $project: {
          player: [
            { username: '$players.white.username' },
            { username: '$players.black.username' }
          ]
        }
      },
      { $unwind: '$player' },
      { $match: { 'player.username': { $regex: q, $options: 'i' } } },
      { $group: { _id: '$player.username', totalMatches: { $sum: 1 } } },
      { $sort: { totalMatches: -1 } },
      { $limit: limit },
      { $project: { _id: 0, username: '$_id' } }
    ]),
    Game.aggregate([
      { $match: { 'opening.eco': { $regex: q, $options: 'i' } } },
      { $group: { _id: '$opening.eco', totalGames: { $sum: 1 } } },
      { $sort: { totalGames: -1 } },
      { $limit: limit },
      { $project: { _id: 0, eco: '$_id' } }
    ])
  ]);

  return {
    openings: openings.map(o => o.name),
    players: players.map(p => p.username),
    eco: eco.map(e => e.eco)
  };
};

const buildFuzzyRegex = (str) => {
  const chars = str.split('').filter(c => c.trim() !== '');
  return chars.join('.*?'); 
};

const searchFuzzy = async (query) => {
  const q = query.q || '';
  const fuzzyRegex = buildFuzzyRegex(q);
  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 20;
  const skip = (page - 1) * limit;

  const pipeline = [
    { $match: { 'opening.name': { $regex: fuzzyRegex, $options: 'i' } } },
    {
      $group: {
        _id: '$opening.name',
        eco: { $first: '$opening.eco' },
        totalGames: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0,
        name: '$_id',
        eco: 1,
        totalGames: 1
      }
    },
    { $sort: { totalGames: -1 } }
  ];

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

module.exports = {
  searchOpenings,
  searchPlayers,
  searchEco,
  getAutocomplete,
  searchFuzzy
};
