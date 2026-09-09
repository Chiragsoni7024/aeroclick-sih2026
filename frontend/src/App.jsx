import React, { useState, useEffect } from 'react';

const AeroclickLogo = ({ size = 46 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ borderRadius: '50%', boxShadow: '0 4px 16px rgba(0,32,91,0.35)', background: '#00205b', flexShrink: 0 }}>
    <circle cx="50" cy="50" r="48" fill="#00205b" stroke="#38bdf8" strokeWidth="3"/>
    <path d="M25 58 L72 36 L52 68 L42 53 L28 58 Z" fill="#ffffff" />
    <path d="M48 48 L60 38 L55 52 Z" fill="#cbd5e1" />
    <polygon points="62,62 84,84 73,89 57,72" fill="#38bdf8" stroke="#ffffff" strokeWidth="3"/>
  </svg>
);

export default function App() {
  const [activePortal, setActivePortal] = useState('consumer');

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

  useEffect(() => {
    if (activePortal === 'govt') {
      fetch(`http://127.0.0.1:5000/api/terminal/government-analytics?destination=${selectedDestination}`)
        .then(res => res.json())
        .then(d => setGovtData(d))
        .catch(err => console.log("Govt API Error:", err));
    } else if (activePortal === 'consumer') {
      fetch('http://127.0.0.1:5000/api/terminal/consumer-market')
        .then(res => res.json())
        .then(d => setConsumerData(d))
        .catch(err => console.log("Consumer Market Error:", err));

      fetch('http://127.0.0.1:5000/api/terminal/records?limit=25')
        .then(res => res.json())
        .then(r => setFlightRecords(r))
        .catch(err => console.log("Flight Records Error:", err));
    }
  }, [activePortal, selectedDestination]);

  const runComparison = () => {
    fetch(`http://127.0.0.1:5000/api/consumer/compare-fares?origin=${compOrigin}&destination=${compDest}&travel_date=${compDate}`)
      .then(res => res.json())
      .then(d => setComparisonResult(d))
      .catch(err => console.log("Comparison Error:", err));
  };

  const runAIPrediction = () => {
    fetch(`http://127.0.0.1:5000/api/ai/predict?origin=${predOrigin}&destination=${predDest}&days_ahead=${predDays}`)
      .then(res => res.json())
      .then(d => setAiResult(d))
      .catch(err => console.log("AI Predictor Error:", err));
  };

  // --- MoSPI OFFICER PORTAL (BLS / GOVERNMENT INSTITUTIONAL GRADE) ---
  if (activePortal === 'govt') {
    const activeDataset = govtData ? govtData.cpi_timeframe_datasets[cpiTimeframe] : [];

    return (
      <div style={{ backgroundColor: '#f8fafc', color: '#0f172a', minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif' }}>
        
        {/* Institutional Top Navbar */}
        <div style={{ backgroundColor: '#001e43', color: '#ffffff', padding: '14px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '3px solid #0284c7' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <AeroclickLogo size={44} />
            <div>
              <div style={{ fontSize: '11px', color: '#38bdf8', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase' }}>Ministry of Statistics & Programme Implementation (MoSPI)</div>
              <h2 style={{ margin: '2px 0 0 0', fontSize: '18px', fontWeight: '900', letterSpacing: '0.3px' }}>AEROCLICK ENTERPRISE MACROECONOMIC TERMINAL // v18.0</h2>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#0f2952', padding: '6px 14px', borderRadius: '6px', border: '1px solid #1e3a8a' }}>
              <span style={{ fontSize: '11px', color: '#93c5fd', fontWeight: '800' }}>FILTER ROUTE:</span>
              <select 
                value={selectedDestination} 
                onChange={(e) => setSelectedDestination(e.target.value)}
                style={{ backgroundColor: '#ffffff', color: '#00205b', border: 'none', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '700', outline: 'none', cursor: 'pointer' }}
              >
                <option value="All">All National Corridors</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Goa">Goa</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Delhi">Delhi</option>
              </select>
            </div>
            <button 
              onClick={() => setActivePortal('consumer')} 
              style={{ backgroundColor: '#0284c7', color: 'white', border: 'none', padding: '9px 18px', borderRadius: '6px', cursor: 'pointer', fontWeight: '800', fontSize: '12px', boxShadow: '0 4px 12px rgba(2,132,199,0.3)' }}
            >
              Switch to Consumer Portal →
            </button>
          </div>
        </div>

        <div style={{ padding: '36px', maxWidth: '1280px', margin: '0 auto' }}>
          {govtData ? (
            <>
              {/* INSTITUTIONAL SUB-HEADER SECTION */}
              <div style={{ backgroundColor: '#ffffff', padding: '24px 30px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <span style={{ fontSize: '12px', fontWeight: '800', color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Consumer Price Index (CPI) Publications & Methodology</span>
                <h1 style={{ margin: '6px 0 8px 0', fontSize: '22px', fontWeight: '900', color: '#001e43' }}>Measuring Price Change in the CPI: Airline Fares & Public Transport Basket</h1>
                <p style={{ margin: 0, fontSize: '13px', color: '#64748b', lineHeight: '1.6' }}>
                  The Consumer Price Index includes scheduled domestic and commercial airline fares as a primary component of transport inflation. Below is the live relative importance weighting, APIx index, and real-time augmented basket tracking.
                </p>
              </div>

              {/* CPI CENTER STAGE HERO METRICS */}
              <div style={{ backgroundColor: '#001e43', color: '#ffffff', padding: '30px', borderRadius: '16px', marginBottom: '24px', boxShadow: '0 10px 30px rgba(0,30,67,0.25)', border: '1px solid #1e3a8a' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <div>
                    <span style={{ fontSize: '11px', fontWeight: '800', color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '1px' }}>MoSPI Core Augmentation Engine</span>
                    <h2 style={{ margin: '4px 0 0 0', fontSize: '22px', fontWeight: '900' }}>Live Consumer Price Index (CPI) Center Stage</h2>
                  </div>
                  <span style={{ backgroundColor: '#16a34a', color: 'white', padding: '6px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: '800', letterSpacing: '0.5px' }}>● LIVE SYNCHRONIZED FEED</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                  <div style={{ backgroundColor: '#0f2952', padding: '18px', borderRadius: '10px', border: '1px solid #1e3a8a' }}>
                    <span style={{ fontSize: '10px', color: '#93c5fd', fontWeight: '800', textTransform: 'uppercase' }}>Real-Time Augmented CPI</span>
                    <h2 style={{ margin: '6px 0 2px 0', fontSize: '26px', fontWeight: '900', color: '#ffffff' }}>{govtData.macro_cpi_metrics.airfare_augmented_cpi}</h2>
                    <span style={{ fontSize: '11px', color: '#34d399', fontWeight: '600' }}>Base CPI: {govtData.macro_cpi_metrics.baseline_cpi}</span>
                  </div>
                  <div style={{ backgroundColor: '#0f2952', padding: '18px', borderRadius: '10px', border: '1px solid #1e3a8a' }}>
                    <span style={{ fontSize: '10px', color: '#93c5fd', fontWeight: '800', textTransform: 'uppercase' }}>National Airfare Index (APIx)</span>
                    <h2 style={{ margin: '6px 0 2px 0', fontSize: '26px', fontWeight: '900', color: '#ffffff' }}>{govtData.macro_cpi_metrics.national_airfare_index}</h2>
                    <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: '600' }}>{govtData.comparison_periods['30_days_change']} MoM</span>
                  </div>
                  <div style={{ backgroundColor: '#0f2952', padding: '18px', borderRadius: '10px', border: '1px solid #1e3a8a' }}>
                    <span style={{ fontSize: '10px', color: '#93c5fd', fontWeight: '800', textTransform: 'uppercase' }}>Transport Basket Weight</span>
                    <h2 style={{ margin: '6px 0 2px 0', fontSize: '26px', fontWeight: '900', color: '#ffffff' }}>{govtData.macro_cpi_metrics.transport_basket_weight}</h2>
                    <span style={{ fontSize: '11px', color: '#fbbf24', fontWeight: '600' }}>Official MoSPI Allocation</span>
                  </div>
                  <div style={{ backgroundColor: '#0f2952', padding: '18px', borderRadius: '10px', border: '1px solid #1e3a8a' }}>
                    <span style={{ fontSize: '10px', color: '#93c5fd', fontWeight: '800', textTransform: 'uppercase' }}>Inflation Impact</span>
                    <h2 style={{ margin: '6px 0 2px 0', fontSize: '26px', fontWeight: '900', color: '#f87171' }}>+{govtData.macro_cpi_metrics.national_inflation_impact_pct}%</h2>
                    <span style={{ fontSize: '11px', color: '#fca5a5', fontWeight: '600' }}>Upward Pressure</span>
                  </div>
                </div>
              </div>

              {/* RELATIVE IMPORTANCE TABLE (BLS STYLE) */}
              <div style={{ backgroundColor: '#ffffff', padding: '24px 30px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '900', color: '#001e43' }}>Table A. Relative Importance of Transport & Airfare Components (Current Year)</h3>
                <p style={{ margin: '0 0 16px 0', fontSize: '12px', color: '#64748b' }}>The relative importance of an item category reflects its percent of the total CPI weight.</p>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #cbd5e1', color: '#475569', backgroundColor: '#f1f5f9' }}>
                      <th style={{ padding: '10px' }}>Item Category</th>
                      <th style={{ padding: '10px' }}>Relative Importance Weight (%)</th>
                      <th style={{ padding: '10px' }}>Impact Factor</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '10px', fontWeight: '700', color: '#001e43' }}>Public Transportation & Air Fares</td>
                      <td style={{ padding: '10px', color: '#0284c7', fontWeight: '800' }}>{govtData.macro_cpi_metrics.transport_basket_weight}</td>
                      <td style={{ padding: '10px', color: '#16a34a', fontWeight: '700' }}>High Dynamic Sensitivity</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '10px', fontWeight: '700', color: '#001e43' }}>Domestic Intercity Corridors</td>
                      <td style={{ padding: '10px', color: '#334155' }}>5.82%</td>
                      <td style={{ padding: '10px', color: '#d97706', fontWeight: '700' }}>Moderate Surge</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* DYNAMIC MASTER CPI GRAPH WITH TIMEFRAME SELECTOR */}
              <div style={{ backgroundColor: '#ffffff', padding: '30px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '900', color: '#001e43' }}>📈 Dynamic Master CPI Trend & Analytics Graph</h3>
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
                          backgroundColor: cpiTimeframe === tf ? '#001e43' : 'transparent',
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
                          <polyline fill="none" stroke="#001e43" strokeWidth="4" points={points} />
                          {activeDataset.map((d, idx) => {
                            const x = 70 + (idx * (700 / (activeDataset.length - 1)));
                            const y = 230 - ((d.val - 110) * 8);
                            return (
                              <g key={idx}>
                                <circle cx={x} cy={y} r="6" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />
                                <text x={x} y={y - 12} textAnchor="middle" fill="#001e43" fontSize="11" fontWeight="bold">
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

              {/* ROUTE-WISE PRICES & SEAT AVAILABILITY */}
              <div style={{ backgroundColor: '#ffffff', padding: '24px 30px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '17px', fontWeight: '900', color: '#001e43' }}>🗺️ Route-Wise Prices, Inflation % & Seat Availability Weighting</h3>
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
                        <td style={{ padding: '10px', fontWeight: '700', color: '#001e43' }}>{rt.route}</td>
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
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                <div style={{ backgroundColor: '#ffffff', padding: '24px 30px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                  <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '900', color: '#001e43' }}>✈️ Automatic Multi-Source Collection (Airlines & OTAs)</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
                    <div style={{ backgroundColor: '#f8fafc', padding: '10px 14px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                      <strong>Airlines Active:</strong> IndiGo, Air India, Air India Express, Akasa Air, SpiceJet
                    </div>
                    <div style={{ backgroundColor: '#f8fafc', padding: '10px 14px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                      <strong>OTA Portals Active:</strong> MakeMyTrip, Yatra, EaseMyTrip, Cleartrip, Ixigo, Goibibo
                    </div>
                  </div>
                </div>

                <div style={{ backgroundColor: '#ffffff', padding: '24px 30px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                  <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '900', color: '#001e43' }}>⏳ Scheduled Booking Windows (T+1 to T+45)</h3>
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
                          <td style={{ padding: '8px', fontWeight: '700', color: '#001e43' }}>{bw.window}</td>
                          <td style={{ padding: '8px', color: '#0284c7' }}>₹{bw.avg_fare}</td>
                          <td style={{ padding: '8px', color: '#d97706', fontWeight: '700' }}>{bw.surge_factor}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* DATA CLEANING & BACKTESTING */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                <div style={{ backgroundColor: '#ffffff', padding: '24px 30px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                  <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '900', color: '#001e43' }}>🧹 Data Cleaning & Normalization Engine</h3>
                  <div style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6' }}>
                    <p style={{ margin: '0 0 8px 0' }}>Raw feeds pass through automated outlier isolation to separate base fares, taxes, and convenience fees cleanly.</p>
                    <div style={{ backgroundColor: '#f8fafc', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontFamily: 'monospace', fontSize: '12px' }}>
                      Base: ₹3,200 | Taxes: ₹580 | Conv: ₹150<br/><strong>Total: ₹3,930</strong>
                    </div>
                  </div>
                </div>

                <div style={{ backgroundColor: '#ffffff', padding: '24px 30px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                  <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '900', color: '#001e43' }}>🧪 Backtesting Validation & Transparency</h3>
                  <div style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6' }}>
                    <div><strong>MAPE Accuracy:</strong> {govtData.backtesting_validation.mape}</div>
                    <div><strong>RMSE Score:</strong> {govtData.backtesting_validation.rmse}</div>
                    <div style={{ marginTop: '8px', color: '#16a34a', fontWeight: '700' }}>Status: {govtData.backtesting_validation.status}</div>
                  </div>
                </div>
              </div>

              {/* ACTIVE ALERTS */}
              <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', padding: '20px 24px', marginBottom: '24px' }}>
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

  // --- CONSUMER PORTAL (FLIGHTAPI STYLE HERO & COMPARISON ENGINE) ---
  return (
    <div style={{ backgroundColor: '#f8fafc', color: '#0f172a', minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif' }}>
      
      {/* FlightAPI Style Top Navigation Bar */}
      <div style={{ backgroundColor: '#ffffff', color: '#0f172a', padding: '14px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.03)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <AeroclickLogo size={44} />
          <div>
            <div style={{ fontSize: '11px', color: '#0284c7', fontWeight: '800', letterSpacing: '0.5px' }}>SMART INDIA HACKATHON 2026 | ID 26056</div>
            <h2 style={{ margin: '2px 0 0 0', fontSize: '18px', fontWeight: '900', color: '#001e43' }}>AEROCLICK // CONSUMER FLIGHT API</h2>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>Trusted by 8,000+ developers & travelers</span>
          <button 
            onClick={() => setActivePortal('govt')} 
            style={{ backgroundColor: '#001e43', color: 'white', border: 'none', padding: '9px 18px', borderRadius: '6px', cursor: 'pointer', fontWeight: '800', fontSize: '12px', boxShadow: '0 4px 12px rgba(0,30,67,0.2)' }}
          >
            Switch to MoSPI Officer Portal →
          </button>
        </div>
      </div>

      {/* FlightAPI Inspired Hero Section */}
      <div style={{ 
        backgroundImage: 'linear-gradient(rgba(0, 30, 67, 0.92), rgba(0, 15, 35, 0.95)), url("https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1600&auto=format&fit=crop")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: '#ffffff',
        padding: '80px 40px 100px 40px',
        textAlign: 'center'
      }}>
        <div style={{ display: 'inline-block', backgroundColor: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '800', marginBottom: '16px', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
          ✈️ Real-Time Flight Data API & Comparison Engine
        </div>
        <h1 style={{ margin: '0 auto', maxWidth: '900px', fontSize: '42px', fontWeight: '900', letterSpacing: '-0.5px', lineHeight: '1.2' }}>
          Flight Data API for Real-Time Price Comparison, Status and Schedules
        </h1>
        <p style={{ margin: '16px auto 0 auto', maxWidth: '750px', fontSize: '16px', color: '#cbd5e1', lineHeight: '1.6' }}>
          Aeroclick is a fast and flexible solution for travelers and businesses that need real-time, accurate flight data across all airlines and OTAs instantly.
        </p>

        {/* Stats Pills */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginTop: '35px' }}>
          <div style={{ backgroundColor: 'rgba(255,255,255,0.08)', padding: '12px 24px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.15)' }}>
            <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '900', color: '#38bdf8' }}>8,000+</h3>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>Daily searches powered</span>
          </div>
          <div style={{ backgroundColor: 'rgba(255,255,255,0.08)', padding: '12px 24px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.15)' }}>
            <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '900', color: '#34d399' }}>700+</h3>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>Global Airlines & OTAs</span>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 36px 50px 36px', maxWidth: '1280px', margin: '-40px auto 0 auto', position: 'relative', zIndex: 10 }}>
        
        {/* CROSS-PLATFORM COMPARISON WIDGET */}
        <div style={{ backgroundColor: '#ffffff', padding: '32px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '28px', boxShadow: '0 20px 40px rgba(0,30,67,0.08)' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '900', color: '#001e43' }}>🔍 Instant Cross-Platform Fare Comparison Engine (All Airlines & OTAs)</h3>
          
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div>
              <label style={{ fontSize: '11px', fontWeight: '800', color: '#475569', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>Origin</label>
              <input 
                type="text" 
                value={compOrigin} 
                onChange={(e) => setCompOrigin(e.target.value)} 
                placeholder="e.g. Delhi"
                style={{ backgroundColor: '#f8fafc', color: '#001e43', padding: '12px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', width: '180px', outline: 'none', fontSize: '14px', fontWeight: '600' }} 
              />
            </div>
            <div>
              <label style={{ fontSize: '11px', fontWeight: '800', color: '#475569', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>Destination</label>
              <input 
                type="text" 
                value={compDest} 
                onChange={(e) => setCompDest(e.target.value)} 
                placeholder="e.g. Goa"
                style={{ backgroundColor: '#f8fafc', color: '#001e43', padding: '12px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', width: '180px', outline: 'none', fontSize: '14px', fontWeight: '600' }} 
              />
            </div>
            <div>
              <label style={{ fontSize: '11px', fontWeight: '800', color: '#475569', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>Travel Date</label>
              <input 
                type="date" 
                value={compDate} 
                onChange={(e) => setCompDate(e.target.value)} 
                style={{ backgroundColor: '#f8fafc', color: '#001e43', padding: '12px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', width: '160px', outline: 'none', fontSize: '14px', fontWeight: '600' }} 
              />
            </div>
            <button onClick={runComparison} style={{ backgroundColor: '#001e43', color: 'white', border: 'none', padding: '14px 26px', borderRadius: '8px', fontWeight: '800', cursor: 'pointer', marginTop: '18px', fontSize: '14px', boxShadow: '0 4px 12px rgba(0,30,67,0.2)' }}>
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

              <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '900', color: '#001e43' }}>📊 Real-Time Unbundled Comparison Table (Airlines vs OTAs)</h4>
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
                        <td style={{ padding: '12px', fontWeight: '800', color: '#001e43', display: 'flex', alignItems: 'center', gap: '8px' }}>
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
        <div style={{ backgroundColor: '#ffffff', padding: '28px 32px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '28px', boxShadow: '0 10px 25px rgba(0,30,67,0.05)' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '900', color: '#001e43' }}>🤖 Universal AI Fare Predictor & Trend Forecaster</h3>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div>
              <label style={{ fontSize: '11px', fontWeight: '800', color: '#475569', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>Origin City</label>
              <input 
                type="text" 
                value={predOrigin} 
                onChange={(e) => setPredOrigin(e.target.value)} 
                placeholder="e.g. Delhi"
                style={{ backgroundColor: '#f8fafc', color: '#001e43', padding: '12px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', width: '180px', outline: 'none', fontSize: '14px', fontWeight: '600' }} 
              />
            </div>
            <div>
              <label style={{ fontSize: '11px', fontWeight: '800', color: '#475569', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>Destination City</label>
              <input 
                type="text" 
                value={predDest} 
                onChange={(e) => setPredDest(e.target.value)} 
                placeholder="e.g. Goa"
                style={{ backgroundColor: '#f8fafc', color: '#001e43', padding: '12px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', width: '180px', outline: 'none', fontSize: '14px', fontWeight: '600' }} 
              />
            </div>
            <div>
              <label style={{ fontSize: '11px', fontWeight: '800', color: '#475569', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>Days Ahead</label>
              <input type="number" value={predDays} onChange={(e) => setPredDays(e.target.value)} style={{ width: '90px', backgroundColor: '#f8fafc', color: '#001e43', padding: '12px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px', fontWeight: '600' }} />
            </div>
            <button onClick={runAIPrediction} style={{ backgroundColor: '#001e43', color: 'white', border: 'none', padding: '14px 24px', borderRadius: '8px', fontWeight: '800', cursor: 'pointer', marginTop: '18px', fontSize: '14px', boxShadow: '0 4px 12px rgba(0,30,67,0.2)' }}>
              Calculate AI Forecast →
            </button>
          </div>

          {aiResult && (
            <div style={{ marginTop: '22px', backgroundColor: '#f8fafc', padding: '18px 22px', borderRadius: '8px', borderLeft: '5px solid #001e43', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <strong style={{ fontSize: '16px', color: '#001e43' }}>{aiResult.route} ({aiResult.forecast_horizon_days} Days Out)</strong>
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