import { useState } from 'react';
import BirthDataForm from './components/BirthDataForm';
import KundliDisplay from './components/KundliDisplay';
import { supabase } from './lib/supabase';
import './App.css';

function App() {
  const [kundliData, setKundliData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recentCharts, setRecentCharts] = useState([]);
  const [showRecent, setShowRecent] = useState(false);

  const generateKundli = async (birthData) => {
    setIsLoading(true);
    setError(null);

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://wxuqwkpqrgcxrcglhbhz.supabase.co';
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4dXF3a3BxcmdjeHJjZ2xoYmh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4MjQ0NDAsImV4cCI6MjA3NzQwMDQ0MH0.ZKZSaABQHV1f5YilRIPtdYnNKbfdk-gESYgAx3GMVDo';
      const apiUrl = `${supabaseUrl}/functions/v1/generate-kundli`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseKey}`,
        },
        body: JSON.stringify(birthData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate Kundli');
      }

      const data = await response.json();
      setKundliData(data);
      loadRecentCharts();
    } catch (err) {
      setError(err.message);
      console.error('Error generating Kundli:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadRecentCharts = async () => {
    try {
      const { data, error } = await supabase
        .from('kundli_charts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setRecentCharts(data || []);
    } catch (err) {
      console.error('Error loading recent charts:', err);
    }
  };

  const loadChart = (chart) => {
    setKundliData(chart);
    setShowRecent(false);
  };

  return (
    <div className="app">
      <div className="cosmic-bg">
        <div className="zodiac-wheel-bg"></div>
        <div className="planet planet-1"></div>
        <div className="planet planet-2"></div>
        <div className="planet planet-3"></div>
        <div className="planet planet-4"></div>
        <div className="planet planet-5"></div>
        <div className="planet planet-6"></div>
        <div className="planet planet-7"></div>
        <div className="planet planet-8"></div>
        <div className="planet planet-9"></div>
        <div className="planet planet-10"></div>
      </div>

      <header className="app-header">
        <div className="header-content">
          <div className="header-left">
            <a href="/" className="logo">
              <span className="logo-icon">🔮</span>
              <span className="logo-text">Kundli</span>
            </a>
            <nav>
              <ul className="nav-links">
                <li><a href="#home">Home</a></li>
                <li><a href="#chart">Charts</a></li>
                <li><a href="#about">About</a></li>
              </ul>
            </nav>
          </div>
          <div className="header-right">
            <div className="zodiac-symbols">
              <span className="zodiac-symbol" title="Aries">♈</span>
              <span className="zodiac-symbol" title="Taurus">♉</span>
              <span className="zodiac-symbol" title="Gemini">♊</span>
              <span className="zodiac-symbol" title="Cancer">♋</span>
              <span className="zodiac-symbol" title="Leo">♌</span>
              <span className="zodiac-symbol" title="Virgo">♍</span>
            </div>
          </div>
        </div>
      </header>

      <main className="app-main">
        {!kundliData && (
          <div className="main-container">
            <div className="form-container">
              <BirthDataForm onSubmit={generateKundli} isLoading={isLoading} />
              {error && (
                <div className="error-banner">
                  <strong>Error:</strong> {error}
                </div>
              )}
            </div>
          </div>
        )}

        {kundliData && (
          <div className="results-container">
            <button
              className="back-button"
              onClick={() => {
                setKundliData(null);
                setError(null);
              }}
            >
              ← Generate New Kundli
            </button>
            <KundliDisplay kundliData={kundliData} />
          </div>
        )}

        <div className="recent-charts-section">
          <button
            className="toggle-recent-button"
            onClick={() => {
              setShowRecent(!showRecent);
              if (!showRecent) loadRecentCharts();
            }}
          >
            {showRecent ? 'Hide' : 'View'} Recent Charts ({recentCharts.length})
          </button>

          {showRecent && recentCharts.length > 0 && (
            <div className="recent-charts-list">
              {recentCharts.map((chart) => (
                <div
                  key={chart.id}
                  className="recent-chart-item"
                  onClick={() => loadChart(chart)}
                >
                  <h4>{chart.name}</h4>
                  <p className="chart-date">
                    {new Date(chart.birth_datetime).toLocaleDateString()}
                  </p>
                  <p className="chart-created">
                    Generated: {new Date(chart.created_at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="app-footer">
        <p>Based on Vedic Sidereal Astrology calculations</p>
      </footer>
    </div>
  );
}

export default App;
