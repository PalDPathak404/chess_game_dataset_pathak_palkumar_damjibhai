const createSeededRng = (seed) => {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) & 0xffffffff;
    return (state >>> 0) / 0xffffffff;
  };
};

const generateMoveSeed = (moves) => {
  let hash = 5381;
  for (const move of moves) {
    const str = `${move.moveNumber}${move.notation}${move.player}`;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) + hash + str.charCodeAt(i)) & 0xffffffff;
    }
  }
  return hash >>> 0;
};

const PHASE_BOUNDARIES = {
  opening: 0.25,
  middlegame: 0.65,
  endgame: 1.0
};

const getGamePhase = (moveIndex, totalMoves) => {
  const progress = moveIndex / totalMoves;
  if (progress < PHASE_BOUNDARIES.opening) return 'opening';
  if (progress < PHASE_BOUNDARIES.middlegame) return 'middlegame';
  return 'endgame';
};

const PHASE_VOLATILITY = {
  opening: 0.15,
  middlegame: 0.45,
  endgame: 0.25
};

const PHASE_DRIFT = {
  opening: 0.02,
  middlegame: 0.08,
  endgame: 0.04
};

const evaluatePosition = (previousEval, phase, rng) => {
  const volatility = PHASE_VOLATILITY[phase];
  const drift = PHASE_DRIFT[phase];

  const fluctuation = (rng() - 0.5) * 2 * volatility;
  const meanReversion = -previousEval * drift;

  const tacticalSpike = rng() < 0.08 ? (rng() - 0.5) * 3.0 : 0;

  let nextEval = previousEval + fluctuation + meanReversion + tacticalSpike;
  nextEval = Math.max(-10, Math.min(10, nextEval));

  return parseFloat(nextEval.toFixed(2));
};

const CLASSIFICATION_THRESHOLDS = {
  brilliant: { minDelta: 1.5, maxDelta: Infinity, favorable: true },
  great: { minDelta: 0.8, maxDelta: 1.5, favorable: true },
  best: { minDelta: 0.3, maxDelta: 0.8, favorable: true },
  good: { minDelta: 0.05, maxDelta: 0.3, favorable: true },
  neutral: { minDelta: -0.05, maxDelta: 0.05 },
  inaccuracy: { minDelta: 0.15, maxDelta: 0.5, favorable: false },
  mistake: { minDelta: 0.5, maxDelta: 1.5, favorable: false },
  blunder: { minDelta: 1.5, maxDelta: Infinity, favorable: false }
};

const classifyMove = (evalBefore, evalAfter, player, phase) => {
  const whiteRelativeBefore = evalBefore;
  const whiteRelativeAfter = evalAfter;

  const delta = player === 'white'
    ? whiteRelativeAfter - whiteRelativeBefore
    : whiteRelativeBefore - whiteRelativeAfter;

  if (phase === 'opening' && Math.abs(delta) < 0.3) {
    return delta >= 0 ? 'book' : 'good';
  }

  if (delta >= CLASSIFICATION_THRESHOLDS.brilliant.minDelta) return 'brilliant';
  if (delta >= CLASSIFICATION_THRESHOLDS.great.minDelta) return 'great';
  if (delta >= CLASSIFICATION_THRESHOLDS.best.minDelta) return 'best';
  if (delta >= CLASSIFICATION_THRESHOLDS.good.minDelta) return 'good';
  if (delta >= CLASSIFICATION_THRESHOLDS.neutral.minDelta) return 'neutral';

  const loss = Math.abs(delta);
  if (loss >= CLASSIFICATION_THRESHOLDS.blunder.minDelta) return 'blunder';
  if (loss >= CLASSIFICATION_THRESHOLDS.mistake.minDelta) return 'mistake';
  if (loss >= CLASSIFICATION_THRESHOLDS.inaccuracy.minDelta) return 'inaccuracy';

  return 'neutral';
};

