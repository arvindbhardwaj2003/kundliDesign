const SIGN_NAMES = {
  1: 'Aries', 2: 'Taurus', 3: 'Gemini', 4: 'Cancer',
  5: 'Leo', 6: 'Virgo', 7: 'Libra', 8: 'Scorpio',
  9: 'Sagittarius', 10: 'Capricorn', 11: 'Aquarius', 12: 'Pisces'
};

const PLANET_SYMBOLS = {
  'Su': '☉', 'Mo': '☽', 'Ma': '♂', 'Me': '☿',
  'Ju': '♃', 'Ve': '♀', 'Sa': '♄', 'Ra': '☊',
  'Ke': '☋', 'Asc': 'AC'
};

export default function KundliChart({ chart, title }) {
  if (!chart) return null;

  const houseOrder = [
    { id: '12', position: 'top-left' },
    { id: '1', position: 'top' },
    { id: '2', position: 'top-right' },
    { id: '11', position: 'left' },
    { id: '3', position: 'right' },
    { id: '10', position: 'bottom-left-inner' },
    { id: '4', position: 'bottom-right-inner' },
    { id: '9', position: 'bottom-left' },
    { id: '5', position: 'bottom-right' },
    { id: '8', position: 'bottom-left-outer' },
    { id: '6', position: 'bottom-right-outer' },
    { id: '7', position: 'bottom' }
  ];

  const renderHouse = (houseId) => {
    const house = chart[houseId];
    if (!house) return null;

    const planets = Array.isArray(house.planets)
      ? house.planets
      : Object.keys(house.planets || {});

    return (
      <div key={houseId} className={`house house-${houseId}`}>
        <div className="sign-number">{house.sign_num}</div>
        <div className="sign-name">{SIGN_NAMES[house.sign_num]}</div>
        {house.asc && <div className="planet">AC</div>}
        <div className="planets">
          {planets.map((planet, idx) => (
            <div key={idx} className="planet">
              {PLANET_SYMBOLS[planet] || planet}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="kundli-chart-container">
      <h3 className="chart-title">{title}</h3>
      <div className="kundli-chart">
        <svg className="chart-background" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
          <polygon points="200,0 400,200 200,400 0,200" fill="none" stroke="#333" strokeWidth="2"/>
          <line x1="200" y1="0" x2="200" y2="400" stroke="#333" strokeWidth="1"/>
          <line x1="0" y1="200" x2="400" y2="200" stroke="#333" strokeWidth="1"/>
          <line x1="100" y1="100" x2="300" y2="100" stroke="#333" strokeWidth="1"/>
          <line x1="100" y1="300" x2="300" y2="300" stroke="#333" strokeWidth="1"/>
          <line x1="100" y1="100" x2="100" y2="300" stroke="#333" strokeWidth="1"/>
          <line x1="300" y1="100" x2="300" y2="300" stroke="#333" strokeWidth="1"/>
          <line x1="100" y1="100" x2="0" y2="200" stroke="#333" strokeWidth="1"/>
          <line x1="100" y1="300" x2="0" y2="200" stroke="#333" strokeWidth="1"/>
          <line x1="300" y1="100" x2="400" y2="200" stroke="#333" strokeWidth="1"/>
          <line x1="300" y1="300" x2="400" y2="200" stroke="#333" strokeWidth="1"/>
          <line x1="200" y1="0" x2="100" y2="100" stroke="#333" strokeWidth="1"/>
          <line x1="200" y1="0" x2="300" y2="100" stroke="#333" strokeWidth="1"/>
          <line x1="200" y1="400" x2="100" y2="300" stroke="#333" strokeWidth="1"/>
          <line x1="200" y1="400" x2="300" y2="300" stroke="#333" strokeWidth="1"/>
        </svg>
        <div className="houses-grid">
          {renderHouse('12')}
          {renderHouse('1')}
          {renderHouse('2')}
          {renderHouse('11')}
          <div className="center-space"></div>
          {renderHouse('3')}
          {renderHouse('10')}
          {renderHouse('4')}
          {renderHouse('9')}
          {renderHouse('5')}
          {renderHouse('8')}
          {renderHouse('7')}
          {renderHouse('6')}
        </div>
      </div>
    </div>
  );
}
