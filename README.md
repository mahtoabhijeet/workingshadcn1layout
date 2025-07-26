# Mountain Explorer - Supabase Integration

A Next.js application for exploring mountain peaks, trails, stories, and expeditions with Supabase as the backend and database.

## Features

- **Mountain Peaks**: Browse and search mountain peaks with elevation, difficulty, and location data
- **Hiking Trails**: Discover trails with distance, duration, elevation gain, and difficulty ratings
- **Adventure Stories**: Read and share climbing and hiking experiences
- **Expeditions**: Plan and join group expeditions with other mountaineers
- **Real-time Search**: Search across all content types with instant results
- **User Authentication**: Secure user registration and login with Supabase Auth
- **Responsive Design**: Beautiful UI built with Tailwind CSS and shadcn/ui components

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Supabase (PostgreSQL database, Authentication, Real-time subscriptions)
- **Styling**: Tailwind CSS, shadcn/ui components
- **State Management**: React hooks with custom Supabase hooks

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase account and project

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd mountain-explorer
npm install
```

### 2. Supabase Setup

1. **Create a Supabase Project**:
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Wait for the project to be set up

2. **Get Your Project Credentials**:
   - Go to Project Settings > API
   - Copy your `Project URL` and `anon public` key

3. **Set Up Environment Variables**:
   ```bash
   cp .env.local.example .env.local
   ```
   
   Update `.env.local` with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

4. **Run Database Migration**:
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Copy and paste the contents of `supabase-migration.sql`
   - Run the migration to create all tables, functions, and policies

5. **Set Up Storage (Optional)**:
   - Go to Storage in your Supabase dashboard
   - Create a new bucket called `mountain-images`
   - Set it to public if you want images to be publicly accessible

### 3. Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Database Schema

The application uses the following main tables:

### Core Tables
- **profiles**: User profiles extending Supabase auth
- **peaks**: Mountain peaks with elevation, coordinates, difficulty
- **trails**: Hiking trails with distance, duration, elevation gain
- **stories**: User-generated adventure stories
- **expeditions**: Group expeditions and adventures

### Relationship Tables
- **user_peaks**: Track completed peaks per user
- **user_trails**: Track completed trails per user
- **expedition_participants**: Manage expedition memberships
- **story_images**: Multiple images per story

## Key Features

### Authentication
- Email/password authentication via Supabase Auth
- Automatic profile creation on signup
- Protected routes and user-specific content

### Real-time Data
- Live updates using Supabase real-time subscriptions
- Instant search across all content types
- Dynamic content loading with loading states

### Search Functionality
- Full-text search across peaks, trails, stories, and expeditions
- Debounced search with 300ms delay
- Search results grouped by content type

### Row Level Security (RLS)
- Comprehensive security policies for all tables
- Users can only modify their own content
- Public read access for peaks, trails, and stories
- Private user data protection

## Custom Hooks

### Data Fetching Hooks
- `usePeaks()`: Fetch all mountain peaks
- `useTrails()`: Fetch all trails with peak relationships
- `useStories()`: Fetch stories with author and location data
- `useExpeditions()`: Fetch expeditions with organizer info
- `useSearch(query)`: Search across all content types

### Authentication Hook
- `useAuth()`: Handle user authentication state
- Provides `signUp`, `signIn`, `signOut`, `resetPassword` functions
- Manages user session and loading states

## File Structure

```
mountain-explorer/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Main application page
│   │   ├── layout.tsx            # Root layout
│   │   └── globals.css           # Global styles
│   ├── components/
│   │   └── ui/                   # shadcn/ui components
│   ├── hooks/
│   │   ├── useSupabase.ts        # Data fetching hooks
│   │   └── useAuth.ts            # Authentication hook
│   └── lib/
│       ├── supabase.ts           # Supabase client configuration
│       └── utils.ts              # Utility functions
├── supabase-migration.sql        # Database schema and sample data
├── .env.local                    # Environment variables
└── README.md                     # This file
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key | Optional |

## Sample Data

The migration includes sample data for:
- 4 famous mountain peaks (Everest, K2, Kangchenjunga, Annapurna I)
- 2 popular trekking routes (Everest Base Camp, Annapurna Circuit)

## Development

### Adding New Features

1. **Database Changes**: Update `supabase-migration.sql` with new tables or columns
2. **Type Definitions**: Update the `Database` interface in `src/lib/supabase.ts`
3. **Hooks**: Create new hooks in `src/hooks/` for data fetching
4. **Components**: Add new UI components as needed

### Best Practices

- Always use Row Level Security (RLS) for new tables
- Use TypeScript for type safety
- Implement loading and error states for all data fetching
- Follow the existing code patterns for consistency

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Troubleshooting

### Common Issues

1. **Environment Variables**: Ensure all required environment variables are set
2. **Database Connection**: Verify your Supabase URL and keys are correct
3. **RLS Policies**: Check that Row Level Security policies allow the required operations
4. **CORS Issues**: Ensure your domain is added to Supabase allowed origins

### Getting Help

- Check the [Supabase Documentation](https://supabase.com/docs)
- Review the [Next.js Documentation](https://nextjs.org/docs)
- Open an issue in this repository

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
