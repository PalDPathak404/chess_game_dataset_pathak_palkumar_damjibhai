const Review = require('../models/review.model');
const Game = require('../models/game.model');
const mongoose = require('mongoose');

const resolveMatch = async (matchId) => {
  if (mongoose.Types.ObjectId.isValid(matchId)) {
    const match = await Game.findById(matchId);
    if (match) return match;
  }
  return await Game.findOne({ gameId: matchId });
};

const CLASSIFICATIONS = ['brilliant', 'great', 'good', 'book', 'inaccuracy', 'mistake', 'blunder', 'neutral'];
const CLASSIFICATION_WEIGHTS = [0.02, 0.08, 0.2, 0.15, 0.12, 0.08, 0.03, 0.32];

const COACHING_TEMPLATES = {
  brilliant: 'Exceptional move! This creates a decisive tactical advantage that\'s hard to find.',
  great: 'Strong choice. This move improves your position significantly.',
  good: 'Solid move that maintains your advantage.',
  book: 'Standard opening theory — a well-known continuation.',
  inaccuracy: 'Slightly imprecise. A stronger continuation existed here.',
  mistake: 'This move loses some of your advantage. Consider looking for more active options.',
  blunder: 'Critical error! This drastically changes the evaluation. Always check for threats before moving.',
  neutral: 'A reasonable move in this position.'
};

const pickWeightedClassification = () => {
  const random = Math.random();
  let cumulative = 0;
  for (let i = 0; i < CLASSIFICATIONS.length; i++) {
    cumulative += CLASSIFICATION_WEIGHTS[i];
    if (random <= cumulative) return CLASSIFICATIONS[i];
  }
  return 'neutral';
};

const generateMockEvaluation = (moveIndex, totalMoves) => {
  const phase = moveIndex / totalMoves;
  const base = (Math.random() - 0.5) * 3;
  const swing = phase > 0.7 ? (Math.random() - 0.5) * 5 : 0;
  return parseFloat((base + swing).toFixed(2));
};

const generateMockAnalysis = (moves) => {
  const analyzedMoves = moves.map((move, index) => {
    const classification = pickWeightedClassification();
    return {
      moveNumber: move.moveNumber,
      notation: move.notation,
      player: move.player,
      evaluation: generateMockEvaluation(index, moves.length),
      classification,
      explanation: COACHING_TEMPLATES[classification],
      suggestedMove: ['inaccuracy', 'mistake', 'blunder'].includes(classification) ? `${move.notation}+` : ''
    };
  });

  const countByClass = (cls) => analyzedMoves.filter(m => m.classification === cls).length;

  const keyInsights = [];
  const blunderCount = countByClass('blunder');
  const mistakeCount = countByClass('mistake');
  const brilliantCount = countByClass('brilliant');

  if (blunderCount > 0) keyInsights.push(`${blunderCount} critical blunder${blunderCount > 1 ? 's' : ''} detected — review these carefully.`);
  if (mistakeCount > 2) keyInsights.push(`Multiple mistakes found. Focus on calculating one move deeper before committing.`);
  if (brilliantCount > 0) keyInsights.push(`${brilliantCount} brilliant move${brilliantCount > 1 ? 's' : ''} found — great tactical vision!`);
  if (moves.length < 30) keyInsights.push('Short game — consider whether the opening preparation was sufficient.');
  if (moves.length > 80) keyInsights.push('Long endgame reached. Endgame technique practice is recommended.');

  const summary = {
    totalMoves: moves.length,
    brilliantMoves: brilliantCount,
    greatMoves: countByClass('great'),
    goodMoves: countByClass('good'),
    inaccuracies: countByClass('inaccuracy'),
    mistakes: mistakeCount,
    blunders: blunderCount,
    openingAccuracy: `${(70 + Math.random() * 25).toFixed(1)}%`,
    endgameAccuracy: `${(55 + Math.random() * 35).toFixed(1)}%`,
    keyInsights
  };

  return { analyzedMoves, summary };
};

const createReview = async (matchId, reviewType = 'full') => {
  const match = await resolveMatch(matchId);
  if (!match) return null;

  const existingReview = await Review.findOne({ match: match._id, reviewType, status: 'completed' });
  if (existingReview) return existingReview;

  const { analyzedMoves, summary } = generateMockAnalysis(match.moves);

  const review = await Review.create({
    match: match._id,
    reviewType,
    status: 'completed',
    progress: 100,
    analyzedMoves,
    summary
  });

  return review;
};

const getReviewById = async (reviewId) => {
  return await Review.findById(reviewId).populate('match', 'gameId players opening winner victoryStatus turns');
};

const getReviewByMatch = async (matchId) => {
  const match = await resolveMatch(matchId);
  if (!match) return null;
  return await Review.findOne({ match: match._id }).sort({ createdAt: -1 }).populate('match', 'gameId players opening winner victoryStatus turns');
};

module.exports = {
  createReview,
  getReviewById,
  getReviewByMatch
};
