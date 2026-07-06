import React from 'react';
import { Upload, Sparkles, FileText, Search, Activity } from 'lucide-react';
import { QuickActionCard } from '../components/QuickActionCard';
import { useAuth } from '../contexts/AuthContext';

export const Workspace = () => {
  const { user } = useAuth();
  
  return (
    <div className="ws-content">
      <header className="ws-header">
        <h1 className="ws-greeting">Good morning{user?.username ? `, ${user.username}` : '.'}</h1>
        <p className="ws-subtitle">Ready for your next analysis?</p>
      </header>

      <section className="ws-section">
        <div className="qa-grid">
          <QuickActionCard
            icon={Upload}
            title="Import PGN"
            description="Analyze a new game"
            index={0}
            onClick={() => console.log('Import PGN')}
          />
          <QuickActionCard
            icon={Sparkles}
            title="AI Coach"
            description="Start a coaching session"
            index={1}
            onClick={() => console.log('AI Coach')}
          />
          <QuickActionCard
            icon={FileText}
            title="Reviews"
            description="Continue where you left off"
            index={2}
            onClick={() => console.log('Reviews')}
          />
          <QuickActionCard
            icon={Search}
            title="Explore Games"
            description="Browse game library"
            index={3}
            onClick={() => console.log('Explore Games')}
          />
        </div>
      </section>

      <section className="ws-section ws-recent">
        <h2 className="ws-section-title">Recent Activity</h2>
        <div className="ws-empty-state">
          <div className="ws-empty-icon">
            <Activity size={32} />
          </div>
          <h3 className="ws-empty-title">No recent activity</h3>
          <p className="ws-empty-desc">Import your first game to get started.</p>
          <button className="btn btn-primary ws-empty-btn">
            Import Game
          </button>
        </div>
      </section>
    </div>
  );
};
