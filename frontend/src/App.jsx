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
      <header className="app-header">
        <h1>Vedic Kundli Generator</h1>
        <p className="subtitle">Generate accurate Vedic astrology birth charts</p>
      </header>

      <main className="app-main">
        {!kundliData && (
          <div className="form-container">
            <BirthDataForm onSubmit={generateKundli} isLoading={isLoading} />
            {error && (
              <div className="error-banner">
                <strong>Error:</strong> {error}
              </div>
            )}
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
