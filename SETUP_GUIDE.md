# Quick Setup Guide for Mountain Explorer with Supabase

## Current Status ✅

Your Mountain Explorer application is now set up with:
- ✅ Next.js 15 with TypeScript
- ✅ Supabase client configuration
- ✅ Custom React hooks for data fetching
- ✅ Authentication system
- ✅ Complete database schema
- ✅ Beautiful UI with Tailwind CSS and shadcn/ui
- ✅ Development server running on http://localhost:3001

## Next Steps to Complete Setup

### 1. Set Up Your Supabase Project (Required)

1. **Create Supabase Account**:
   - Go to [supabase.com](https://supabase.com)
   - Sign up for a free account
   - Create a new project

2. **Get Your Credentials**:
   - In your Supabase dashboard, go to Settings > API
   - Copy your `Project URL` and `anon public` key

3. **Update Environment Variables**:
   - Open `.env.local` in your project
   - Replace the placeholder values:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_actual_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key
   ```

4. **Run Database Migration**:
   - In Supabase dashboard, go to SQL Editor
   - Copy the entire contents of `supabase-migration.sql`
   - Paste and run it to create all tables and sample data

### 2. Test the Application

Once you've completed the Supabase setup:

1. **Restart the development server**:
   ```bash
   # Stop the current server (Ctrl+C)
   # Then restart:
   npm run dev
   ```

2. **Visit the application**:
   - Open http://localhost:3001
   - You should see the Mountain Explorer interface
   - Try switching between tabs (Peaks, Trails, Stories, Expeditions)
   - Test the search functionality

### 3. Verify Database Connection

After setting up Supabase, you should see:
- Sample mountain peaks (Everest, K2, etc.)
- Sample trails (Everest Base Camp Trek, Annapurna Circuit)
- Real-time search working across all content
- User authentication ready (Sign In button in header)

## What's Included

### Database Schema
- **8 main tables** with relationships
- **Row Level Security (RLS)** policies
- **Sample data** for testing
- **Automatic triggers** for timestamps and user management

### Features Ready to Use
- **Browse Peaks**: View mountain peaks with elevation and difficulty
- **Explore Trails**: See hiking trails with distance and duration
- **Read Stories**: Adventure stories from the community
- **Join Expeditions**: Group adventures and expeditions
- **Search Everything**: Real-time search across all content
- **User Authentication**: Sign up, sign in, profile management

### Custom Hooks
- `usePeaks()`, `useTrails()`, `useStories()`, `useExpeditions()`
- `useSearch(query)` for real-time search
- `useAuth()` for authentication management

## Troubleshooting

### If you see "Loading..." indefinitely:
- Check that your Supabase URL and key are correct in `.env.local`
- Ensure you've run the database migration
- Check the browser console for any errors

### If authentication doesn't work:
- Verify your Supabase project has authentication enabled
- Check that the `profiles` table was created by the migration

### If search doesn't work:
- Ensure you have sample data in your database
- Check that RLS policies allow reading from tables

## Next Development Steps

Once everything is working, you can:

1. **Add Authentication UI**: Create sign-up/sign-in forms
2. **Add Create/Edit Forms**: Allow users to add new peaks, trails, stories
3. **Implement Image Upload**: Use Supabase Storage for photos
4. **Add Real-time Features**: Live updates when data changes
5. **Create User Profiles**: Personal dashboards and progress tracking
6. **Add Maps Integration**: Show peaks and trails on interactive maps

## Need Help?

- Check the main `README.md` for detailed documentation
- Review the Supabase documentation at [supabase.com/docs](https://supabase.com/docs)
- Look at the sample data in `supabase-migration.sql` for examples

Your Mountain Explorer application is ready to go! 🏔️
