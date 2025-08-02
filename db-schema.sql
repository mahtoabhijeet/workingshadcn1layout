-- Profiles table
CREATE TABLE profiles (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Peaks table
CREATE TABLE peaks (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    elevation INTEGER NOT NULL, -- in meters
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    difficulty TEXT CHECK(difficulty IN ('easy', 'moderate', 'hard', 'extreme')) NOT NULL,
    description TEXT,
    image_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Trails table
CREATE TABLE trails (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    distance REAL NOT NULL, -- in kilometers
    duration INTEGER NOT NULL, -- in minutes
    difficulty TEXT CHECK(difficulty IN ('easy', 'moderate', 'hard', 'extreme')) NOT NULL,
    peak_id TEXT REFERENCES peaks(id) ON DELETE SET NULL,
    description TEXT,
    start_latitude REAL NOT NULL,
    start_longitude REAL NOT NULL,
    end_latitude REAL NOT NULL,
    end_longitude REAL NOT NULL,
    elevation_gain INTEGER NOT NULL, -- in meters
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Stories table
CREATE TABLE stories (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author_id TEXT REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    peak_id TEXT REFERENCES peaks(id) ON DELETE SET NULL,
    trail_id TEXT REFERENCES trails(id) ON DELETE SET NULL,
    latitude REAL,
    longitude REAL,
    featured_image TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Expeditions table
CREATE TABLE expeditions (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    organizer_id TEXT REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    max_participants INTEGER NOT NULL DEFAULT 10,
    current_participants INTEGER NOT NULL DEFAULT 0,
    difficulty TEXT CHECK(difficulty IN ('easy', 'moderate', 'hard', 'extreme')) NOT NULL,
    status TEXT CHECK(status IN ('planning', 'active', 'completed', 'cancelled')) NOT NULL DEFAULT 'planning',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_dates CHECK (end_date >= start_date),
    CONSTRAINT valid_participants CHECK (current_participants <= max_participants)
);

-- User completed peaks
CREATE TABLE user_peaks (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    peak_id TEXT REFERENCES peaks(id) ON DELETE CASCADE NOT NULL,
    completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    UNIQUE(user_id, peak_id)
);

-- User completed trails
CREATE TABLE user_trails (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    trail_id TEXT REFERENCES trails(id) ON DELETE CASCADE NOT NULL,
    completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    duration_minutes INTEGER, -- actual time taken
    notes TEXT,
    UNIQUE(user_id, trail_id)
);

-- Expedition participants
CREATE TABLE expedition_participants (
    id TEXT PRIMARY KEY,
    expedition_id TEXT REFERENCES expeditions(id) ON DELETE CASCADE NOT NULL,
    user_id TEXT REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
    UNIQUE(expedition_id, user_id)
);

-- Story images
CREATE TABLE story_images (
    id TEXT PRIMARY KEY,
    story_id TEXT REFERENCES stories(id) ON DELETE CASCADE NOT NULL,
    image_url TEXT NOT NULL,
    caption TEXT,
    order_index INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Overpass Queries table
CREATE TABLE overpass_queries (
    id TEXT PRIMARY KEY,
    query_text TEXT NOT NULL,
    geojson_result TEXT NOT NULL, -- Store GeoJSON as text
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_peaks_location ON peaks(latitude, longitude);
CREATE INDEX idx_trails_location ON trails(start_latitude, start_longitude);
CREATE INDEX idx_trails_peak ON trails(peak_id);
CREATE INDEX idx_stories_author ON stories(author_id);
CREATE INDEX idx_stories_peak ON stories(peak_id);
CREATE INDEX idx_stories_trail ON stories(trail_id);
CREATE INDEX idx_stories_location ON stories(latitude, longitude);
CREATE INDEX idx_expeditions_organizer ON expeditions(organizer_id);
CREATE INDEX idx_expeditions_dates ON expeditions(start_date, end_date);
CREATE INDEX idx_user_peaks_user ON user_peaks(user_id);
CREATE INDEX idx_user_trails_user ON user_trails(user_id);
CREATE INDEX idx_expedition_participants_expedition ON expedition_participants(expedition_id);
CREATE INDEX idx_expedition_participants_user ON expedition_participants(user_id);
CREATE INDEX idx_overpass_queries_created_at ON overpass_queries(created_at);

-- Insert some sample data
INSERT INTO peaks (id, name, elevation, latitude, longitude, difficulty, description) VALUES
('a3d4e5f6-7b8c-9d0e-1a2b-3c4d5e6f7g8h', 'Mount Everest', 8849, 27.98805556, 86.92527778, 'extreme', 'The highest mountain in the world, located in the Himalayas.'),
('b4e5f6g7-8c9d-0e1a-2b3c-4d5e6f7g8h9i', 'K2', 8611, 35.8825, 76.5133, 'extreme', 'The second-highest mountain in the world, known as the Savage Mountain.'),
('c5f6g7h8-9d0e-1a2b-3c4d-5e6f7g8h9i0j', 'Kangchenjunga', 8586, 27.7025, 88.1475, 'extreme', 'The third-highest mountain in the world, located on the border between Nepal and India.'),
('d6g7h8i9-0e1a-2b3c-4d5e-6f7g8h9i0j1k', 'Annapurna I', 8091, 28.5956, 83.8203, 'hard', 'The tenth-highest mountain in the world, known for its challenging climbing conditions.');

INSERT INTO trails (id, name, distance, duration, difficulty, peak_id, description, start_latitude, start_longitude, end_latitude, end_longitude, elevation_gain) VALUES
('e7h8i9j0-1a2b-3c4d-5e6f-7g8h9i0j1k2l', 'Everest Base Camp Trek', 130.0, 12960, 'moderate', 'a3d4e5f6-7b8c-9d0e-1a2b-3c4d5e6f7g8h', 'Classic trek to Everest Base Camp through the Khumbu Valley.', 27.7172, 86.7320, 28.0018, 86.8523, 2540),
('f8i9j0k1-2b3c-4d5e-6f7g-8h9i0j1k2l3m', 'Annapurna Circuit', 230.0, 15840, 'moderate', 'd6g7h8i9-0e1a-2b3c-4d5e-6f7g8h9i0j1k', 'One of the most popular trekking routes in the Himalayas.', 28.2096, 84.1026, 28.7967, 83.9203, 5416);
