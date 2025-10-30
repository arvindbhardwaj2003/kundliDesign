# Vedic Kundli Generator - React Web Application

A modern web application for generating Vedic astrology birth charts (Kundli) with four different chart types: Lagna, Navamsa, Moon, and Transit charts.

## Features

- **Comprehensive Birth Chart Generation**: Generate complete Vedic Kundli with all four essential chart types
- **User-Friendly Interface**: Clean, intuitive form for entering birth details
- **Visual Chart Display**: Beautiful diamond-shaped chart layouts matching traditional Vedic astrology format
- **Data Persistence**: All generated charts are saved to Supabase database
- **Chart History**: View and reload previously generated charts
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Real-time Validation**: Instant feedback on form inputs

## Tech Stack

### Frontend
- **React 18** - Modern UI library
- **Vite** - Fast build tool and dev server
- **Supabase Client** - Database and API integration

### Backend
- **Supabase** - PostgreSQL database with Row Level Security
- **Edge Functions** - Serverless functions for chart calculations
- **PostgreSQL** - Reliable data storage with JSONB support

## Project Structure

```
project/
├── frontend/                    # React application
│   ├── src/
│   │   ├── components/
│   │   │   ├── BirthDataForm.jsx       # Input form component
│   │   │   ├── KundliChart.jsx         # Individual chart display
│   │   │   └── KundliDisplay.jsx       # Complete Kundli view
│   │   ├── lib/
│   │   │   └── supabase.js             # Supabase client config
│   │   ├── App.jsx                     # Main application component
│   │   ├── App.css                     # Application styles
│   │   └── index.css                   # Global styles
│   └── .env                            # Environment variables
├── supabase/
│   └── functions/
│       └── generate-kundli/            # Edge function for calculations
└── kundli.py                           # Original Python implementation

```

## Original Python Implementation

This project is based on the original Python Kundli generator (`kundli.py`) which uses:
- **AstroKundli** - Vedic astrology calculation library
- **PIL (Pillow)** - Image generation for charts

The web application reimplements the core logic in TypeScript for the Edge Function while maintaining the same astrological calculation principles.

## Database Schema

### kundli_charts table
- `id` - Unique identifier
- `name` - Person's name
- `birth_datetime` - Birth date and time
- `latitude` / `longitude` - Birth location coordinates
- `utc_offset` - Timezone offset
- `lagna_chart` - Birth/Ascendant chart (JSONB)
- `navamsa_chart` - D9 divisional chart (JSONB)
- `moon_chart` - Moon-based chart (JSONB)
- `transit_chart` - Current planetary positions (JSONB)
- `created_at` / `updated_at` - Timestamps

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- Supabase account (database already configured)

### Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Environment variables are already configured in `.env`

4. Start the development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
```

## Chart Types

### 1. Lagna Chart (Birth Chart)
The primary birth chart showing planetary positions at the time of birth based on the Ascendant (Lagna).

### 2. Navamsa Chart (D9)
The divisional chart used for analyzing marriage, partnerships, and deeper spiritual insights.

### 3. Moon Chart (Chandra Kundli)
A chart with the Moon as the first house, used for emotional and mental analysis.

### 4. Transit Chart
Shows current planetary positions, used for timing predictions and current influences.

## Astrological Calculations

The application uses Vedic Sidereal astrology calculations including:
- 12 zodiac signs (Aries through Pisces)
- 9 planets (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, Ketu)
- Ascendant (Lagna) calculations
- Navamsa divisional chart logic with movable, fixed, and dual sign classifications
- Proper degree-to-house mapping for divisional charts

## Planet Symbols

- ☉ (Su) - Sun
- ☽ (Mo) - Moon
- ♂ (Ma) - Mars
- ☿ (Me) - Mercury
- ♃ (Ju) - Jupiter
- ♀ (Ve) - Venus
- ♄ (Sa) - Saturn
- ☊ (Ra) - Rahu (North Node)
- ☋ (Ke) - Ketu (South Node)
- AC (Asc) - Ascendant

## Security

- Row Level Security (RLS) enabled on all database tables
- Public read access for viewing charts
- Public create access for generating new charts (demo mode)
- No authentication required for this demonstration version

## Future Enhancements

Potential improvements for the application:
- Integration with real astronomical calculation libraries
- User authentication and private chart storage
- PDF export functionality
- Detailed interpretations and predictions
- Dasha (planetary period) calculations
- Additional divisional charts (D2, D3, D7, etc.)
- Chart comparison tools
- Multi-language support

## License

See LICENSE file for details.

## Original Credits

Based on the KundliSidereal Python project using AstroKundli library for Vedic astrology calculations.
