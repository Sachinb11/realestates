import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Login.module.css';

export default function Login() {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const { login }  = useAuth();
  const navigate   = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>

      {/* ── Left Panel ── */}
      <div className={styles.leftPanel}>
        <div className={styles.leftContent}>

          {/* Real logo */}
          <div className={styles.brand}>
            <div className={styles.brandLogoWrap}>
              <img src="/logo.png" alt="Bhagat Estates" className={styles.brandLogoImg} />
            </div>
            <div>
              <div className={styles.brandName}>Bhagat Estates</div>
              <div className={styles.brandTagline}>Admin Dashboard</div>
            </div>
          </div>

          <h1 className={styles.heroHeading}>
            Manage Your<br />Real Estate Business
          </h1>
          <p className={styles.heroText}>
            Oversee properties, track leads, manage site visits, and grow your business — all from one powerful dashboard.
          </p>
          <div className={styles.featureList}>
            {[
              '📊 Real-time Dashboard & Analytics',
              '🏠 Add & Manage Properties',
              '📋 Track Leads & Inquiries',
              '📅 Schedule Site Visits',
            ].map(f => (
              <div key={f} className={styles.featureItem}>{f}</div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div className={styles.rightPanel}>
        <div className={styles.formCard}>

          {/* Logo at top of form */}
          <div className={styles.formLogo}>
            <div className={styles.formLogoWrap}>
              <img src="/logo.png" alt="Bhagat Estates" className={styles.formLogoImg} />
            </div>
          </div>

          <div className={styles.formHeader}>
            <h2 className={styles.formTitle}>Welcome Back</h2>
            <p className={styles.formSubtitle}>Sign in to your admin account</p>
          </div>

          <form onSubmit={handleSubmit}>
            {error && <div className="alert alert-error">{error}</div>}

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                className="form-input"
                type="email"
                placeholder="admin@bhagatestates.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoFocus
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className={styles.pwWrap}>
                <input
                  className="form-input"
                  type={showPw ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{ paddingRight: 44 }}
                />
                <button type="button" className={styles.pwToggle} onClick={() => setShowPw(!showPw)}>
                  {showPw ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className={`btn btn-gold ${styles.loginBtn}`}
              disabled={loading}
            >
              {loading
                ? <><span className="spinner"></span> Signing in...</>
                : '→ Sign In to Dashboard'
              }
            </button>
          </form>

          <div className={styles.formFooter}>
            <p>Need help? Contact: <a href="mailto:contact.bhagatestates@gmail.com">contact.bhagatestates@gmail.com</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}
