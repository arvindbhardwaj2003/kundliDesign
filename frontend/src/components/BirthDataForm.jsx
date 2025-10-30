import { useState } from 'react';

export default function BirthDataForm({ onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    name: '',
    year: new Date().getFullYear(),
    month: 1,
    day: 1,
    hour: 0,
    minute: 0,
    utcOffset: '+0',
    city: '',
    latitude: 0,
    longitude: 0,
  });

  const [errors, setErrors] = useState({});
  const [isGeocoding, setIsGeocoding] = useState(false);

  const geocodeCity = async (cityName) => {
    if (!cityName.trim()) {
      return null;
    }

    setIsGeocoding(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityName)}&limit=1`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        return {
          latitude: parseFloat(data[0].lat),
          longitude: parseFloat(data[0].lon),
        };
      }
      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleCityBlur = async () => {
    if (formData.city.trim()) {
      const coords = await geocodeCity(formData.city);
      if (coords) {
        setFormData((prev) => ({
          ...prev,
          latitude: coords.latitude,
          longitude: coords.longitude,
        }));
        setErrors((prev) => ({ ...prev, city: undefined }));
      } else {
        setErrors((prev) => ({ ...prev, city: 'City not found. Please check the name.' }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (formData.year < 1900 || formData.year > 2100) {
      newErrors.year = 'Year must be between 1900 and 2100';
    }

    if (formData.month < 1 || formData.month > 12) {
      newErrors.month = 'Month must be between 1 and 12';
    }

    if (formData.day < 1 || formData.day > 31) {
      newErrors.day = 'Day must be between 1 and 31';
    }

    if (formData.hour < 0 || formData.hour > 23) {
      newErrors.hour = 'Hour must be between 0 and 23';
    }

    if (formData.minute < 0 || formData.minute > 59) {
      newErrors.minute = 'Minute must be between 0 and 59';
    }

    if (!formData.city.trim() && (formData.latitude === 0 && formData.longitude === 0)) {
      newErrors.city = 'City name is required';
    }

    if (formData.latitude < -90 || formData.latitude > 90) {
      newErrors.latitude = 'Latitude must be between -90 and 90';
    }

    if (formData.longitude < -180 || formData.longitude > 180) {
      newErrors.longitude = 'Longitude must be between -180 and 180';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'name' || name === 'utcOffset' || name === 'city' ? value : parseFloat(value) || 0,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="birth-data-form">
      <div className="form-section">
        <h3>Personal Information</h3>
        <div className="form-group">
          <label htmlFor="name">Full Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? 'error' : ''}
            placeholder="Enter full name"
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>
      </div>

      <div className="form-section">
        <h3>Birth Date & Time</h3>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="year">Year *</label>
            <input
              type="number"
              id="year"
              name="year"
              value={formData.year}
              onChange={handleChange}
              className={errors.year ? 'error' : ''}
            />
            {errors.year && <span className="error-message">{errors.year}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="month">Month *</label>
            <input
              type="number"
              id="month"
              name="month"
              min="1"
              max="12"
              value={formData.month}
              onChange={handleChange}
              className={errors.month ? 'error' : ''}
            />
            {errors.month && <span className="error-message">{errors.month}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="day">Day *</label>
            <input
              type="number"
              id="day"
              name="day"
              min="1"
              max="31"
              value={formData.day}
              onChange={handleChange}
              className={errors.day ? 'error' : ''}
            />
            {errors.day && <span className="error-message">{errors.day}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="hour">Hour (24h) *</label>
            <input
              type="number"
              id="hour"
              name="hour"
              min="0"
              max="23"
              value={formData.hour}
              onChange={handleChange}
              className={errors.hour ? 'error' : ''}
            />
            {errors.hour && <span className="error-message">{errors.hour}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="minute">Minute *</label>
            <input
              type="number"
              id="minute"
              name="minute"
              min="0"
              max="59"
              value={formData.minute}
              onChange={handleChange}
              className={errors.minute ? 'error' : ''}
            />
            {errors.minute && <span className="error-message">{errors.minute}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="utcOffset">UTC Offset *</label>
            <input
              type="text"
              id="utcOffset"
              name="utcOffset"
              value={formData.utcOffset}
              onChange={handleChange}
              placeholder="+5:30 or -5"
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>Birth Location</h3>
        <div className="form-group">
          <label htmlFor="city">City Name *</label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            onBlur={handleCityBlur}
            className={errors.city ? 'error' : ''}
            placeholder="e.g., New Delhi, Mumbai, New York"
            disabled={isGeocoding}
          />
          {isGeocoding && <span className="info-message">Searching location...</span>}
          {errors.city && <span className="error-message">{errors.city}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="latitude">Latitude (auto-filled)</label>
            <input
              type="number"
              id="latitude"
              name="latitude"
              step="0.000001"
              value={formData.latitude}
              onChange={handleChange}
              className={errors.latitude ? 'error' : ''}
              placeholder="e.g., 28.6139"
              readOnly
            />
            {errors.latitude && <span className="error-message">{errors.latitude}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="longitude">Longitude (auto-filled)</label>
            <input
              type="number"
              id="longitude"
              name="longitude"
              step="0.000001"
              value={formData.longitude}
              onChange={handleChange}
              className={errors.longitude ? 'error' : ''}
              placeholder="e.g., 77.2090"
              readOnly
            />
            {errors.longitude && <span className="error-message">{errors.longitude}</span>}
          </div>
        </div>
      </div>

      <button type="submit" className="submit-button" disabled={isLoading || isGeocoding}>
        {isLoading && (
          <span className="jupiter-loader">
            <div className="jupiter-core"></div>
            <div className="jupiter-ring"></div>
            <div className="jupiter-ring"></div>
          </span>
        )}
        {isLoading ? 'Generating Kundli...' : 'Generate Kundli'}
      </button>
    </form>
  );
}
