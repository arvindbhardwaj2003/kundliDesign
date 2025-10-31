import { useState } from 'react';

export default function PlanetCustomizer({ onSettingsChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState({
    planetSize: 1,
    planetOpacity: 0.5,
    animationSpeed: 1,
    colorTheme: 'blue'
  });

  const colorThemes = {
    blue: { name: 'Ocean Blue', colors: ['#4a90e2', '#5a7fa0', '#6b8caf', '#3d6a9e'] },
    purple: { name: 'Cosmic Purple', colors: ['#9333ea', '#7c3aed', '#a855f7', '#8b5cf6'] },
    teal: { name: 'Mystical Teal', colors: ['#14b8a6', '#0d9488', '#2dd4bf', '#5eead4'] },
    amber: { name: 'Golden Amber', colors: ['#f59e0b', '#d97706', '#fbbf24', '#fcd34d'] },
    emerald: { name: 'Emerald Green', colors: ['#10b981', '#059669', '#34d399', '#6ee7b7'] }
  };

  const handleChange = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onSettingsChange(newSettings);
  };

  return (
    <div className="planet-customizer">
      <button
        className="customizer-toggle"
        onClick={() => setIsOpen(!isOpen)}
        title="Customize Planets"
      >
        <span className="toggle-icon">⚙️</span>
        <span className="toggle-text">Customize Background</span>
      </button>

      {isOpen && (
        <div className="customizer-panel">
          <div className="panel-header">
            <h3>Planet Appearance</h3>
            <button className="close-btn" onClick={() => setIsOpen(false)}>×</button>
          </div>

          <div className="customizer-content">
            <div className="control-group">
              <label>
                <span className="control-label">Planet Size</span>
                <span className="control-value">{Math.round(settings.planetSize * 100)}%</span>
              </label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={settings.planetSize}
                onChange={(e) => handleChange('planetSize', parseFloat(e.target.value))}
                className="slider"
              />
            </div>

            <div className="control-group">
              <label>
                <span className="control-label">Opacity</span>
                <span className="control-value">{Math.round(settings.planetOpacity * 100)}%</span>
              </label>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={settings.planetOpacity}
                onChange={(e) => handleChange('planetOpacity', parseFloat(e.target.value))}
                className="slider"
              />
            </div>

            <div className="control-group">
              <label>
                <span className="control-label">Animation Speed</span>
                <span className="control-value">{settings.animationSpeed}x</span>
              </label>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.5"
                value={settings.animationSpeed}
                onChange={(e) => handleChange('animationSpeed', parseFloat(e.target.value))}
                className="slider"
              />
            </div>

            <div className="control-group">
              <label className="control-label">Color Theme</label>
              <div className="color-themes">
                {Object.entries(colorThemes).map(([key, theme]) => (
                  <button
                    key={key}
                    className={`theme-btn ${settings.colorTheme === key ? 'active' : ''}`}
                    onClick={() => handleChange('colorTheme', key)}
                    title={theme.name}
                  >
                    <div className="theme-preview">
                      {theme.colors.map((color, i) => (
                        <div
                          key={i}
                          className="theme-color"
                          style={{ background: color }}
                        />
                      ))}
                    </div>
                    <span className="theme-name">{theme.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="control-actions">
              <button
                className="reset-btn"
                onClick={() => {
                  const defaults = {
                    planetSize: 1,
                    planetOpacity: 0.5,
                    animationSpeed: 1,
                    colorTheme: 'blue'
                  };
                  setSettings(defaults);
                  onSettingsChange(defaults);
                }}
              >
                Reset to Defaults
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