const COACHING_CONTEXT = {
  brilliant: {
    opening: 'A surprising novelty that seizes the initiative early.',
    middlegame: 'Exceptional tactical vision! This move creates a decisive advantage your opponent cannot neutralize.',
    endgame: 'Precise calculation in the endgame — this move converts the position decisively.'
  },
  great: {
    opening: 'A strong deviation that puts immediate pressure on your opponent.',
    middlegame: 'Excellent choice. This significantly strengthens your position.',
    endgame: 'Well-calculated endgame technique. This move maximizes your winning chances.'
  },
  best: {
    opening: 'The engine\'s top choice — principled development.',
    middlegame: 'The strongest continuation available. Your position improves notably.',
    endgame: 'Accurate endgame play. This is the most precise path forward.'
  },
  good: {
    opening: 'Solid developing move that follows sound opening principles.',
    middlegame: 'A reasonable move that keeps the position balanced.',
    endgame: 'Adequate technique, though a slightly more precise continuation existed.'
  },
  book: {
    opening: 'Standard theory — a well-established continuation in this opening.',
    middlegame: 'A well-known position. Following established patterns here.',
    endgame: 'A textbook continuation for this type of ending.'
  },
  neutral: {
    opening: 'A playable move that neither improves nor weakens your position.',
    middlegame: 'Neither side gains an advantage from this move.',
    endgame: 'A quiet move. The position remains roughly balanced.'
  },
  forced: {
    opening: 'The only reasonable response in this position.',
    middlegame: 'Forced — there are no better alternatives here.',
    endgame: 'The only move that holds the position together.'
  },
  inaccuracy: {
    opening: 'Slightly imprecise. A more active developing move was available.',
    middlegame: 'This allows your opponent a small improvement. Look for more dynamic options.',
    endgame: 'A small slip in technique. Precision matters more in simplified positions.'
  },
  mistake: {
    opening: 'This move concedes early pressure. Revisit your opening preparation here.',
    middlegame: 'Significant positional concession. Your opponent gains a clear advantage.',
    endgame: 'A costly error in the endgame. Technique breaks down under pressure — practice this type of position.'
  },
  blunder: {
    opening: 'A serious opening error! This gives your opponent a decisive early advantage.',
    middlegame: 'Critical blunder! The evaluation swings dramatically. Always check for tactical threats before committing.',
    endgame: 'A devastating endgame blunder. One inaccurate move can throw away a drawn or won position.'
  }
};

const generateCoachingExplanation = (classification, phase, evalDelta) => {
  const phaseTemplates = COACHING_CONTEXT[classification];
  if (!phaseTemplates) return 'A reasonable move in this position.';

  const base = phaseTemplates[phase] || phaseTemplates.middlegame;

  if (['blunder', 'mistake'].includes(classification) && Math.abs(evalDelta) > 2.0) {
    return `${base} The evaluation shifted by ${Math.abs(evalDelta).toFixed(1)} points.`;
  }

  return base;
};

const generateEngineLinePlaceholder = (notation, classification, rng) => {
  if (['inaccuracy', 'mistake', 'blunder'].includes(classification)) {
    const pieces = ['N', 'B', 'R', 'Q', ''];
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = ['1', '2', '3', '4', '5', '6', '7', '8'];
    const piece = pieces[Math.floor(rng() * pieces.length)];
    const file = files[Math.floor(rng() * files.length)];
    const rank = ranks[Math.floor(rng() * ranks.length)];
    return `${piece}${file}${rank}`;
  }
  return '';
};

