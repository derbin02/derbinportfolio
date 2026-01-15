-- Derbin Portfolio Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  thumbnail_url TEXT,
  description TEXT,
  case_study JSONB,
  is_featured BOOLEAN DEFAULT false,
  order_index INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contact submissions table
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(is_featured);
CREATE INDEX IF NOT EXISTS idx_contacts_created ON contacts(created_at DESC);

-- Row Level Security (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Projects policies: Anyone can read, only authenticated users can modify
CREATE POLICY "Projects are viewable by everyone"
  ON projects FOR SELECT
  USING (true);

CREATE POLICY "Projects are insertable by authenticated users"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Projects are updatable by authenticated users"
  ON projects FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Projects are deletable by authenticated users"
  ON projects FOR DELETE
  TO authenticated
  USING (true);

-- Contacts policies: Anyone can insert, only authenticated users can read
CREATE POLICY "Contacts are insertable by everyone"
  ON contacts FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Contacts are viewable by authenticated users"
  ON contacts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Contacts are updatable by authenticated users"
  ON contacts FOR UPDATE
  TO authenticated
  USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for projects updated_at
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample projects (optional)
INSERT INTO projects (title, slug, category, description, is_featured, order_index) VALUES
  ('Vibrant Education Brand Campaign', 'vibrant-education-campaign', 'Branding', 'Complete brand identity and marketing campaign for educational platform', true, 1),
  ('Pongal Vadai YouTube Channel', 'pongal-vadai-youtube', 'Video', 'Thumbnail design and video editing for popular food content channel', true, 2),
  ('Raja Studio Print Collection', 'raja-studio-print', 'Print', 'Wedding albums, invitations, and event collateral designs', false, 3)
ON CONFLICT (slug) DO NOTHING;
