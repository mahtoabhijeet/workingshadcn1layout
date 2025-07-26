-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE difficulty_level AS ENUM ('easy', 'moderate', 'hard', 'extreme');
CREATE TYPE expedition_status AS ENUM ('planning', 'active', 'completed', 'cancelled');

-- Create profiles table (extends auth.users)
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create peaks table
CREATE TABLE peaks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    elevation INTEGER NOT NULL, -- in meters
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    difficulty difficulty_level NOT NULL,
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trails table
CREATE TABLE trails (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    distance DECIMAL(8, 2) NOT NULL, -- in kilometers
    duration INTEGER NOT NULL, -- in minutes
    difficulty difficulty_level NOT NULL,
    peak_id UUID REFERENCES peaks(id) ON DELETE SET NULL,
    description TEXT,
    start_latitude DECIMAL(10, 8) NOT NULL,
    start_longitude DECIMAL(11, 8) NOT NULL,
    end_latitude DECIMAL(10, 8) NOT NULL,
    end_longitude DECIMAL(11, 8) NOT NULL,
    elevation_gain INTEGER NOT NULL, -- in meters
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create stories table
CREATE TABLE stories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    peak_id UUID REFERENCES peaks(id) ON DELETE SET NULL,
    trail_id UUID REFERENCES trails(id) ON DELETE SET NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    featured_image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create expeditions table
CREATE TABLE expeditions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    organizer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    max_participants INTEGER NOT NULL DEFAULT 10,
    current_participants INTEGER NOT NULL DEFAULT 0,
    difficulty difficulty_level NOT NULL,
    status expedition_status NOT NULL DEFAULT 'planning',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT valid_dates CHECK (end_date >= start_date),
    CONSTRAINT valid_participants CHECK (current_participants <= max_participants)
);

-- Create junction tables for many-to-many relationships

-- User completed peaks
CREATE TABLE user_peaks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    peak_id UUID REFERENCES peaks(id) ON DELETE CASCADE NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT,
    UNIQUE(user_id, peak_id)
);

-- User completed trails
CREATE TABLE user_trails (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    trail_id UUID REFERENCES trails(id) ON DELETE CASCADE NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    duration_minutes INTEGER, -- actual time taken
    notes TEXT,
    UNIQUE(user_id, trail_id)
);

