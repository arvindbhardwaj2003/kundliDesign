import KundliChart from './KundliChart';

export default function KundliDisplay({ kundliData }) {
  if (!kundliData) return null;

  return (
    <div className="kundli-display">
      <div className="kundli-header">
        <h2>{kundliData.name}'s Kundli</h2>
        <div className="birth-info">
          <p>
            <strong>Birth Date:</strong>{' '}
            {new Date(kundliData.birth_datetime).toLocaleString()}
          </p>
          <p>
            <strong>Location:</strong> {kundliData.latitude.toFixed(4)}°,{' '}
            {kundliData.longitude.toFixed(4)}° (UTC {kundliData.utc_offset})
          </p>
        </div>
      </div>

      <div className="charts-grid">
        <KundliChart chart={kundliData.lagna_chart} title="Lagna Chart (Birth Chart)" />
        <KundliChart chart={kundliData.moon_chart} title="Moon Chart (Chandra Kundli)" />
        <KundliChart chart={kundliData.navamsa_chart} title="Navamsa Chart (D9)" />
        <KundliChart chart={kundliData.transit_chart} title="Transit Chart" />
      </div>
    </div>
  );
}
