const parseHeaders = (pgn) => {
  const headers = {};
  const headerRegex = /\[(\w+)\s+"([^"]*)"\]/g;
  let match;
  while ((match = headerRegex.exec(pgn)) !== null) {
    headers[match[1]] = match[2];
  }
  return headers;
};

const parseMoveText = (pgn) => {
  const moveSection = pgn.replace(/\[.*?\]\s*/g, '').trim();

  const cleaned = moveSection
    .replace(/\{[^}]*\}/g, '')
    .replace(/\([^)]*\)/g, '')
    .replace(/\$\d+/g, '')
    .replace(/\d+\.\.\./g, '')
    .replace(/(1-0|0-1|1\/2-1\/2|\*)\s*$/, '')
    .trim();

  const tokens = cleaned.split(/\s+/).filter(t => t && !/^\d+\.$/.test(t));

  const moves = [];
  let moveNumber = 1;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (/^\d+\.$/.test(token)) continue;

    const notation = token.replace(/^\d+\./, '');
    if (!notation || /^(1-0|0-1|1\/2-1\/2|\*)$/.test(notation)) continue;

    const player = moves.length % 2 === 0 ? 'white' : 'black';

    moves.push({
      moveNumber: Math.floor(moves.length / 2) + 1,
      notation,
      player
    });
  }

  return moves;
};

const determineResult = (headers) => {
  const result = headers.Result || '*';
  if (result === '1-0') return { winner: 'white', victoryStatus: 'resign' };
  if (result === '0-1') return { winner: 'black', victoryStatus: 'resign' };
  if (result === '1/2-1/2') return { winner: 'draw', victoryStatus: 'draw' };
  return { winner: 'draw', victoryStatus: 'draw' };
};

const generateImportId = () => {
  return `imp_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 6)}`;
};

const isValidChessMove = (notation) => {
  // Lightweight regex to catch the vast majority of valid standard algebraic notation
  // Matches: e4, Nf3, exd5, O-O, O-O-O, R1xd4, e8=Q#, etc.
  const moveRegex = /^([KQRBN]?[a-h]?[1-8]?x?[a-h][1-8](=[QRBN])?[+#]?|O-O(-O)?[+#]?)$/;
  return moveRegex.test(notation);
};

const parsePgn = (rawPgn) => {
  if (!rawPgn || typeof rawPgn !== 'string' || rawPgn.trim().length === 0) {
    return null;
  }

  // Quick structural check: real PGNs almost always contain a first move marker
  if (!/\b1\.\s*/.test(rawPgn)) {
    return null;
  }

  const headers = parseHeaders(rawPgn);
  const moves = parseMoveText(rawPgn);

  if (moves.length === 0) return null;

  // Sanity validation: ensure the token stream actually looks like chess moves.
  // We use a 50% threshold to gracefully handle occasional weird annotations/typos
  // while aggressively rejecting "hello world" or completely random text.
  const validMovesCount = moves.filter(m => isValidChessMove(m.notation)).length;
  const validRatio = validMovesCount / moves.length;

  if (validRatio < 0.5) {
    return null;
  }

  const { winner, victoryStatus } = determineResult(headers);

  return {
    gameId: generateImportId(),
    rated: false,
    turns: moves.length,
    victoryStatus,
    winner,
    incrementCode: headers.TimeControl || '',
    players: {
      white: {
        username: headers.White || 'Unknown',
        rating: parseInt(headers.WhiteElo, 10) || 0
      },
      black: {
        username: headers.Black || 'Unknown',
        rating: parseInt(headers.BlackElo, 10) || 0
      }
    },
    opening: {
      name: headers.Opening || headers.ECO || '',
      eco: headers.ECO || '',
      ply: 0
    },
    moves,
    matchCreatedAt: headers.Date ? new Date(headers.Date.replace(/\./g, '-')) : new Date(),
    sourceType: 'imported',
    importMetadata: {
      originalPgn: rawPgn.trim(),
      importedAt: new Date(),
      importedBy: 'anonymous',
      site: headers.Site || '',
      event: headers.Event || ''
    }
  };
};

module.exports = { parsePgn };
