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
      <g key={houseId}>
        <text className="house-number" textAnchor="middle">
          {houseId}
        </text>
        {house.asc && (
          <text className="house-label-small" textAnchor="middle">
            {houseId === '1' ? 'Ascendant' : houseId === '7' ? 'Descendant' : ''}
          </text>
        )}
        {planets.length > 0 && (
          <text className="planet-text" textAnchor="middle">
            {planets.map(p => PLANET_SYMBOLS[p] || p).join(', ')}
          </text>
        )}
      </g>
    );
  };

  return (
    <div className="kundli-chart-container">
      <h3 className="chart-title">{title}</h3>
      <div className="kundli-north-wrapper">
        <svg viewBox="0 0 500 500" preserveAspectRatio="xMidYMid meet">
          <rect className="outer-square" x="50" y="50" width="400" height="400"/>

          <line className="diagonal-line" x1="50" y1="50" x2="450" y2="450"/>
          <line className="diagonal-line" x1="450" y1="50" x2="50" y2="450"/>

          <polygon className="inner-square" points="250,50 450,250 250,450 50,250"/>

          <g transform="translate(250, 120)">
            {renderHouse('1')}
          </g>

          <g transform="translate(350, 110)">
            {renderHouse('2')}
          </g>

          <g transform="translate(390, 180)">
            {renderHouse('3')}
          </g>

          <g transform="translate(380, 250)">
            {renderHouse('4')}
          </g>

          <g transform="translate(390, 320)">
            {renderHouse('5')}
          </g>

          <g transform="translate(350, 390)">
            {renderHouse('6')}
          </g>

          <g transform="translate(250, 380)">
            {renderHouse('7')}
          </g>

          <g transform="translate(150, 390)">
            {renderHouse('8')}
          </g>

          <g transform="translate(110, 320)">
            {renderHouse('9')}
          </g>

          <g transform="translate(120, 250)">
            {renderHouse('10')}
          </g>

          <g transform="translate(110, 180)">
            {renderHouse('11')}
          </g>

          <g transform="translate(150, 110)">
            {renderHouse('12')}
          </g>
        </svg>
      </div>
    </div>
  );
}
