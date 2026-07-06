import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Chessboard } from 'react-chessboard';
import {
  Play, SkipBack, SkipForward, FastForward,
  Settings, Target, Zap, AlertTriangle, Lightbulb,
  RefreshCw, AlertCircle, BarChart3
} from 'lucide-react';
import { fetchReview } from '../services/review.service';

const CLASSIFICATION_COLORS = {
  brilliant: '#a78bfa',
  great: '#60a5fa',
  best: '#34d399',
  good: '#6ee7b7',
  book: '#94a3b8',
  forced: '#94a3b8',
  neutral: '#71717a',
  inaccuracy: '#fbbf24',
  mistake: '#f97316',
  blunder: '#ef4444'
};

const formatResult = (winner, victoryStatus) => {
  if (winner === 'draw') return '½-½';
  const score = winner === 'white' ? '1-0' : '0-1';
  const method = victoryStatus === 'mate' ? 'Checkmate'
    : victoryStatus === 'resign' ? 'Resignation'
    : victoryStatus === 'outoftime' ? 'Time'
    : '';
  return method ? `${score} (${method})` : score;
};

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now - d;
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const SkeletonBlock = ({ width, height = 14 }) => (
  <div className="skeleton" style={{ width, height, borderRadius: 4 }} />
);

const TopReviewBarSkeleton = () => (
  <header className="rev-topbar">
    <div className="rev-players">
      <div className="rev-player"><SkeletonBlock width={24} height={24} /><SkeletonBlock width={100} /><SkeletonBlock width={30} /></div>
      <div className="rev-vs">vs</div>
      <div className="rev-player"><SkeletonBlock width={24} height={24} /><SkeletonBlock width={100} /><SkeletonBlock width={30} /></div>
    </div>
    <div className="rev-meta">
      {[1,2,3,4].map(i => <div key={i} className="rev-meta-item"><SkeletonBlock width={40} height={10} /><SkeletonBlock width={80} /></div>)}
    </div>
  </header>
);

const TimelineSkeleton = () => (
  <aside className="rev-timeline">
    <div className="rev-timeline-header"><h3>Move Timeline</h3></div>
    <div className="rev-timeline-scroll">
      {Array.from({ length: 10 }, (_, i) => (
        <div key={i} className="rev-move-row">
          <div className="rev-move-num"><SkeletonBlock width={20} /></div>
          <div style={{ flex: 1, padding: '0.35rem 0.5rem' }}><SkeletonBlock width="70%" /></div>
          <div style={{ flex: 1, padding: '0.35rem 0.5rem' }}><SkeletonBlock width="70%" /></div>
        </div>
      ))}
    </div>
  </aside>
);

const CoachSkeleton = () => (
  <aside className="rev-coach">
    <div className="rev-coach-header"><h2>AI Coach Insights</h2></div>
    <div className="rev-coach-scroll">
      {[1,2,3,4].map(i => (
        <div key={i} className="rev-insight-card">
          <div className="rev-insight-header"><SkeletonBlock width={16} height={16} /><SkeletonBlock width={100} /></div>
          <SkeletonBlock width="100%" height={40} />
        </div>
      ))}
    </div>
  </aside>
);

const ErrorState = ({ message, onRetry }) => (
  <div className="rev-error-state">
    <AlertCircle size={48} className="rev-error-icon" />
    <h2 className="rev-error-title">Unable to load review</h2>
    <p className="rev-error-desc">{message}</p>
    <button className="btn btn-primary rev-error-retry" onClick={onRetry}>
      <RefreshCw size={16} />
      Try Again
    </button>
  </div>
);

const TopReviewBar = ({ match, summary, createdAt }) => {
  const white = match?.players?.white;
  const black = match?.players?.black;

  return (
    <header className="rev-topbar">
      <div className="rev-players">
        <div className="rev-player rev-player--white">
          <div className="rev-avatar">{white?.username?.[0]?.toUpperCase() || 'W'}</div>
          <span className="rev-name">{white?.username || 'White'}</span>
          <span className="rev-rating">{white?.rating || '—'}</span>
        </div>
        <div className="rev-vs">vs</div>
        <div className="rev-player rev-player--black">
          <div className="rev-avatar rev-avatar--dark">{black?.username?.[0]?.toUpperCase() || 'B'}</div>
          <span className="rev-name">{black?.username || 'Black'}</span>
          <span className="rev-rating">{black?.rating || '—'}</span>
        </div>
      </div>

      <div className="rev-meta">
        <div className="rev-meta-item">
          <span className="rev-meta-label">Opening</span>
          <span className="rev-meta-value">{match?.opening?.name || 'Unknown'}</span>
        </div>
        <div className="rev-meta-item">
          <span className="rev-meta-label">Result</span>
          <span className="rev-meta-value">{formatResult(match?.winner, match?.victoryStatus)}</span>
        </div>
        <div className="rev-meta-item">
          <span className="rev-meta-label">Accuracy</span>
          <span className="rev-meta-value rev-accuracy">
            <span style={{color: 'var(--text-primary)'}}>{summary?.openingAccuracy || '—'}</span>
            {' / '}
            <span style={{color: 'var(--text-secondary)'}}>{summary?.endgameAccuracy || '—'}</span>
          </span>
        </div>
        <div className="rev-meta-item">
          <span className="rev-meta-label">Reviewed</span>
          <span className="rev-meta-value">{formatDate(createdAt)}</span>
        </div>
      </div>
    </header>
  );
};

