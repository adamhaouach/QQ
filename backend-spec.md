
# PadelClub Backend Specification

## Architecture
- **Environment:** Node.js + Express
- **Database:** PostgreSQL (with Prisma or Supabase)
- **Auth:** JWT with HTTP-only cookies

## Database Schema (SQL)
```sql
CREATE TYPE user_role AS ENUM ('guest', 'player', 'coach', 'admin');
CREATE TYPE skill_level AS ENUM ('Beginner', 'Intermediate', 'Advanced', 'Pro');

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role user_role DEFAULT 'player',
    skill_level skill_level DEFAULT 'Beginner',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE courts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50),
    price DECIMAL(10,2) NOT NULL,
    image_url TEXT
);

CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    court_id UUID REFERENCES courts(id),
    booking_date DATE NOT NULL,
    time_slot VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'Confirmed',
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(court_id, booking_date, time_slot)
);
```

## API Routes
- `POST /api/auth/register` - Create user
- `POST /api/auth/login` - Authenticate & Set Cookie
- `GET /api/courts` - List available courts
- `GET /api/bookings` - Get user's bookings (JWT protected)
- `POST /api/bookings` - Create reservation (Validation required)
- `DELETE /api/bookings/:id` - Cancel reservation (Authorization required)
- `GET /api/admin/stats` - Cluster metrics (Admin only)
