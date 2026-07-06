import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Chessboard } from 'react-chessboard';
import { 
  Play, Pause, SkipBack, SkipForward, FastForward, 
  Settings, Target, Zap, AlertTriangle, Lightbulb 
} from 'lucide-react';

const TopReviewBar = () => (
  <header className="rev-topbar">
    <div className="rev-players">
      <div className="rev-player rev-player--white">
        <div className="rev-avatar">M</div>
        <span className="rev-name">Magnus Carlsen</span>
        <span className="rev-rating">2853</span>
      </div>
      <div className="rev-vs">vs</div>
      <div className="rev-player rev-player--black">
        <div className="rev-avatar rev-avatar--dark">H</div>
        <span className="rev-name">Hikaru Nakamura</span>
        <span className="rev-rating">2789</span>
      </div>
    </div>
    
    <div className="rev-meta">
      <div className="rev-meta-item">
        <span className="rev-meta-label">Opening</span>
        <span className="rev-meta-value">Ruy Lopez: Morphy Defense</span>
      </div>
      <div className="rev-meta-item">
        <span className="rev-meta-label">Result</span>
        <span className="rev-meta-value">1-0</span>
      </div>
      <div className="rev-meta-item">
        <span className="rev-meta-label">Accuracy</span>
        <span className="rev-meta-value rev-accuracy">
          <span style={{color: 'var(--text-primary)'}}>94.2%</span> / <span style={{color: 'var(--text-secondary)'}}>88.1%</span>
        </span>
      </div>
      <div className="rev-meta-item">
        <span className="rev-meta-label">Imported</span>
        <span className="rev-meta-value">Today</span>
      </div>
    </div>
  </header>
);

const MoveTimeline = () => {
  // Dummy moves for foundation
  const moves = [
    { num: 1, w: 'e4', b: 'e5' },
    { num: 2, w: 'Nf3', b: 'Nc6' },
    { num: 3, w: 'Bb5', b: 'a6' },
    { num: 4, w: 'Ba4', b: 'Nf6' },
    { num: 5, w: 'O-O', b: 'Be7' },
    { num: 6, w: 'Re1', b: 'b5' },
    { num: 7, w: 'Bb3', b: 'd6' },
    { num: 8, w: 'c3', b: 'O-O' },
    { num: 9, w: 'h3', b: 'Nb8' },
    { num: 10, w: 'd4', b: 'Nbd7' }
  ];

  const [activeMove, setActiveMove] = useState('3w');

  return (
    <aside className="rev-timeline">
      <div className="rev-timeline-header">
        <h3>Move Timeline</h3>
      </div>
      <div className="rev-timeline-scroll">
        {moves.map(m => (
          <div key={m.num} className="rev-move-row">
            <div className="rev-move-num">{m.num}.</div>
            <button 
              className={`rev-move-btn ${activeMove === `${m.num}w` ? 'rev-move-btn--active' : ''}`}
              onClick={() => setActiveMove(`${m.num}w`)}
            >
              {m.w}
            </button>
            <button 
              className={`rev-move-btn ${activeMove === `${m.num}b` ? 'rev-move-btn--active' : ''}`}
              onClick={() => setActiveMove(`${m.num}b`)}
            >
              {m.b}
            </button>
          </div>
        ))}
      </div>
    </aside>
  );
};

const BoardSection = () => {
  return (
    <main className="rev-board-section">
      <div className="rev-board-wrapper">
        <div className="rev-board-container">
          <Chessboard 
            id="ReviewWorkspaceBoard" 
            position="r1bqk2r/2ppbppp/p1n2n2/1p2p3/4P3/1B3N2/PPPP1PPP/RNBQR1K1 w kq - 2 7"
            customDarkSquareStyle={{ backgroundColor: '#27272a' }}
            customLightSquareStyle={{ backgroundColor: '#52525b' }}
            animationDuration={300}
          />
        </div>
        
        <div className="rev-controls">
          <div className="rev-controls-playback">
            <button className="rev-icon-btn" title="Previous Move"><SkipBack size={18} /></button>
            <button className="rev-icon-btn rev-icon-btn--play" title="Play/Pause"><Play size={20} /></button>
            <button className="rev-icon-btn" title="Next Move"><SkipForward size={18} /></button>
          </div>
          
          <div className="rev-controls-graph">
            {/* Placeholder for evaluation graph */}
            <div className="rev-graph-placeholder">
              <div className="rev-graph-line" style={{ width: '40%', backgroundColor: 'var(--text-primary)' }} />
              <div className="rev-graph-line" style={{ width: '60%', backgroundColor: 'var(--text-muted)' }} />
            </div>
          </div>
          
          <div className="rev-controls-settings">
            <button className="rev-icon-btn" title="Speed"><FastForward size={18} /></button>
            <button className="rev-icon-btn" title="Settings"><Settings size={18} /></button>
          </div>
        </div>
      </div>
    </main>
  );
};

const AICoachPanel = () => (
  <aside className="rev-coach">
    <div className="rev-coach-header">
      <h2>AI Coach Insights</h2>
    </div>
    
    <div className="rev-coach-scroll">
      <div className="rev-insight-card">
        <div className="rev-insight-header">
          <Target size={16} className="rev-insight-icon" />
          <h3>Game Summary</h3>
        </div>
        <p className="rev-insight-text">
          A solid Spanish Game where White maintained a slight edge through the opening. Black's deviation on move 9 allowed White to build a strong center.
        </p>
      </div>

      <div className="rev-insight-card rev-insight-card--strength">
        <div className="rev-insight-header">
          <Zap size={16} className="rev-insight-icon" style={{color: '#22c55e'}} />
          <h3 style={{color: '#22c55e'}}>Strengths</h3>
        </div>
        <ul className="rev-insight-list">
          <li>Excellent piece coordination in the middle game.</li>
          <li>Precise conversion of the endgame advantage.</li>
        </ul>
      </div>

      <div className="rev-insight-card rev-insight-card--mistake">
        <div className="rev-insight-header">
          <AlertTriangle size={16} className="rev-insight-icon" style={{color: '#ef4444'}} />
          <h3 style={{color: '#ef4444'}}>Mistakes</h3>
        </div>
        <ul className="rev-insight-list">
          <li>14. c4 was slightly premature, weakening d4.</li>
          <li>Missed a tactical sequence on move 22.</li>
        </ul>
      </div>

      <div className="rev-insight-card">
        <div className="rev-insight-header">
          <Lightbulb size={16} className="rev-insight-icon" style={{color: '#eab308'}} />
          <h3 style={{color: '#eab308'}}>Recommendation</h3>
        </div>
        <p className="rev-insight-text">
          Focus on identifying opponent's prophylactic moves in closed positions. Review games by Karpov to improve maneuvering.
        </p>
      </div>

      <div className="rev-insight-card rev-insight-card--move">
        <div className="rev-insight-header">
          <h3>Move Explanation: 3... a6</h3>
        </div>
        <p className="rev-insight-text">
          The Morphy Defense. Black forces the bishop to make a decision immediately, typically retreating to a4 while securing space on the queenside.
        </p>
      </div>
    </div>
  </aside>
);

export const ReviewWorkspace = () => {
  const { id } = useParams();
  
  // Fade in animation trigger
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className={`rev-workspace ${mounted ? 'rev-workspace--ready' : ''}`}>
      <TopReviewBar />
      <div className="rev-layout">
        <MoveTimeline />
        <BoardSection />
        <AICoachPanel />
      </div>
    </div>
  );
};
