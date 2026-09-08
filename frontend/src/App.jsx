import React, { useState, useEffect } from 'react';

const AeroclickLogo = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ borderRadius: '50%', boxShadow: '0 4px 12px rgba(0,32,91,0.3)', background: '#00205b', flexShrink: 0 }}>
    <circle cx="50" cy="50" r="48" fill="#00205b" stroke="#38bdf8" strokeWidth="3"/>
    <path d="M25 58 L72 36 L52 68 L42 53 L28 58 Z" fill="#ffffff" />
    <path d="M48 48 L60 38 L55 52 Z" fill="#cbd5e1" />
    <polygon points="62,62 84,84 73,89 57,72" fill="#38bdf8" stroke="#ffffff" strokeWidth="3"/>
  </svg>
);

export default function App() {
  const [authRole, setAuthRole] = useState(null);
  const [selectedRoleType, setSelectedRoleType] = useState('consumer');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [govtData, setGovtData] = useState(null);
  const [consumerData, setConsumerData] = useState(null);
  const [flightRecords, setFlightRecords] = useState([]);

  // MoSPI Officer portal states
  const [cpiTimeframe, setCpiTimeframe] = useState('month');
  const [selectedDestination, setSelectedDestination] = useState('All');

  // Consumer comparison states
  const [compOrigin, setCompOrigin] = useState('Delhi');
  const [compDest, setCompDest] = useState('Goa');
  const [compDate, setCompDate] = useState('2026-10-15');
  const [comparisonResult, setComparisonResult] = useState(null);

  // AI Predictor states
  const [predOrigin, setPredOrigin] = useState('Delhi');
  const [predDest, setPredDest] = useState('Goa');
  const [predDays, setPredDays] = useState(7);
  const [aiResult, setAiResult] = useState(null);

  const handleLogin = (e) => {
    e.preventDefault();
    fetch('http://127.0.0.1:8000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, role: selectedRoleType })
    })
      .then(res => {
        if (!res.ok) throw new Error("Invalid credentials");
        return res.json();
      })
      .then(data => {
        setAuthRole(data.role);
        setLoginError('');
      })
      .catch(err => setLoginError('Access Denied: Use traveler / aeroclick123 or mospi_officer / sih2026govt'));
  };

  useEffect(() => {
    if (authRole === 'govt') {
      fetch(`http://127.0.0.1:8000/api/terminal/government-analytics?destination=${selectedDestination}`)
        .then(res => res.json())
        .then(d => setGovtData(d));
    } else if (authRole === 'consumer') {
      fetch('http://127.0.0.1:8000/api/terminal/consumer-market')
        .then(res => res.json())
        .then(d => setConsumerData(d));

      fetch('http://127.0.0.1:8000/api/terminal/records?limit=25')
        .then(res => res.json())
        .then(r => setFlightRecords(r));
    }
  }, [authRole, selectedDestination]);

  const runComparison = () => {
    fetch(`http://127.0.0.1:8000/api/consumer/compare-fares?origin=${compOrigin}&destination=${compDest}&travel_date=${compDate}`)
      .then(res => res.json())
      .then(d => setComparisonResult(d));
  };

  const runAIPrediction = () => {
    fetch(`http://127.0.0.1:8000/api/ai/predict?origin=${predOrigin}&destination=${predDest}&days_ahead=${predDays}`)
      .then(res => res.json())
      .then(d => setAiResult(d));
  };

  // --- LANDING FRONT PAGE WITH AIRCRAFT WALLPAPER ---
  if (!authRole) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', color: '#00205b', fontFamily: 'Inter, system-ui, sans-serif' }}>
        <div style={{ backgroundColor: '#00205b', color: '#ffffff', padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <AeroclickLogo size={46} />
            <div>
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '900', letterSpacing: '0.5px' }}>AEROCLICK</h2>
              <span style={{ fontSize: '12px', color: '#38bdf8', fontWeight: '600' }}>Smart India Hackathon 2026 | ID 26056</span>
            </div>
          </div>
          <div style={{ fontSize: '13px', color: '#cbd5e1', fontWeight: '600' }}>
            Ministry of Statistics & Programme Implementation (MoSPI)
          </div>
        </div>

        <div style={{ 
          backgroundImage: 'linear-gradient(rgba(0, 32, 91, 0.88), rgba(0, 16, 48, 0.92)), url("https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1600&auto=format&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: '#ffffff',
          padding: '90px 40px',
          textAlign: 'center'
        }}>
          <h1 style={{ margin: 0, fontSize: '42px', fontWeight: '900', letterSpacing: '-0.5px' }}>Real-Time Airfare Intelligence & Cross-Platform Comparison Engine</h1>
          <p style={{ margin: '16px auto 0 auto', maxWidth: '800px', fontSize: '16px', color: '#cbd5e1', lineHeight: '1.6' }}>
            Aeroclick bridges official government macroeconomic CPI tracking with a robust consumer fare comparison engine, tracking live unbundled flights across major airlines and OTA aggregators seamlessly.
          </p>
        </div>

        <div style={{ maxWidth: '1200px', margin: '-40px auto 40px auto', padding: '0 20px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', position: 'relative', zIndex: 10 }}>
          <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', borderTop: '4px solid #00205b' }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', color: '#00205b', fontWeight: '800' }}>🔍 Multi-Source Fare Compare</h3>
            <p style={{ margin: 0, fontSize: '13px', color: '#64748b', lineHeight: '1.5' }}>Compare direct airline websites and OTA aggregators (MMT, Yatra, EaseMyTrip, Cleartrip) instantly.</p>
          </div>
          <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', borderTop: '4px solid #0284c7' }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', color: '#00205b', fontWeight: '800' }}>🤖 AI Corridor Predictor</h3>
            <p style={{ margin: '0 0 10px 0', fontSize: '13px', color: '#64748b', lineHeight: '1.5' }}>Advanced machine learning corridor forecasting with smart buying advice and price anomaly detection.</p>
          </div>
          <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', borderTop: '4px solid #16a34a' }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', color: '#00205b', fontWeight: '800' }}>⚡ Real-Time Live CPI</h3>
            <p style={{ margin: '0 0 10px 0', fontSize: '13px', color: '#64748b', lineHeight: '1.5' }}>MoSPI government officer portal with multi-timeframe interactive inflation trend graphs and audit logs.</p>
          </div>
        </div>

        <div style={{ maxWidth: '460px', margin: '20px auto 60px auto', backgroundColor: '#ffffff', padding: '36px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 20px 40px rgba(0,32,91,0.08)' }}>
          <div style={{ textAlign: 'center', marginBottom: '22px' }}>
            <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '900', color: '#00205b' }}>Secure Terminal Gateway</h2>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#64748b' }}>Select your portal to access live analytics</p>
          </div>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', backgroundColor: '#f1f5f9', padding: '4px', borderRadius: '8px' }}>
            <button 
              type="button"
              onClick={() => setSelectedRoleType('consumer')}
              style={{ flex: 1, padding: '10px', borderRadius: '6px', border: 'none', backgroundColor: selectedRoleType === 'consumer' ? '#00205b' : 'transparent', color: selectedRoleType === 'consumer' ? '#ffffff' : '#64748b', fontWeight: '700', cursor: 'pointer', fontSize: '13px', transition: 'all 0.2s' }}
            >
              Consumer Portal
            </button>
            <button 
              type="button"
              onClick={() => setSelectedRoleType('govt')}
              style={{ flex: 1, padding: '10px', borderRadius: '6px', border: 'none', backgroundColor: selectedRoleType === 'govt' ? '#00205b' : 'transparent', color: selectedRoleType === 'govt' ? '#ffffff' : '#64748b', fontWeight: '700', cursor: 'pointer', fontSize: '13px', transition: 'all 0.2s' }}
            >
              MoSPI Officer Portal
            </button>
          </div>

          {loginError && <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '10px 14px', borderRadius: '6px', fontSize: '12px', marginBottom: '16px', fontWeight: '600' }}>{loginError}</div>}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <label style={{ fontSize: '11px', fontWeight: '800', color: '#475569', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>Username</label>
              <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                placeholder={selectedRoleType === 'govt' ? 'mospi_officer' : 'traveler'}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', color: '#00205b', fontSize: '14px', boxSizing: 'border-box', outline: 'none', fontWeight: '600' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '11px', fontWeight: '800', color: '#475569', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Enter password"
                style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', color: '#00205b', fontSize: '14px', boxSizing: 'border-box', outline: 'none', fontWeight: '600' }}
              />
            </div>
            <button 
              type="submit"
              style={{ width: '100%', padding: '14px', borderRadius: '8px', border: 'none', backgroundColor: '#00205b', color: 'white', fontWeight: '800', cursor: 'pointer', fontSize: '14px', marginTop: '6px', boxShadow: '0 4px 12px rgba(0,32,91,0.3)' }}
            >
              Secure Portal Login →
            </button>
          </form>

          <div style={{ marginTop: '20px', fontSize: '12px', color: '#64748b', textAlign: 'center', lineHeight: '1.6', borderTop: '1px solid #e2e8f0', paddingTop: '14px' }}>
            Consumer Demo: <code style={{ color: '#00205b', fontWeight: '700' }}>traveler / aeroclick123</code><br/>
            MoSPI Officer Demo: <code style={{ color: '#00205b', fontWeight: '700' }}>mospi_officer / sih2026govt</code>
          </div>
        </div>
      </div>
    );
  }

  // --- MoSPI OFFICER PORTAL (UNALTERED CPI SECTION + ALL 15 ADDITIONAL FEATURES) ---
  if (authRole === 'govt') {
    const activeDataset = govtData ? govtData.cpi_timeframe_datasets[cpiTimeframe] : [];

    return (
      <div style={{ backgroundColor: '#f8fafc', color: '#00205b', minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif' }}>
        
        <div style={{ backgroundColor: '#00205b', color: '#ffffff', padding: '16px 36px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <AeroclickLogo size={42} />
            <div>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '900', letterSpacing: '0.5px' }}>AEROCLICK // MoSPI OFFICER PORTAL</h2>
              <span style={{ fontSize: '12px', color: '#38bdf8' }}>Real-Time Live CPI & Transport Basket Macroeconomic Dashboard</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#1e3a8a', padding: '6px 12px', borderRadius: '6px' }}>
              <span style={{ fontSize: '11px', color: '#93c5fd', fontWeight: '800' }}>FILTER ROUTE:</span>
              <select 
                value={selectedDestination} 
                onChange={(e) => setSelectedDestination(e.target.value)}
                style={{ backgroundColor: '#ffffff', color: '#00205b', border: 'none', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '700', outline: 'none', cursor: 'pointer' }}
              >
                <option value="All">All Destinations</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Goa">Goa</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Delhi">Delhi</option>
              </select>
            </div>
            <button onClick={() => setAuthRole(null)} style={{ backgroundColor: '#dc2626', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: '700', fontSize: '12px' }}>
              Logout Portal
            </button>
          </div>
        </div>

        <div style={{ padding: '36px', maxWidth: '1280px', margin: '0 auto' }}>
          {govtData ? (
            <>
              {/* EXACT UNALTERED CPI CENTER STAGE HERO METRICS */}
              <div style={{ backgroundColor: '#00205b', color: '#ffffff', padding: '30px', borderRadius: '16px', marginBottom: '28px', boxShadow: '0 10px 25px rgba(0,32,91,0.2)', border: '1px solid #1e3a8a' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <div>
                    <span style={{ fontSize: '12px', fontWeight: '800', color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '1px' }}>MoSPI Core Augmentation Engine</span>
                    <h2 style={{ margin: '5px 0 0 0', fontSize: '24px', fontWeight: '900' }}>Live Consumer Price Index (CPI) Center Stage</h2>
                  </div>
                  <span style={{ backgroundColor: '#16a34a', color: 'white', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '800' }}>● LIVE SYNCHRONIZED</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                  <div style={{ backgroundColor: '#1e3a8a', padding: '18px', borderRadius: '10px' }}>
                    <span style={{ fontSize: '11px', color: '#93c5fd', fontWeight: '700', textTransform: 'uppercase' }}>Real-Time Augmented CPI</span>
                    <h2 style={{ margin: '6px 0 0 0', fontSize: '28px', fontWeight: '900', color: '#ffffff' }}>{govtData.macro_cpi_metrics.airfare_augmented_cpi}</h2>
                    <span style={{ fontSize: '11px', color: '#34d399' }}>Base CPI: {govtData.macro_cpi_metrics.baseline_cpi}</span>
                  </div>
                  <div style={{ backgroundColor: '#1e3a8a', padding: '18px', borderRadius: '10px' }}>
                    <span style={{ fontSize: '11px', color: '#93c5fd', fontWeight: '700', textTransform: 'uppercase' }}>National Airfare Index (APIx)</span>
                    <h2 style={{ margin: '6px 0 0 0', fontSize: '28px', fontWeight: '900', color: '#ffffff' }}>{govtData.macro_cpi_metrics.national_airfare_index}</h2>
                    <span style={{ fontSize: '11px', color: '#38bdf8' }}>{govtData.comparison_periods['30_days_change']} MoM</span>
                  </div>
                  <div style={{ backgroundColor: '#1e3a8a', padding: '18px', borderRadius: '10px' }}>
                    <span style={{ fontSize: '11px', color: '#93c5fd', fontWeight: '700', textTransform: 'uppercase' }}>Transport Basket Weight</span>
                    <h2 style={{ margin: '6px 0 0 0', fontSize: '28px', fontWeight: '900', color: '#ffffff' }}>{govtData.macro_cpi_metrics.transport_basket_weight}</h2>
                    <span style={{ fontSize: '11px', color: '#fbbf24' }}>Official MoSPI Allocation</span>
                  </div>
                  <div style={{ backgroundColor: '#1e3a8a', padding: '18px', borderRadius: '10px' }}>
                    <span style={{ fontSize: '11px', color: '#93c5fd', fontWeight: '700', textTransform: 'uppercase' }}>Inflation Impact</span>
                    <h2 style={{ margin: '6px 0 0 0', fontSize: '28px', fontWeight: '900', color: '#f87171' }}>+{govtData.macro_cpi_metrics.national_inflation_impact_pct}%</h2>
                    <span style={{ fontSize: '11px', color: '#fca5a5' }}>Upward Pressure</span>
                  </div>
                </div>
              </div>

              {/* DYNAMIC MASTER CPI GRAPH WITH TIMEFRAME SELECTOR */}
              <div style={{ backgroundColor: '#ffffff', padding: '30px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '28px', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '900', color: '#00205b' }}>📈 Dynamic Master CPI Trend & Analytics Graph</h3>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Interactive timeframe view for live MoSPI transport inflation monitoring</span>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', backgroundColor: '#f1f5f9', padding: '4px', borderRadius: '8px' }}>
                    {['hour', 'day', 'week', 'month', 'year'].map((tf) => (
                      <button
                        key={tf}
                        type="button"
                        onClick={() => setCpiTimeframe(tf)}
                        style={{
                          padding: '8px 14px',
                          borderRadius: '6px',
                          border: 'none',
                          backgroundColor: cpiTimeframe === tf ? '#00205b' : 'transparent',
                          color: cpiTimeframe === tf ? '#ffffff' : '#475569',
                          fontWeight: '800',
                          fontSize: '12px',
                          cursor: 'pointer',
                          textTransform: 'capitalize',
                          transition: 'all 0.2s'
                        }}
                      >
                        Per {tf}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ backgroundColor: '#f8fafc', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <svg viewBox="0 0 800 260" style={{ width: '100%', height: '240px', overflow: 'visible' }}>
                    {[0, 65, 130, 195, 260].map((y, idx) => (
                      <line key={idx} x1="50" y1={y} x2="770" y2={y} stroke="#e2e8f0" strokeWidth="1" />
                    ))}
                    {activeDataset.length > 1 && (() => {
                      const points = activeDataset.map((d, idx) => {
                        const x = 70 + (idx * (700 / (activeDataset.length - 1)));
                        const y = 230 - ((d.val - 110) * 8);
                        return `${x},${y}`;
                      }).join(' ');

                      return (
                        <>
                          <polyline fill="none" stroke="#00205b" strokeWidth="4" points={points} />
                          {activeDataset.map((d, idx) => {
                            const x = 70 + (idx * (700 / (activeDataset.length - 1)));
                            const y = 230 - ((d.val - 110) * 8);
                            return (
                              <g key={idx}>
                                <circle cx={x} cy={y} r="6" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />
                                <text x={x} y={y - 12} textAnchor="middle" fill="#00205b" fontSize="11" fontWeight="bold">
                                  {d.val}
                                </text>
                                <text x={x} y="250" textAnchor="middle" fill="#64748b" fontSize="11" fontWeight="600">
                                  {d.label}
                                </text>
                              </g>
                            );
                          })}
                        </>
                      );
                    })()}
                  </svg>
                </div>
              </div>

              {/* ADDITIONAL GOVERNMENT FEATURES: ROUTE HEATMAPS & SEAT AVAILABILITY */}
              <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '28px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '17px', fontWeight: '900', color: '#00205b' }}>🗺️ Route-Wise Prices, Inflation % & Seat Availability Weighting</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b', backgroundColor: '#f8fafc' }}>
                      <th style={{ padding: '10px' }}>Route</th>
                      <th style={{ padding: '10px' }}>Average Fare</th>
                      <th style={{ padding: '10px' }}>Inflation %</th>
                      <th style={{ padding: '10px' }}>Seat Availability & Class</th>
                      <th style={{ padding: '10px' }}>Status Heatmap</th>
                    </tr>
                  </thead>
                  <tbody>
                    {govtData.route_wise_analysis.map((rt, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '10px', fontWeight: '700', color: '#00205b' }}>{rt.route}</td>
                        <td style={{ padding: '10px', color: '#64748b' }}>₹{rt.avg_fare}</td>
                        <td style={{ padding: '10px', color: rt.inflation_pct.startsWith('+') ? '#dc2626' : '#16a34a', fontWeight: '700' }}>{rt.inflation_pct}</td>
                        <td style={{ padding: '10px', color: '#0284c7', fontWeight: '600' }}>{rt.seat_availability} ({rt.fare_class})</td>
                        <td style={{ padding: '10px', fontWeight: '800', fontSize: '12px' }}>{rt.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* AUTOMATED COLLECTION & BOOKING WINDOWS */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '28px' }}>
                <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '900', color: '#00205b' }}>✈️ Automatic Multi-Source Collection (Airlines & OTAs)</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
                    <div style={{ backgroundColor: '#f8fafc', padding: '10px 14px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                      <strong>Airlines Active:</strong> IndiGo, Air India, Air India Express, Akasa Air, SpiceJet
                    </div>
                    <div style={{ backgroundColor: '#f8fafc', padding: '10px 14px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                      <strong>OTA Portals Active:</strong> MakeMyTrip, Yatra, EaseMyTrip, Cleartrip, Ixigo, Goibibo
                    </div>
                  </div>
                </div>

                <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '900', color: '#00205b' }}>⏳ Scheduled Booking Windows (T+1 to T+45)</h3>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b', backgroundColor: '#f8fafc' }}>
                        <th style={{ padding: '8px' }}>Window</th>
                        <th style={{ padding: '8px' }}>Avg Fare</th>
                        <th style={{ padding: '8px' }}>Surge Factor</th>
                      </tr>
                    </thead>
                    <tbody>
                      {govtData.booking_windows_analysis.map((bw, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '8px', fontWeight: '700', color: '#00205b' }}>{bw.window}</td>
                          <td style={{ padding: '8px', color: '#0284c7' }}>₹{bw.avg_fare}</td>
                          <td style={{ padding: '8px', color: '#d97706', fontWeight: '700' }}>{bw.surge_factor}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* DATA CLEANING & BACKTESTING */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '28px' }}>
                <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '900', color: '#00205b' }}>🧹 Data Cleaning & Normalization Engine</h3>
                  <div style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6' }}>
                    <p style={{ margin: '0 0 8px 0' }}>Raw feeds pass through automated outlier isolation to separate base fares, taxes, and convenience fees cleanly.</p>
                    <div style={{ backgroundColor: '#f8fafc', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontFamily: 'monospace', fontSize: '12px' }}>
                      Base: ₹3,200 | Taxes: ₹580 | Conv: ₹150<br/><strong>Total: ₹3,930</strong>
                    </div>
                  </div>
                </div>

                <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '900', color: '#00205b' }}>🧪 Backtesting Validation & Transparency</h3>
                  <div style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6' }}>
                    <div><strong>MAPE Accuracy:</strong> {govtData.backtesting_validation.mape}</div>
                    <div><strong>RMSE Score:</strong> {govtData.backtesting_validation.rmse}</div>
                    <div style={{ marginTop: '8px', color: '#16a34a', fontWeight: '700' }}>Status: {govtData.backtesting_validation.status}</div>
                  </div>
                </div>
              </div>

              {/* Active Alerts */}
              <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', padding: '20px', marginBottom: '28px' }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '15px', color: '#991b1b', fontWeight: '900' }}>🚨 Automated Surge & Anomaly Alerts</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {govtData.active_alerts.map((al, idx) => (
                    <div key={idx} style={{ fontSize: '13px', color: '#7f1d1d', fontWeight: '600' }}>
                      <strong>{al.type}:</strong> {al.message}
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : <p style={{ textAlign: 'center', color: '#64748b', padding: '40px' }}>Loading MoSPI Intelligence...</p>}
        </div>
      </div>
    );
  }

  // --- CONSUMER PORTAL (UNALTERED MULTI-SOURCE COMPARISON ENGINE) ---
  return (
    <div style={{ backgroundColor: '#f8fafc', color: '#00205b', minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif' }}>
      
      <div style={{ backgroundColor: '#00205b', color: '#ffffff', padding: '16px 36px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <AeroclickLogo size={42} />
          <div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '900', letterSpacing: '0.5px' }}>AEROCLICK // CONSUMER AIRFARE PORTAL</h2>
            <span style={{ fontSize: '12px', color: '#38bdf8' }}>Cross-Platform Multi-Source Fare Comparison & AI Predictor</span>
          </div>
        </div>
        <button onClick={() => setAuthRole(null)} style={{ backgroundColor: '#dc2626', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: '700', fontSize: '12px' }}>
          Logout Portal
        </button>
      </div>

      <div style={{ 
        backgroundImage: 'linear-gradient(rgba(0, 32, 91, 0.85), rgba(0, 16, 48, 0.9)), url("https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1600&auto=format&fit=crop")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: '#ffffff',
        padding: '50px 36px',
        textAlign: 'center'
      }}>
        <h1 style={{ margin: 0, fontSize: '32px', fontWeight: '900' }}>Instant Multi-Platform Flight Price Comparison</h1>
        <p style={{ margin: '10px 0 0 0', fontSize: '15px', color: '#cbd5e1' }}>Compare direct airline websites and all major OTAs (MMT, Yatra, EaseMyTrip, Cleartrip, Ixigo, Goibibo) in one click.</p>
      </div>

      <div style={{ padding: '36px', maxWidth: '1280px', margin: '0 auto' }}>
        
        {/* CROSS-PLATFORM COMPARISON WIDGET */}
        <div style={{ backgroundColor: '#ffffff', padding: '30px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '28px', boxShadow: '0 4px 12px rgba(0,32,91,0.08)' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '900', color: '#00205b' }}>🔍 Instant Cross-Platform Fare Comparison Engine</h3>
          
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div>
              <label style={{ fontSize: '11px', fontWeight: '800', color: '#475569', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>Origin</label>
              <input 
                type="text" 
                value={compOrigin} 
                onChange={(e) => setCompOrigin(e.target.value)} 
                placeholder="e.g. Delhi"
                style={{ backgroundColor: '#f8fafc', color: '#00205b', padding: '12px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', width: '180px', outline: 'none', fontSize: '14px', fontWeight: '600' }} 
              />
            </div>
            <div>
              <label style={{ fontSize: '11px', fontWeight: '800', color: '#475569', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>Destination</label>
              <input 
                type="text" 
                value={compDest} 
                onChange={(e) => setCompDest(e.target.value)} 
                placeholder="e.g. Goa"
                style={{ backgroundColor: '#f8fafc', color: '#00205b', padding: '12px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', width: '180px', outline: 'none', fontSize: '14px', fontWeight: '600' }} 
              />
            </div>
            <div>
              <label style={{ fontSize: '11px', fontWeight: '800', color: '#475569', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>Travel Date</label>
              <input 
                type="date" 
                value={compDate} 
                onChange={(e) => setCompDate(e.target.value)} 
                style={{ backgroundColor: '#f8fafc', color: '#00205b', padding: '12px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', width: '160px', outline: 'none', fontSize: '14px', fontWeight: '600' }} 
              />
            </div>
            <button onClick={runComparison} style={{ backgroundColor: '#00205b', color: 'white', border: 'none', padding: '14px 26px', borderRadius: '8px', fontWeight: '800', cursor: 'pointer', marginTop: '18px', fontSize: '14px', boxShadow: '0 4px 12px rgba(0,32,91,0.2)' }}>
              Compare All Platforms →
            </button>
          </div>

          {comparisonResult && (
            <div style={{ marginTop: '24px' }}>
              <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '16px 20px', borderRadius: '10px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '15px', color: '#166534', fontWeight: '900' }}>💡 Smart Buying Advice for {comparisonResult.route}</h4>
                  <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#15803d' }}>{comparisonResult.buying_advice.recommendation}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '12px', color: '#166534', fontWeight: '700' }}>Trend: {comparisonResult.buying_advice.price_trend}</div>
                  <div style={{ fontSize: '13px', color: '#15803d', fontWeight: '800' }}>Cheapest Platform: {comparisonResult.buying_advice.best_platform}</div>
                </div>
              </div>

              <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '900', color: '#00205b' }}>📊 Real-Time Unbundled Comparison Table</h4>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b', backgroundColor: '#f8fafc' }}>
                      <th style={{ padding: '12px' }}>Provider / OTA</th>
                      <th style={{ padding: '12px' }}>Type</th>
                      <th style={{ padding: '12px' }}>Base Fare</th>
                      <th style={{ padding: '12px' }}>Taxes + GST</th>
                      <th style={{ padding: '12px' }}>Convenience Fee</th>
                      <th style={{ padding: '12px' }}>Total Unbundled Fare</th>
                      <th style={{ padding: '12px' }}>Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonResult.price_comparison.map((item, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: item.best_deal ? '#f0fdf4' : 'transparent' }}>
                        <td style={{ padding: '12px', fontWeight: '800', color: '#00205b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {item.provider} {item.best_deal && <span style={{ backgroundColor: '#16a34a', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: '900' }}>BEST DEAL</span>}
                        </td>
                        <td style={{ padding: '12px', color: '#64748b' }}>{item.type}</td>
                        <td style={{ padding: '12px', color: '#334155' }}>₹{item.base_fare}</td>
                        <td style={{ padding: '12px', color: '#64748b' }}>₹{item.taxes_gst}</td>
                        <td style={{ padding: '12px', color: '#64748b' }}>₹{item.convenience_fee}</td>
                        <td style={{ padding: '12px', fontWeight: '900', color: item.best_deal ? '#16a34a' : '#0284c7', fontSize: '15px' }}>₹{item.total_fare}</td>
                        <td style={{ padding: '12px', color: '#d97706', fontWeight: '700' }}>{item.rating}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* AI FARE PREDICTOR */}
        <div style={{ backgroundColor: '#ffffff', padding: '28px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '28px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '900', color: '#00205b' }}>🤖 Universal AI Fare Predictor & Trend Forecaster</h3>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div>
              <label style={{ fontSize: '11px', fontWeight: '800', color: '#475569', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>Origin City</label>
              <input 
                type="text" 
                value={predOrigin} 
                onChange={(e) => setPredOrigin(e.target.value)} 
                placeholder="e.g. Delhi"
                style={{ backgroundColor: '#f8fafc', color: '#00205b', padding: '12px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', width: '180px', outline: 'none', fontSize: '14px', fontWeight: '600' }} 
              />
            </div>
            <div>
              <label style={{ fontSize: '11px', fontWeight: '800', color: '#475569', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>Destination City</label>
              <input 
                type="text" 
                value={predDest} 
                onChange={(e) => setPredDest(e.target.value)} 
                placeholder="e.g. Goa"
                style={{ backgroundColor: '#f8fafc', color: '#00205b', padding: '12px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', width: '180px', outline: 'none', fontSize: '14px', fontWeight: '600' }} 
              />
            </div>
            <div>
              <label style={{ fontSize: '11px', fontWeight: '800', color: '#475569', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>Days Ahead</label>
              <input type="number" value={predDays} onChange={(e) => setPredDays(e.target.value)} style={{ width: '90px', backgroundColor: '#f8fafc', color: '#00205b', padding: '12px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px', fontWeight: '600' }} />
            </div>
            <button onClick={runAIPrediction} style={{ backgroundColor: '#00205b', color: 'white', border: 'none', padding: '14px 24px', borderRadius: '8px', fontWeight: '800', cursor: 'pointer', marginTop: '18px', fontSize: '14px', boxShadow: '0 4px 12px rgba(0,32,91,0.2)' }}>
              Calculate AI Forecast →
            </button>
          </div>

          {aiResult && (
            <div style={{ marginTop: '22px', backgroundColor: '#f8fafc', padding: '18px 22px', borderRadius: '8px', borderLeft: '5px solid #00205b', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <strong style={{ fontSize: '16px', color: '#00205b' }}>{aiResult.route} ({aiResult.forecast_horizon_days} Days Out)</strong>
                <div style={{ fontSize: '14px', color: '#0284c7', marginTop: '6px', fontWeight: '700' }}>Predicted Corridor: <strong>{aiResult.predicted_fare_range}</strong></div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '13px', color: '#16a34a', fontWeight: '700' }}>Confidence: {aiResult.confidence}</div>
                <span style={{ fontSize: '12px', color: '#dc2626', fontWeight: '800' }}>{aiResult.anomaly_status}</span>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}