/*
  # Create Kundli Application Schema

  ## Overview
  This migration creates the database schema for storing Kundli (Vedic birth chart) data and user information.

  ## New Tables
  
  ### `kundli_charts`
  Stores generated Kundli chart data for users
  - `id` (uuid, primary key) - Unique identifier for each chart
  - `name` (text) - Name of the person for whom the chart is generated
  - `birth_datetime` (timestamptz) - Complete birth date and time
  - `latitude` (numeric) - Birth location latitude
  - `longitude` (numeric) - Birth location longitude  
  - `utc_offset` (text) - UTC timezone offset (e.g., "+5:30")
  - `lagna_chart` (jsonb) - Lagna/Ascendant chart data
  - `navamsa_chart` (jsonb) - Navamsa (D9) chart data
  - `moon_chart` (jsonb) - Moon chart data
  - `transit_chart` (jsonb) - Transit chart data
  - `created_at` (timestamptz) - When the chart was created
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  - Enable Row Level Security (RLS) on all tables
  - Public access for reading charts (anyone can view)
  - Public access for creating charts (no auth required for demo)
  - No update or delete policies (charts are immutable once created)

  ## Notes
  - Charts are stored as JSONB for flexibility with the complex nested structure
  - No authentication required for this demo application
  - All chart data is public and viewable by anyone
*/

-- Create kundli_charts table
CREATE TABLE IF NOT EXISTS kundli_charts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  birth_datetime timestamptz NOT NULL,
  latitude numeric(9, 6) NOT NULL,
  longitude numeric(9, 6) NOT NULL,
  utc_offset text NOT NULL,
  lagna_chart jsonb,
  navamsa_chart jsonb,
  moon_chart jsonb,
  transit_chart jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE kundli_charts ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read charts
CREATE POLICY "Anyone can view charts"
  ON kundli_charts
  FOR SELECT
  USING (true);

-- Allow anyone to create charts
CREATE POLICY "Anyone can create charts"
  ON kundli_charts
  FOR INSERT
  WITH CHECK (true);

-- Create index for faster queries by name
CREATE INDEX IF NOT EXISTS idx_kundli_charts_name ON kundli_charts(name);

-- Create index for faster queries by creation date
CREATE INDEX IF NOT EXISTS idx_kundli_charts_created_at ON kundli_charts(created_at DESC);
