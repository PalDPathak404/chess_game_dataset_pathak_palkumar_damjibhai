const mongoose = require('mongoose');

// Define Move Subdocument Schema
// This array-based structure replaces raw move strings to future-proof 
// the platform for move-by-move analytics, Stockfish integration, and AI explanations.
const moveSchema = new mongoose.Schema({
  moveNumber: { type: Number, required: true }, // e.g., 1 (for both white's and black's turn in half-moves)
  notation: { type: String, required: true },   // e.g., "e4", "Nf3", "O-O"
  player: { type: String, enum: ['white', 'black'], required: true },
  
  // Future AI & Engine Analytics Fields
  engineEvaluation: { type: Number },           // Centipawn evaluation (e.g., +0.5, -1.2) or mate in X
  aiExplanation: { type: String },              // Natural language coaching explanation
  
  // Categorization flags for quick UI rendering and filtering
  isMistake: { type: Boolean, default: false },
  isBlunder: { type: Boolean, default: false },
  isBrilliant: { type: Boolean, default: false },
}, { _id: false }); // Disable _id for subdocuments to save space and improve query performance

const gameSchema = new mongoose.Schema({
  // Core Match Metadata
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
  incrementCode: { type: String }, // e.g., "10+0", "15+10"
  
  // Player Information
  players: {
    white: {
      username: { type: String, required: true, index: true },
      rating: { type: Number, required: true, index: true }
    },
    black: {
      username: { type: String, required: true, index: true },
      rating: { type: Number, required: true, index: true }
    }
  },

  // Opening Information (Clean embedded structure)
  opening: {
    name: { type: String, index: true },
    eco: { type: String }, // e.g., "C20", "B01"
    ply: { type: Number }
  },

  // Structured Move List
  moves: [moveSchema],

  // Dataset Original Timestamps
  matchCreatedAt: { type: Date, index: true }, // Mapped from original 'created_at'
  lastMoveAt: { type: Date }

}, { 
  timestamps: true // Automatically manages createdAt/updatedAt for the DB document itself
});

// Compound Indexes for advanced analytics and dashboard filtering
// e.g., "Show me all high-rated games won by white"
gameSchema.index({ 'players.white.rating': -1, winner: 1 });
gameSchema.index({ 'players.black.rating': -1, winner: 1 });

// e.g., "Show me the most recent games featuring the Sicilian Defense"
gameSchema.index({ 'opening.name': 1, matchCreatedAt: -1 });

module.exports = mongoose.model('Game', gameSchema);
