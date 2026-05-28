/**
 * aiResponse.util.js
 * 
 * A lightweight utility for mocked context extraction and prompt assembly.
 * Prepares the architecture for future OpenAI integration by explicitly
 * handling context injection, move-awareness, and beginner-friendly coaching
 * tone, even while the actual responses are currently mocked.
 */

const generateMockedResponse = (content, review) => {
  const contentLower = content.toLowerCase();
  
  // Extract move number if mentioned (e.g., "Why was move 15 a blunder?")
  const moveMatch = contentLower.match(/move (\d+)/);
  const referencedMove = moveMatch ? parseInt(moveMatch[1], 10) : null;
  
  let responseText = "That's an interesting question about your game! In the future, I'll be able to give you a deep, personalized analysis here.";
  let coachingCategory = "general";
  
  if (referencedMove && review.analyzedMoves) {
    const moveData = review.analyzedMoves.find(m => m.moveNumber === referencedMove);
    if (moveData) {
      coachingCategory = moveData.classification || "general";
      
      if (['blunder', 'mistake', 'inaccuracy'].includes(coachingCategory)) {
        responseText = `Ah, move ${referencedMove} (${moveData.notation}). The engine classified this as a ${coachingCategory}. ${moveData.explanation || 'It seems this move gave up some advantage.'} As a beginner, don't let this discourage you. A better alternative would have been to look for safer squares or focus on piece development.`;
      } else if (['brilliant', 'great', 'best', 'good'].includes(coachingCategory)) {
        responseText = `Move ${referencedMove} (${moveData.notation}) was a ${coachingCategory} move! ${moveData.explanation || 'You found a very strong continuation here.'} Keep looking for these kinds of solid tactical opportunities.`;
      } else if (coachingCategory === 'book') {
        responseText = `Move ${referencedMove} (${moveData.notation}) is standard opening theory. Developing your pieces naturally like this in the opening is exactly what you want to do.`;
      } else {
        responseText = `Let's look at move ${referencedMove} (${moveData.notation}). ${moveData.explanation || 'This was a solid, if unremarkable, move in this position.'}`;
      }
    } else {
      responseText = `I couldn't find detailed analysis for move ${referencedMove} in this review. Let's focus on the key insights from the overall game instead.`;
    }
  } else if (contentLower.includes("blunder") || contentLower.includes("mistake") || contentLower.includes("bad")) {
    coachingCategory = "blunder";
    const blunders = review.summary?.blunders || 0;
    responseText = `You had ${blunders} blunders in this game. Don't worry, even grandmasters make mistakes! The most important thing for a beginner is to always double-check if your pieces are defended before you move.`;
  } else if (contentLower.includes("opening")) {
    coachingCategory = "opening";
    responseText = `Your opening play was pretty solid. Remember the core principles: control the center, develop your minor pieces (knights and bishops), and get your king to safety by castling early.`;
  } else if (contentLower.includes("improve") || contentLower.includes("advice")) {
    coachingCategory = "general";
    const accuracy = review.summary?.accuracy ? `${review.summary.accuracy}%` : 'this game';
    responseText = `Based on your overall accuracy (${accuracy}), focusing on board vision and not hanging pieces will yield the biggest improvements. Let's keep practicing!`;
  }

  return {
    content: responseText,
    context: {
      referencedMove,
      coachingCategory
    }
  };
};

module.exports = {
  generateMockedResponse
};