const MoveTimeline = ({ analyzedMoves, activeMove, onMoveSelect }) => {
  const groupedMoves = useMemo(() => {
    if (!analyzedMoves?.length) return [];
    const groups = [];
    for (let i = 0; i < analyzedMoves.length; i++) {
      const m = analyzedMoves[i];
      if (m.player === 'white') {
        const blackMove = analyzedMoves[i + 1]?.player === 'black' ? analyzedMoves[i + 1] : null;
        groups.push({ num: m.moveNumber, w: m, b: blackMove });
        if (blackMove) i++;
      } else {
        groups.push({ num: m.moveNumber, w: null, b: m });
      }
    }
    return groups;
  }, [analyzedMoves]);

  return (
    <aside className="rev-timeline">
      <div className="rev-timeline-header">
        <h3>Move Timeline</h3>
      </div>
      <div className="rev-timeline-scroll">
        {groupedMoves.map(g => (
          <div key={`${g.num}-${g.w ? 'w' : 'b'}`} className="rev-move-row">
            <div className="rev-move-num">{g.num}.</div>
            {g.w ? (
              <button
                className={`rev-move-btn ${activeMove === `${g.num}w` ? 'rev-move-btn--active' : ''}`}
                onClick={() => onMoveSelect(`${g.num}w`, g.w)}
                style={{ borderLeft: `3px solid ${CLASSIFICATION_COLORS[g.w.classification] || 'transparent'}` }}
              >
                {g.w.notation}
              </button>
            ) : <div className="rev-move-btn rev-move-btn--empty" />}
            {g.b ? (
              <button
                className={`rev-move-btn ${activeMove === `${g.num}b` ? 'rev-move-btn--active' : ''}`}
                onClick={() => onMoveSelect(`${g.num}b`, g.b)}
                style={{ borderLeft: `3px solid ${CLASSIFICATION_COLORS[g.b.classification] || 'transparent'}` }}
              >
                {g.b.notation}
              </button>
            ) : <div className="rev-move-btn rev-move-btn--empty" />}
          </div>
        ))}
      </div>
    </aside>
  );
};