-- Expedition participants
CREATE TABLE expedition_participants (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    expedition_id UUID REFERENCES expeditions(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
    UNIQUE(expedition_id, user_id)
);

-- Story images (for multiple images per story)
CREATE TABLE story_images (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    story_id UUID REFERENCES stories(id) ON DELETE CASCADE NOT NULL,
    image_url TEXT NOT NULL,
    caption TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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

-- Create functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_peaks_updated_at BEFORE UPDATE ON peaks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_trails_updated_at BEFORE UPDATE ON trails FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_stories_updated_at BEFORE UPDATE ON stories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_expeditions_updated_at BEFORE UPDATE ON expeditions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update expedition participant count
CREATE OR REPLACE FUNCTION update_expedition_participant_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE expeditions 
        SET current_participants = current_participants + 1 
        WHERE id = NEW.expedition_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE expeditions 
        SET current_participants = current_participants - 1 
        WHERE id = OLD.expedition_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update participant count
CREATE TRIGGER expedition_participant_count_trigger
    AFTER INSERT OR DELETE ON expedition_participants
    FOR EACH ROW EXECUTE FUNCTION update_expedition_participant_count();

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE peaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE trails ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE expeditions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_peaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_trails ENABLE ROW LEVEL SECURITY;
ALTER TABLE expedition_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_images ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Peaks policies (read-only for now, admin can manage via dashboard)
CREATE POLICY "Peaks are viewable by everyone" ON peaks FOR SELECT USING (true);

-- Trails policies (read-only for now, admin can manage via dashboard)
CREATE POLICY "Trails are viewable by everyone" ON trails FOR SELECT USING (true);

-- Stories policies
CREATE POLICY "Stories are viewable by everyone" ON stories FOR SELECT USING (true);
CREATE POLICY "Users can insert their own stories" ON stories FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update their own stories" ON stories FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Users can delete their own stories" ON stories FOR DELETE USING (auth.uid() = author_id);

-- Expeditions policies
CREATE POLICY "Expeditions are viewable by everyone" ON expeditions FOR SELECT USING (true);
CREATE POLICY "Users can create expeditions" ON expeditions FOR INSERT WITH CHECK (auth.uid() = organizer_id);
CREATE POLICY "Organizers can update their expeditions" ON expeditions FOR UPDATE USING (auth.uid() = organizer_id);
CREATE POLICY "Organizers can delete their expeditions" ON expeditions FOR DELETE USING (auth.uid() = organizer_id);

-- User peaks policies
CREATE POLICY "Users can view their own completed peaks" ON user_peaks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own peak completions" ON user_peaks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own peak completions" ON user_peaks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own peak completions" ON user_peaks FOR DELETE USING (auth.uid() = user_id);

-- User trails policies
CREATE POLICY "Users can view their own completed trails" ON user_trails FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own trail completions" ON user_trails FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own trail completions" ON user_trails FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own trail completions" ON user_trails FOR DELETE USING (auth.uid() = user_id);

-- Expedition participants policies
CREATE POLICY "Expedition participants are viewable by everyone" ON expedition_participants FOR SELECT USING (true);
CREATE POLICY "Users can join expeditions" ON expedition_participants FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can leave expeditions" ON expedition_participants FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Organizers can manage participants" ON expedition_participants FOR ALL USING (
    auth.uid() IN (SELECT organizer_id FROM expeditions WHERE id = expedition_id)
);

-- Story images policies
CREATE POLICY "Story images are viewable by everyone" ON story_images FOR SELECT USING (true);
CREATE POLICY "Story authors can manage their story images" ON story_images FOR ALL USING (
    auth.uid() IN (SELECT author_id FROM stories WHERE id = story_id)
);

-- Insert some sample data
INSERT INTO peaks (name, elevation, latitude, longitude, difficulty, description) VALUES
('Mount Everest', 8849, 27.98805556, 86.92527778, 'extreme', 'The highest mountain in the world, located in the Himalayas.'),
('K2', 8611, 35.8825, 76.5133, 'extreme', 'The second-highest mountain in the world, known as the Savage Mountain.'),
('Kangchenjunga', 8586, 27.7025, 88.1475, 'extreme', 'The third-highest mountain in the world, located on the border between Nepal and India.'),
('Annapurna I', 8091, 28.5956, 83.8203, 'hard', 'The tenth-highest mountain in the world, known for its challenging climbing conditions.');

INSERT INTO trails (name, distance, duration, difficulty, peak_id, description, start_latitude, start_longitude, end_latitude, end_longitude, elevation_gain) VALUES
('Everest Base Camp Trek', 130.0, 12960, 'moderate', (SELECT id FROM peaks WHERE name = 'Mount Everest'), 'Classic trek to Everest Base Camp through the Khumbu Valley.', 27.7172, 86.7320, 28.0018, 86.8523, 2540),
('Annapurna Circuit', 230.0, 15840, 'moderate', (SELECT id FROM peaks WHERE name = 'Annapurna I'), 'One of the most popular trekking routes in the Himalayas.', 28.2096, 84.1026, 28.7967, 83.9203, 5416);

-- Create storage bucket for images (run this in Supabase dashboard)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('mountain-images', 'mountain-images', true);

-- Storage policies (uncomment and run in Supabase dashboard after creating bucket)
-- CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'mountain-images');
-- CREATE POLICY "Authenticated users can upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'mountain-images' AND auth.role() = 'authenticated');
-- CREATE POLICY "Users can update their own images" ON storage.objects FOR UPDATE USING (bucket_id = 'mountain-images' AND auth.uid()::text = (storage.foldername(name))[1]);
-- CREATE POLICY "Users can delete their own images" ON storage.objects FOR DELETE USING (bucket_id = 'mountain-images' AND auth.uid()::text = (storage.foldername(name))[1]);