const analyzeGame = (moves, engineConfig = {}) => {
  const seed = generateMoveSeed(moves);
  const rng = createSeededRng(seed);

  const depth = engineConfig.depth || 20;
  const engineName = engineConfig.engine || 'knightly-sim-v2';

  let currentEval = 0.15 + (rng() - 0.5) * 0.2;
  const analyzedMoves = [];

  for (let i = 0; i < moves.length; i++) {
    const move = moves[i];
    const phase = getGamePhase(i, moves.length);
    const previousEval = currentEval;

    currentEval = evaluatePosition(previousEval, phase, rng);

    let classification = classifyMove(previousEval, currentEval, move.player, phase);

    if (phase === 'opening' && i < 6 && ['blunder', 'mistake'].includes(classification)) {
      classification = rng() < 0.85 ? 'inaccuracy' : classification;
    }

    const evalDelta = move.player === 'white'
      ? currentEval - previousEval
      : previousEval - currentEval;

    if (Math.abs(evalDelta) < 0.02 && rng() < 0.3) {
      classification = 'forced';
    }

    analyzedMoves.push({
      moveNumber: move.moveNumber,
      notation: move.notation,
      player: move.player,
      evaluation: currentEval,
      classification,
      explanation: generateCoachingExplanation(classification, phase, evalDelta),
      suggestedMove: generateEngineLinePlaceholder(move.notation, classification, rng)
    });
  }

  const countByClass = (cls) => analyzedMoves.filter(m => m.classification === cls).length;

  const blunderCount = countByClass('blunder');
  const mistakeCount = countByClass('mistake');
  const inaccuracyCount = countByClass('inaccuracy');
  const brilliantCount = countByClass('brilliant');
  const bestCount = countByClass('best');
  const totalMoves = moves.length;

  const openingMoves = analyzedMoves.filter((_, i) => getGamePhase(i, totalMoves) === 'opening');
  const endgameMoves = analyzedMoves.filter((_, i) => getGamePhase(i, totalMoves) === 'endgame');

  const calculatePhaseAccuracy = (phaseMoves) => {
    if (phaseMoves.length === 0) return '0.0%';
    const good = phaseMoves.filter(m => ['brilliant', 'great', 'best', 'good', 'book', 'neutral', 'forced'].includes(m.classification)).length;
    return `${((good / phaseMoves.length) * 100).toFixed(1)}%`;
  };

  const keyInsights = [];

  if (blunderCount > 0) {
    keyInsights.push(`${blunderCount} critical blunder${blunderCount > 1 ? 's' : ''} detected — review these positions carefully.`);
  }
  if (mistakeCount > 2) {
    keyInsights.push('Multiple mistakes found. Focus on calculating one move deeper before committing.');
  }
  if (brilliantCount > 0) {
    keyInsights.push(`${brilliantCount} brilliant move${brilliantCount > 1 ? 's' : ''} found — exceptional tactical vision!`);
  }
  if (bestCount > 5) {
    keyInsights.push(`Strong engine-level play with ${bestCount} best moves. Well-prepared game.`);
  }
  if (inaccuracyCount > 5) {
    keyInsights.push('Frequent inaccuracies suggest time pressure or unfamiliarity with the position type.');
  }
  if (totalMoves < 30) {
    keyInsights.push('Short game — consider whether your opening preparation was sufficient.');
  }
  if (totalMoves > 80) {
    keyInsights.push('Long endgame reached. Endgame technique practice is recommended.');
  }

  const summary = {
    totalMoves,
    brilliantMoves: brilliantCount,
    greatMoves: countByClass('great'),
    bestMoves: bestCount,
    goodMoves: countByClass('good'),
    bookMoves: countByClass('book'),
    forcedMoves: countByClass('forced'),
    inaccuracies: inaccuracyCount,
    mistakes: mistakeCount,
    blunders: blunderCount,
    openingAccuracy: calculatePhaseAccuracy(openingMoves),
    endgameAccuracy: calculatePhaseAccuracy(endgameMoves),
    keyInsights
  };

  const engineMetadata = {
    engine: engineName,
    engineVersion: '2.0.0',
    depth,
    nodesSearched: Math.floor(totalMoves * depth * 15000 + rng() * 50000),
    evaluationSource: 'deterministic-simulation',
    confidence: parseFloat((0.85 + rng() * 0.12).toFixed(3))
  };

  return { analyzedMoves, summary, engineMetadata };
};

module.exports = {
  analyzeGame,
  evaluatePosition,
  classifyMove,
  generateCoachingExplanation,
  getGamePhase,
  PHASE_BOUNDARIES,
  CLASSIFICATION_THRESHOLDS
};
