import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

const AuthLayout = ({ children }) => (
  <div className="auth-page">
    <motion.div
      className="auth-card"
      variants={pageVariants}
      initial="initial"
      animate="animate"
    >
      <div className="auth-logo">Knightly</div>
      {children}
    </motion.div>
  </div>
);

const PasswordInput = ({ id, label, value, onChange, error }) => {
  const [visible, setVisible] = useState(false);
  return (
    <div className="field-group">
      <label htmlFor={id} className="field-label">{label}</label>
      <div className="input-wrapper">
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          className={`field-input${error ? ' field-error' : ''}`}
          value={value}
          onChange={onChange}
          autoComplete={id === 'password' ? 'current-password' : 'new-password'}
        />
        <button
          type="button"
          className="eye-btn"
          onClick={() => setVisible(v => !v)}
          aria-label={visible ? 'Hide password' : 'Show password'}
        >
          {visible ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      {error && <span className="field-error-msg">{error}</span>}
    </div>
  );
};

export const Login = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '', rememberMe: false });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const validate = () => {
    const errs = {};
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email address.';
    if (!form.password) errs.password = 'Password is required.';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    const result = await login(form.email, form.password, form.rememberMe);
    if (result.success) {
      navigate('/');
    } else {
      setServerError(result.message);
    }
  };

  return (
    <AuthLayout>
      <h1 className="auth-headline">Welcome back.</h1>
      <p className="auth-sub">Sign in to your account</p>

      {serverError && <div className="server-error">{serverError}</div>}

      <form onSubmit={handleSubmit} className="auth-form" noValidate>
        <div className="field-group">
          <label htmlFor="email" className="field-label">Email</label>
          <input
            id="email"
            type="email"
            className={`field-input${errors.email ? ' field-error' : ''}`}
            value={form.email}
            onChange={set('email')}
            autoComplete="email"
          />
          {errors.email && <span className="field-error-msg">{errors.email}</span>}
        </div>

        <PasswordInput id="password" label="Password" value={form.password} onChange={set('password')} error={errors.password} />

        <div className="auth-row">
          <label className="checkbox-label">
            <input type="checkbox" checked={form.rememberMe} onChange={set('rememberMe')} />
            <span>Remember me</span>
          </label>
          <button type="button" className="link-muted">Forgot password?</button>
        </div>

        <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
          {loading ? <Loader2 size={16} className="spin" /> : 'Sign in'}
        </button>
      </form>

      <p className="auth-footer-text">
        Don't have an account? <Link to="/register" className="link-accent">Register</Link>
      </p>
    </AuthLayout>
  );
};

const getStrength = (pwd) => {
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  return score;
};

const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
const strengthColors = ['', '#ef4444', '#f97316', '#eab308', '#22c55e'];

export const Register = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!form.username || form.username.length < 3) errs.username = 'Username must be at least 3 characters.';
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email address.';
    if (!form.password || form.password.length < 6) errs.password = 'Password must be at least 6 characters.';
    if (form.password !== form.confirm) errs.confirm = 'Passwords do not match.';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    const result = await register(form.username, form.email, form.password);
    if (result.success) {
      navigate('/');
    } else {
      setServerError(result.message);
    }
  };

  const strength = getStrength(form.password);

  return (
    <AuthLayout>
      <h1 className="auth-headline">Create your account.</h1>
      <p className="auth-sub">Join the intelligent chess platform</p>

      {serverError && <div className="server-error">{serverError}</div>}

      <form onSubmit={handleSubmit} className="auth-form" noValidate>
        <div className="field-group">
          <label htmlFor="username" className="field-label">Username</label>
          <input
            id="username"
            type="text"
            className={`field-input${errors.username ? ' field-error' : ''}`}
            value={form.username}
            onChange={set('username')}
            autoComplete="username"
          />
          {errors.username && <span className="field-error-msg">{errors.username}</span>}
        </div>

        <div className="field-group">
          <label htmlFor="reg-email" className="field-label">Email</label>
          <input
            id="reg-email"
            type="email"
            className={`field-input${errors.email ? ' field-error' : ''}`}
            value={form.email}
            onChange={set('email')}
            autoComplete="email"
          />
          {errors.email && <span className="field-error-msg">{errors.email}</span>}
        </div>

        <div className="field-group">
          <PasswordInput id="reg-password" label="Password" value={form.password} onChange={set('password')} error={errors.password} />
          {form.password && (
            <div className="strength-bar-wrapper">
              <div className="strength-bar">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="strength-segment" style={{ backgroundColor: i <= strength ? strengthColors[strength] : 'var(--border-subtle)' }} />
                ))}
              </div>
              <span className="strength-label" style={{ color: strengthColors[strength] }}>{strengthLabels[strength]}</span>
            </div>
          )}
        </div>

        <PasswordInput id="confirm" label="Confirm Password" value={form.confirm} onChange={set('confirm')} error={errors.confirm} />

        <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
          {loading ? <Loader2 size={16} className="spin" /> : 'Create account'}
        </button>
      </form>

      <p className="auth-footer-text">
        Already have an account? <Link to="/login" className="link-accent">Sign in</Link>
      </p>
    </AuthLayout>
  );
};
