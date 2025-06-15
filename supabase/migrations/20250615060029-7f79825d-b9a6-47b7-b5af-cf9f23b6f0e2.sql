
-- Ensure the favorite column exists in the notes table
ALTER TABLE public.notes ADD COLUMN IF NOT EXISTS favorite boolean DEFAULT false;
