const mongoose = require('mongoose');

const moveSchema = new mongoose.Schema({
  moveNumber: { type: Number, required: true },
  notation: { type: String, required: true },
  player: { type: String, enum: ['white', 'black'], required: true }
}, { _id: false });

const gameSchema = new mongoose.Schema({
  gameId: { type: String, unique: true, required: true },
  rated: { type: Boolean, default: true, index: true },
  turns: { type: Number, required: true },
  victoryStatus: { 
    type: String, 
    enum: ['mate', 'resign', 'outoftime', 'draw'], 
    required: true 
  },
  winner: { 
    type: String, 
    enum: ['white', 'black', 'draw'], 
    required: true,
    index: true
  },
  incrementCode: { type: String },
  players: {
    white: {
      username: { type: String, required: true, index: true },
      rating: { type: Number, default: 0, index: true }
    },
    black: {
      username: { type: String, required: true, index: true },
      rating: { type: Number, default: 0, index: true }
    }
  },
  opening: {
    name: { type: String, index: true },
    eco: { type: String },
    ply: { type: Number }
  },
  moves: [moveSchema],
  matchCreatedAt: { type: Date, index: true },
  lastMoveAt: { type: Date },
  sourceType: {
    type: String,
    enum: ['dataset', 'imported'],
    default: 'dataset',
    index: true
  },
  importMetadata: {
    originalPgn: { type: String },
    importedAt: { type: Date },
    importedBy: { type: String, default: 'anonymous' },
    site: { type: String },
    event: { type: String }
  }
}, { 
  timestamps: true
});

gameSchema.index({ 'players.white.rating': -1, winner: 1 });
gameSchema.index({ 'players.black.rating': -1, winner: 1 });
gameSchema.index({ 'opening.name': 1, matchCreatedAt: -1 });
gameSchema.index({ sourceType: 1, matchCreatedAt: -1 });

module.exports = mongoose.model('Game', gameSchema);