const BoardSection = () => (
  <main className="rev-board-section">
    <div className="rev-board-wrapper">
      <div className="rev-board-container">
        <Chessboard
          id="ReviewWorkspaceBoard"
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

const AICoachPanel = ({ summary, selectedMove }) => {
  const strengths = useMemo(() => {
    const items = [];
    if (summary?.brilliantMoves > 0) items.push(`${summary.brilliantMoves} brilliant move${summary.brilliantMoves > 1 ? 's' : ''} played.`);
    if (summary?.bestMoves > 0) items.push(`${summary.bestMoves} engine-best moves found.`);
    if (summary?.greatMoves > 0) items.push(`${summary.greatMoves} great moves demonstrated.`);
    if (items.length === 0) items.push('Solid play throughout the game.');
    return items;
  }, [summary]);

  const weaknesses = useMemo(() => {
    const items = [];
    if (summary?.blunders > 0) items.push(`${summary.blunders} blunder${summary.blunders > 1 ? 's' : ''} detected.`);
    if (summary?.mistakes > 0) items.push(`${summary.mistakes} mistake${summary.mistakes > 1 ? 's' : ''} found.`);
    if (summary?.inaccuracies > 0) items.push(`${summary.inaccuracies} inaccurac${summary.inaccuracies > 1 ? 'ies' : 'y'} identified.`);
    if (items.length === 0) items.push('No significant errors detected.');
    return items;
  }, [summary]);

  const recommendations = useMemo(() => {
    if (!summary?.keyInsights?.length) return ['Complete the full review to receive personalized recommendations.'];
    return summary.keyInsights;
  }, [summary]);

  return (
    <aside className="rev-coach">
      <div className="rev-coach-header">
        <h2>AI Coach Insights</h2>
      </div>

      <div className="rev-coach-scroll">
        <div className="rev-insight-card">
          <div className="rev-insight-header">
            <BarChart3 size={16} className="rev-insight-icon" />
            <h3>Game Summary</h3>
          </div>
          <div className="rev-stats-grid">
            <div className="rev-stat"><span className="rev-stat-value">{summary?.totalMoves || 0}</span><span className="rev-stat-label">Moves</span></div>
            <div className="rev-stat"><span className="rev-stat-value" style={{color: '#a78bfa'}}>{summary?.brilliantMoves || 0}</span><span className="rev-stat-label">Brilliant</span></div>
            <div className="rev-stat"><span className="rev-stat-value" style={{color: '#34d399'}}>{summary?.bestMoves || 0}</span><span className="rev-stat-label">Best</span></div>
            <div className="rev-stat"><span className="rev-stat-value" style={{color: '#ef4444'}}>{summary?.blunders || 0}</span><span className="rev-stat-label">Blunders</span></div>
          </div>
        </div>

        <div className="rev-insight-card rev-insight-card--strength">
          <div className="rev-insight-header">
            <Zap size={16} className="rev-insight-icon" style={{color: '#22c55e'}} />
            <h3 style={{color: '#22c55e'}}>Strengths</h3>
          </div>
          <ul className="rev-insight-list">
            {strengths.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </div>

        <div className="rev-insight-card rev-insight-card--mistake">
          <div className="rev-insight-header">
            <AlertTriangle size={16} className="rev-insight-icon" style={{color: '#ef4444'}} />
            <h3 style={{color: '#ef4444'}}>Weaknesses</h3>
          </div>
          <ul className="rev-insight-list">
            {weaknesses.map((w, i) => <li key={i}>{w}</li>)}
          </ul>
        </div>

        <div className="rev-insight-card">
          <div className="rev-insight-header">
            <Lightbulb size={16} className="rev-insight-icon" style={{color: '#eab308'}} />
            <h3 style={{color: '#eab308'}}>Recommendations</h3>
          </div>
          <ul className="rev-insight-list">
            {recommendations.map((r, i) => <li key={i}>{r}</li>)}
          </ul>
        </div>

        {selectedMove && (
          <div className="rev-insight-card rev-insight-card--move">
            <div className="rev-insight-header">
              <Target size={16} className="rev-insight-icon" />
              <h3>
                Move {selectedMove.moveNumber}. {selectedMove.notation}
                <span className="rev-move-badge" style={{ backgroundColor: CLASSIFICATION_COLORS[selectedMove.classification] }}>
                  {selectedMove.classification}
                </span>
              </h3>
            </div>
            <p className="rev-insight-text">{selectedMove.explanation}</p>
            {selectedMove.suggestedMove && (
              <p className="rev-insight-suggested">Better: <strong>{selectedMove.suggestedMove}</strong></p>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};

export const ReviewWorkspace = () => {
  const { id } = useParams();
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeMove, setActiveMove] = useState(null);
  const [selectedMoveData, setSelectedMoveData] = useState(null);

  const loadReview = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchReview(id);
      if (res.success && res.data) {
        setReview(res.data);
      } else {
        setError('Review data not available.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load the review. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) loadReview();
  }, [id, loadReview]);

  const handleMoveSelect = useCallback((moveKey, moveData) => {
    setActiveMove(moveKey);
    setSelectedMoveData(moveData);
  }, []);

  if (error && !loading) {
    return (
      <div className="rev-workspace rev-workspace--ready">
        <ErrorState message={error} onRetry={loadReview} />
      </div>
    );
  }

  return (
    <div className={`rev-workspace ${!loading ? 'rev-workspace--ready' : ''}`}>
      {loading ? <TopReviewBarSkeleton /> : <TopReviewBar match={review?.match} summary={review?.summary} createdAt={review?.createdAt} />}
      <div className="rev-layout">
        {loading ? <TimelineSkeleton /> : <MoveTimeline analyzedMoves={review?.analyzedMoves} activeMove={activeMove} onMoveSelect={handleMoveSelect} />}
        <BoardSection />
        {loading ? <CoachSkeleton /> : <AICoachPanel summary={review?.summary} selectedMove={selectedMoveData} />}
      </div>
    </div>
  );
};
