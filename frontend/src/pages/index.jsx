import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Activity, Target, Zap } from 'lucide-react';
import { FeatureCard } from '../components/FeatureCard';

export const Home = () => {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="section-padding" style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h1 style={{ fontSize: 'var(--text-4xl)', fontWeight: '600', letterSpacing: '-0.03em', marginBottom: '1.5rem', lineHeight: '1.1' }}>
            Chess coaching powered by <span className="text-gradient">machine intelligence.</span>
          </h1>
          <p style={{ fontSize: 'var(--text-xl)', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', lineHeight: '1.5' }}>
            Upload your games and receive contextual, humanized analysis. Understand why you lost, and how to improve.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}
        >
          <button className="btn btn-primary">Get Started</button>
          <button className="btn btn-secondary">Explore Features</button>
        </motion.div>
      </section>

      {/* Problem Section */}
      <section className="section-padding">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto', borderTop: '1px solid var(--border-subtle)', paddingTop: '4rem' }}
        >
          <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: '500', marginBottom: '1rem' }}>You know you lost. But do you know why?</h2>
          <p style={{ fontSize: 'var(--text-lg)', color: 'var(--text-secondary)' }}>
            Traditional engines give you raw numbers. Knightly translates engine output into actionable insights and conversational coaching so you actually understand your mistakes.
          </p>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="section-padding">
        <div style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: 'var(--text-3xl)', fontWeight: '500', letterSpacing: '-0.02em', marginBottom: '1rem' }}>Intelligence at your fingertips.</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-lg)', maxWidth: '500px' }}>Everything you need to analyze your games deeply and improve systematically.</p>
        </div>
        
        <div className="features-grid">
          <FeatureCard 
            icon={Brain} 
            title="AI Reviews" 
            description="Deep analysis that identifies critical moments and translates evaluation swings into plain English." 
            delay={0.1} 
          />
          <FeatureCard 
            icon={Activity} 
            title="Interactive Analysis" 
            description="Step through your game with phase-aware evaluations separating opening prep from endgame technique." 
            delay={0.2} 
          />
          <FeatureCard 
            icon={Target} 
            title="Opening Insights" 
            description="Discover where you left theoretical book lines and how to refine your early-game strategy." 
            delay={0.3} 
          />
          <FeatureCard 
            icon={Zap} 
            title="Personalized Coaching" 
            description="Chat directly with your AI coach about any position to understand the nuances of the evaluation." 
            delay={0.4} 
          />
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="section-padding" style={{ borderTop: '1px solid var(--border-subtle)', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ backgroundColor: 'var(--bg-secondary)', padding: '4rem 2rem', borderRadius: '16px', border: '1px solid var(--border-strong)' }}
        >
          <h2 style={{ fontSize: 'var(--text-3xl)', fontWeight: '600', marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>Ready to elevate your game?</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-lg)', marginBottom: '2rem' }}>Join the next generation of chess analysis.</p>
          <button className="btn btn-primary">Start Analyzing Now</button>
        </motion.div>
      </section>
    </div>
  );
};

export const NotFound = () => {
  return (
    <div style={{ padding: '6rem 0', display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
      <h1 style={{ fontSize: 'var(--text-4xl)', fontWeight: '500', color: 'var(--text-primary)' }}>404</h1>
      <p style={{ fontSize: 'var(--text-lg)', color: 'var(--text-secondary)' }}>
        The page you are looking for does not exist.
      </p>
    </div>
  );
};
