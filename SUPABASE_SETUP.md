# Student Association App - Database Setup Guide

This guide will help you set up the Supabase database for the Student Association App.

## Prerequisites

1. Create a Supabase account at [https://supabase.com](https://supabase.com)
2. Create a new Supabase project
3. Get your project URL and anon key from Project Settings > API

## Environment Setup

Create a `.env` file in the root directory with:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
```

## Database Tables

Run the following SQL in your Supabase SQL Editor to create the required tables:

### 1. Profiles Table

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  bio TEXT,
  year_group INTEGER,
  phone TEXT,
  student_id TEXT,
  major TEXT,
  linkedin_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create index for better performance
CREATE INDEX profiles_email_idx ON profiles(email);
CREATE INDEX profiles_year_group_idx ON profiles(year_group);
```

### 2. Uploads Table

```sql
-- Create uploads table
CREATE TABLE uploads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  file_type TEXT,
  folder_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE uploads ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own uploads"
  ON uploads FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own uploads"
  ON uploads FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own uploads"
  ON uploads FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX uploads_user_id_idx ON uploads(user_id);
CREATE INDEX uploads_folder_name_idx ON uploads(folder_name);
CREATE INDEX uploads_created_at_idx ON uploads(created_at DESC);
```

## Storage Bucket

Create a storage bucket for file uploads:

1. Go to Storage in your Supabase dashboard
2. Click "Create a new bucket"
3. Name it: `uploads`
4. Set it to **Public** (or Private if you want to control access)
5. Click "Create bucket"

### Storage Policies

Run this SQL to set up storage policies:

```sql
-- Allow users to upload files to their own folder
CREATE POLICY "Users can upload to their own folder"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'uploads' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow users to read files from their own folder
CREATE POLICY "Users can read their own files"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'uploads' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow users to delete files from their own folder
CREATE POLICY "Users can delete their own files"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'uploads' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );
```

## Optional: Database Functions

### Function to update updated_at timestamp

```sql
-- Create function to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for profiles table
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

## Verification

After running all the SQL commands, verify your setup:

1. Check that both tables exist in the Table Editor
2. Check that the storage bucket "uploads" exists
3. Try signing up a new user in your app
4. Try uploading a file

## Troubleshooting

- **Authentication errors**: Make sure your SUPABASE_URL and SUPABASE_KEY are correct
- **Permission errors**: Verify that Row Level Security policies are properly set up
- **Upload errors**: Check that the storage bucket exists and has the correct policies
- **Database errors**: Make sure all tables and indexes were created successfully

## Next Steps

1. Install dependencies: `npm install`
2. Run the development server: `npm run dev`
3. Visit http://localhost:3000
4. Sign up and start using the app!
