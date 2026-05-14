const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Game = require('../models/game.model');
const connectDB = require('../config/db');

const seedDataset = async () => {
  try {
    await connectDB();

    const dataPath = path.join(__dirname, '../../data/dataset.json');
    
    if (!fs.existsSync(dataPath)) {
      console.error(`Dataset not found at ${dataPath}. Please ensure the JSON file is placed there.`);
      process.exit(1);
    }

    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const games = JSON.parse(rawData);

    console.log(`Loaded ${games.length} games from dataset.`);

    let inserted = 0;
    let skipped = 0;

    for (const rawGame of games) {
      // Use a unique identifier from the dataset or fallback to a combination to prevent duplicates
      const gameId = rawGame.id || `${rawGame.white_id}-${rawGame.black_id}-${rawGame.created_at}`;

      const exists = await Game.findOne({ gameId });
      if (exists) {
        skipped++;
        continue;
      }

      // Transform raw moves string to array
      const movesArray = [];
      if (rawGame.moves) {
        const movesList = rawGame.moves.split(' ');
        movesList.forEach((notation, index) => {
          movesArray.push({
            moveNumber: Math.floor(index / 2) + 1,
            notation: notation,
            player: index % 2 === 0 ? 'white' : 'black'
          });
        });
      }

      const newGame = new Game({
        gameId: gameId,
        rated: rawGame.rated === true || rawGame.rated === 'true',
        turns: rawGame.turns || 0,
        victoryStatus: rawGame.victory_status || 'draw',
        winner: rawGame.winner || 'draw',
        incrementCode: rawGame.increment_code,
        players: {
          white: {
            username: rawGame.white_id || 'unknown',
            rating: rawGame.white_rating || 0
          },
          black: {
            username: rawGame.black_id || 'unknown',
            rating: rawGame.black_rating || 0
          }
        },
        opening: {
          name: rawGame.opening_name,
          eco: rawGame.opening_eco,
          ply: rawGame.opening_ply
        },
        moves: movesArray,
        matchCreatedAt: rawGame.created_at ? new Date(rawGame.created_at) : null,
        lastMoveAt: rawGame.last_move_at ? new Date(rawGame.last_move_at) : null
      });

      await newGame.save();
      inserted++;

      if (inserted % 1000 === 0) {
        console.log(`Inserted ${inserted} games...`);
      }
    }

    console.log(`Seeding complete. Inserted: ${inserted}, Skipped (duplicates): ${skipped}`);
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedDataset();
