-- Migration: Create intro_videos table
-- Run this in Supabase SQL Editor before using the Video Perkenalan CMS feature.

CREATE TABLE IF NOT EXISTS intro_videos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  show_on_home BOOLEAN DEFAULT true,
  show_on_team BOOLEAN DEFAULT true,
  is_published BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Row Level Security
ALTER TABLE intro_videos ENABLE ROW LEVEL SECURITY;

-- Public can read published intro videos
CREATE POLICY "Public read intro videos"
  ON intro_videos FOR SELECT
  USING (is_published = true);

-- Service role has full access (for admin operations)
CREATE POLICY "Service role all intro videos"
  ON intro_videos FOR ALL
  USING (auth.role() = 'service_role');

-- Index for sorted queries
CREATE INDEX IF NOT EXISTS idx_intro_videos_sort
  ON intro_videos (sort_order ASC)
  WHERE is_published = true;
