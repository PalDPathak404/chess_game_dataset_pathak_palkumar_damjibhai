import { useState, useMemo, useCallback, useEffect } from 'react';
import { Chess } from 'chess.js';

export const useChessPlayback = (analyzedMoves) => {
  const [currentMoveIndex, setCurrentMoveIndex] = useState(-1);
  
  // Memoize the array of FENs up front so we don't recalculate them on every render
  const fens = useMemo(() => {
    if (!analyzedMoves || analyzedMoves.length === 0) return [];
    
    const chess = new Chess();
    const fenList = [chess.fen()]; // index -1 (starting position)
    
    for (const move of analyzedMoves) {
      try {
        chess.move(move.notation);
        fenList.push(chess.fen());
      } catch (e) {
        console.error('Invalid move in sequence:', move.notation, e);
        // If a move is invalid, just push the last valid FEN
        fenList.push(chess.fen());
      }
    }
    return fenList;
  }, [analyzedMoves]);

  const maxIndex = fens.length - 2; // -1 because of initial state, -1 because 0-indexed moves
  
  const currentFen = currentMoveIndex === -1 ? fens[0] : fens[currentMoveIndex + 1] || fens[0];
  const isAtStart = currentMoveIndex === -1;
  const isAtEnd = currentMoveIndex >= maxIndex;

  const goToStart = useCallback(() => {
    setCurrentMoveIndex(-1);
  }, []);

  const goToEnd = useCallback(() => {
    setCurrentMoveIndex(maxIndex);
  }, [maxIndex]);

  const goToMoveIndex = useCallback((index) => {
    setCurrentMoveIndex(Math.max(-1, Math.min(index, maxIndex)));
  }, [maxIndex]);

  const nextMove = useCallback(() => {
    setCurrentMoveIndex(prev => (prev < maxIndex ? prev + 1 : prev));
  }, [maxIndex]);

  const prevMove = useCallback(() => {
    setCurrentMoveIndex(prev => (prev > -1 ? prev - 1 : prev));
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't intercept if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
      
      switch(e.key) {
        case 'ArrowRight':
          e.preventDefault();
          nextMove();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          prevMove();
          break;
        case 'Home':
          e.preventDefault();
          goToStart();
          break;
        case 'End':
          e.preventDefault();
          goToEnd();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextMove, prevMove, goToStart, goToEnd]);

  return {
    currentMoveIndex,
    currentFen,
    isAtStart,
    isAtEnd,
    maxIndex,
    goToStart,
    goToEnd,
    goToMoveIndex,
    nextMove,
    prevMove
  };
};
