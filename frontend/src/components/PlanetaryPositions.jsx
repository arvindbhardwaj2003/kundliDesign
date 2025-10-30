const PLANET_NAMES_HINDI = {
  'Su': { hindi: 'सूर्य', english: 'Sun', symbol: '☉' },
  'Mo': { hindi: 'चंद्र', english: 'Moon', symbol: '☽' },
  'Ma': { hindi: 'मंगल', english: 'Mars', symbol: '♂' },
  'Me': { hindi: 'बुध', english: 'Mercury', symbol: '☿' },
  'Ju': { hindi: 'गुरु', english: 'Jupiter', symbol: '♃' },
  'Ve': { hindi: 'शुक्र', english: 'Venus', symbol: '♀' },
  'Sa': { hindi: 'शनि', english: 'Saturn', symbol: '♄' },
  'Ra': { hindi: 'राहु', english: 'Rahu', symbol: '☊' },
  'Ke': { hindi: 'केतु', english: 'Ketu', symbol: '☋' },
  'Asc': { hindi: 'लग्न', english: 'Ascendant', symbol: 'Asc' },
};

const SIGN_NAMES_HINDI = {
  1: { hindi: 'मेष', english: 'Aries', symbol: '♈' },
  2: { hindi: 'वृषभ', english: 'Taurus', symbol: '♉' },
  3: { hindi: 'मिथुन', english: 'Gemini', symbol: '♊' },
  4: { hindi: 'कर्क', english: 'Cancer', symbol: '♋' },
  5: { hindi: 'सिंह', english: 'Leo', symbol: '♌' },
  6: { hindi: 'कन्या', english: 'Virgo', symbol: '♍' },
  7: { hindi: 'तुला', english: 'Libra', symbol: '♎' },
  8: { hindi: 'वृश्चिक', english: 'Scorpio', symbol: '♏' },
  9: { hindi: 'धनु', english: 'Sagittarius', symbol: '♐' },
  10: { hindi: 'मकर', english: 'Capricorn', symbol: '♑' },
  11: { hindi: 'कुंभ', english: 'Aquarius', symbol: '♒' },
  12: { hindi: 'मीन', english: 'Pisces', symbol: '♓' },
};

export default function PlanetaryPositions({ chart, title }) {
  if (!chart) return null;

  const planetaryData = [];

  for (const house in chart) {
    const houseData = chart[house];
    const signNum = houseData.sign_num;
    const planets = houseData.planets;

    if (typeof planets === 'object' && !Array.isArray(planets)) {
      for (const [planet, position] of Object.entries(planets)) {
        if (PLANET_NAMES_HINDI[planet]) {
          planetaryData.push({
            planet,
            planetInfo: PLANET_NAMES_HINDI[planet],
            sign: SIGN_NAMES_HINDI[signNum],
            signNum,
            position,
            house: parseInt(house),
          });
        }
      }
    } else if (Array.isArray(planets)) {
      planets.forEach(planet => {
        if (PLANET_NAMES_HINDI[planet]) {
          planetaryData.push({
            planet,
            planetInfo: PLANET_NAMES_HINDI[planet],
            sign: SIGN_NAMES_HINDI[signNum],
            signNum,
            position: null,
            house: parseInt(house),
          });
        }
      });
    }
  }

  planetaryData.sort((a, b) => {
    const order = ['Su', 'Mo', 'Ma', 'Me', 'Ju', 'Ve', 'Sa', 'Ra', 'Ke', 'Asc'];
    return order.indexOf(a.planet) - order.indexOf(b.planet);
  });

  return (
    <div className="planetary-positions">
      <h3 className="positions-title">{title}</h3>
      <div className="positions-grid">
        {planetaryData.map((data, index) => (
          <div key={index} className="planet-card">
            <div className="planet-header">
              <span className="planet-symbol">{data.planetInfo.symbol}</span>
              <div className="planet-names">
                <span className="planet-name-hindi">{data.planetInfo.hindi}</span>
                <span className="planet-name-english">{data.planetInfo.english}</span>
              </div>
            </div>
            <div className="planet-details">
              <div className="detail-row">
                <span className="detail-label">राशि (Sign):</span>
                <span className="detail-value">
                  {data.sign.symbol} {data.sign.hindi} ({data.sign.english})
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">भाव (House):</span>
                <span className="detail-value">{data.house}</span>
              </div>
              {data.position && (
                <div className="detail-row">
                  <span className="detail-label">स्थिति (Position):</span>
                  <span className="detail-value position-degrees">{data.position}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="data-source-warning">
        <span className="warning-icon">⚠️</span>
        <p>
          <strong>ध्यान दें (Note):</strong> वर्तमान में यह डेटा उदाहरण के लिए है।
          सटीक ग्रह स्थिति गणना के लिए Swiss Ephemeris या अन्य ज्योतिष गणना पुस्तकालय की आवश्यकता है।
        </p>
        <p className="warning-english">
          <strong>Please Note:</strong> Currently showing sample data.
          Accurate planetary calculations require Swiss Ephemeris or similar astronomical calculation library.
        </p>
      </div>
    </div>
  );
}
