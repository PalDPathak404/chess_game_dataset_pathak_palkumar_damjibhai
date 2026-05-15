const Game = require('../models/game.model');

const getVictoryDistribution = async () => {
  const pipeline = [
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        whiteWins: { $sum: { $cond: [{ $eq: ['$winner', 'white'] }, 1, 0] } },
        blackWins: { $sum: { $cond: [{ $eq: ['$winner', 'black'] }, 1, 0] } },
        draws: { $sum: { $cond: [{ $eq: ['$winner', 'draw'] }, 1, 0] } },
        mates: { $sum: { $cond: [{ $eq: ['$victoryStatus', 'mate'] }, 1, 0] } },
        resigns: { $sum: { $cond: [{ $eq: ['$victoryStatus', 'resign'] }, 1, 0] } },
        timeouts: { $sum: { $cond: [{ $eq: ['$victoryStatus', 'outoftime'] }, 1, 0] } }
      }
    },
    {
      $project: {
        _id: 0,
        totalMatches: '$total',
        whiteWinPercentage: { $round: [{ $multiply: [{ $divide: ['$whiteWins', '$total'] }, 100] }, 2] },
        blackWinPercentage: { $round: [{ $multiply: [{ $divide: ['$blackWins', '$total'] }, 100] }, 2] },
        drawPercentage: { $round: [{ $multiply: [{ $divide: ['$draws', '$total'] }, 100] }, 2] },
        matePercentage: { $round: [{ $multiply: [{ $divide: ['$mates', '$total'] }, 100] }, 2] },
        resignPercentage: { $round: [{ $multiply: [{ $divide: ['$resigns', '$total'] }, 100] }, 2] },
        timeoutPercentage: { $round: [{ $multiply: [{ $divide: ['$timeouts', '$total'] }, 100] }, 2] }
      }
    }
  ];

  const result = await Game.aggregate(pipeline);
  return result.length > 0 ? result[0] : null;
};

const getOpeningSuccess = async (query) => {
  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 50;
  const skip = (page - 1) * limit;
  const minGames = parseInt(query.minGames, 10) || 10;
  
  const pipeline = [
    {
      $group: {
        _id: '$opening.name',
        totalGames: { $sum: 1 },
        whiteWins: { $sum: { $cond: [{ $eq: ['$winner', 'white'] }, 1, 0] } },
        blackWins: { $sum: { $cond: [{ $eq: ['$winner', 'black'] }, 1, 0] } },
        draws: { $sum: { $cond: [{ $eq: ['$winner', 'draw'] }, 1, 0] } },
        totalTurns: { $sum: '$turns' }
      }
    },
    {
      $match: { totalGames: { $gte: minGames } }
    },
    {
      $project: {
        openingName: '$_id',
        _id: 0,
        totalGames: 1,
        whiteWinRate: { $round: [{ $multiply: [{ $divide: ['$whiteWins', '$totalGames'] }, 100] }, 2] },
        blackWinRate: { $round: [{ $multiply: [{ $divide: ['$blackWins', '$totalGames'] }, 100] }, 2] },
        drawRate: { $round: [{ $multiply: [{ $divide: ['$draws', '$totalGames'] }, 100] }, 2] },
        averageTurns: { $round: [{ $divide: ['$totalTurns', '$totalGames'] }, 1] }
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
  getVictoryDistribution,
  getOpeningSuccess
};
