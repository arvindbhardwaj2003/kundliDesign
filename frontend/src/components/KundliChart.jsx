const SIGN_NAMES = {
  1: 'Aries', 2: 'Taurus', 3: 'Gemini', 4: 'Cancer',
  5: 'Leo', 6: 'Virgo', 7: 'Libra', 8: 'Scorpio',
  9: 'Sagittarius', 10: 'Capricorn', 11: 'Aquarius', 12: 'Pisces'
};

const PLANET_SYMBOLS = {
  'Su': 'Su', 'Mo': 'Mo', 'Ma': 'Ma', 'Me': 'Me',
  'Ju': 'Ju', 'Ve': 'Ve', 'Sa': 'Sa', 'Ra': 'Ra',
  'Ke': 'Ke', 'Asc': 'Asc', 'Ur': 'Ur', 'Ne': 'Ne', 'Pl': 'Pl'
};

export default function KundliChart({ chart, title }) {
  if (!chart) return null;

  const renderHouse = (houseId) => {
    const house = chart[houseId];
    if (!house) return null;

    const planets = Array.isArray(house.planets)
      ? house.planets
      : Object.keys(house.planets || {});

    return (
      <div key={houseId} className={`kundli-house house-${houseId}`}>
        <div className="house-number">{houseId}</div>
        <div className="house-planets">
          {house.asc && <span className="planet-label">Asc</span>}
          {planets.map((planet, idx) => (
            <span key={idx} className="planet-label">
              {PLANET_SYMBOLS[planet] || planet}
            </span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="kundli-chart-container">
      <h3 className="chart-title">{title}</h3>
      <div className="kundli-chart-wrapper">
        <svg className="kundli-svg" viewBox="0 0 500 500" preserveAspectRatio="xMidYMid meet">
          <polygon
            points="250,50 450,250 250,450 50,250"
            fill="#fafad2"
            stroke="#000"
            strokeWidth="2"
          />

          <line x1="250" y1="50" x2="250" y2="450" stroke="#000" strokeWidth="2" />
          <line x1="50" y1="250" x2="450" y2="250" stroke="#000" strokeWidth="2" />

          <line x1="150" y1="150" x2="350" y2="150" stroke="#000" strokeWidth="2" />
          <line x1="150" y1="350" x2="350" y2="350" stroke="#000" strokeWidth="2" />
          <line x1="150" y1="150" x2="150" y2="350" stroke="#000" strokeWidth="2" />
          <line x1="350" y1="150" x2="350" y2="350" stroke="#000" strokeWidth="2" />

          <line x1="50" y1="250" x2="150" y2="150" stroke="#000" strokeWidth="2" />
          <line x1="50" y1="250" x2="150" y2="350" stroke="#000" strokeWidth="2" />
          <line x1="450" y1="250" x2="350" y2="150" stroke="#000" strokeWidth="2" />
          <line x1="450" y1="250" x2="350" y2="350" stroke="#000" strokeWidth="2" />

          <line x1="250" y1="50" x2="150" y2="150" stroke="#000" strokeWidth="2" />
          <line x1="250" y1="50" x2="350" y2="150" stroke="#000" strokeWidth="2" />
          <line x1="250" y1="450" x2="150" y2="350" stroke="#000" strokeWidth="2" />
          <line x1="250" y1="450" x2="350" y2="350" stroke="#000" strokeWidth="2" />
        </svg>

        <div className="kundli-houses-overlay">
          <div className="house-position house-pos-12">
            {renderHouse('12')}
          </div>
          <div className="house-position house-pos-1">
            {renderHouse('1')}
          </div>
          <div className="house-position house-pos-2">
            {renderHouse('2')}
          </div>
          <div className="house-position house-pos-11">
            {renderHouse('11')}
          </div>
          <div className="house-position house-pos-3">
            {renderHouse('3')}
          </div>
          <div className="house-position house-pos-10">
            {renderHouse('10')}
          </div>
          <div className="house-position house-pos-4">
            {renderHouse('4')}
          </div>
          <div className="house-position house-pos-9">
            {renderHouse('9')}
          </div>
          <div className="house-position house-pos-5">
            {renderHouse('5')}
          </div>
          <div className="house-position house-pos-8">
            {renderHouse('8')}
          </div>
          <div className="house-position house-pos-7">
            {renderHouse('7')}
          </div>
          <div className="house-position house-pos-6">
            {renderHouse('6')}
          </div>
        </div>
      </div>
    </div>
  );
}
