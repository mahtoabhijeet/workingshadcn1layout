# Supabase Backend Management Guide

This guide will walk you through setting up and managing the Supabase backend for your project, transitioning from placeholder data to a live database, and connecting your frontend components to it. This guide is designed for beginners with no prior database experience.

## 1. Setting Up Your Supabase Project

Supabase is an open-source Firebase alternative that provides a powerful backend-as-a-service.

### 1.1. Create a Supabase Account and Project

1.  **Sign Up**: Go to [supabase.com](https://supabase.com/) and sign up for a free account.
2.  **Create a New Project**: Once logged in, click on "New project" in your dashboard.
    *   Give your project a name (e.g., `mountain-explorer-backend`).
    *   Choose a region close to your users for better performance.
    *   Set a database password. **Keep this password secure!** You'll need it later.
3.  **Project Dashboard**: After creation, you'll be taken to your project's dashboard.

### 1.2. Get Your Supabase URL and Anon Key

You'll need these credentials to connect your frontend application to your Supabase project.

1.  **Project Settings**: In your Supabase project dashboard, navigate to "Project Settings" (usually a gear icon).
2.  **API**: Under "Project Settings", find the "API" section.
3.  **URL and `anon` Key**: You will see your "Project URL" (e.g., `https://your-project-ref.supabase.co`) and your "Public anon key". Copy both of these. The `anon` key is safe to expose in your frontend code.

### 1.3. Configure Environment Variables Locally

To keep your Supabase credentials secure, you should store them in environment variables.

1.  **Create `.env.local`**: In the root directory of your project (`/Users/abhijeetmahto/mountainexplorer`), create a file named `.env.local`.
2.  **Add Credentials**: Add the following lines to `.env.local`, replacing the placeholders with your actual Supabase URL and anon key:

    ```env
    NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
    NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
    ```
    *   **Note**: The `NEXT_PUBLIC_` prefix is important for Next.js applications, as it makes these variables available on the client-side.

3.  **Add to `.gitignore`**: Ensure `.env.local` is added to your `.gitignore` file to prevent accidentally committing your secrets. If it's not already there, add a new line:
    ```
    .env.local
    ```

## 2. Creating Your Database Schema

Your database needs tables to store information like treks, waypoints, and media. We'll use the provided SQL files to set this up.

### 2.1. Understanding the Schema

The project includes `db-schema.sql` and `supabase-migration.sql`. These files contain SQL commands to create the necessary tables and relationships. For example, you'll likely have tables for:
*   `treks`: Stores information about each trek (name, difficulty, details, etc.).
*   `waypoints`: Stores details for each waypoint within a trek (name, description, coordinates, media).
*   `media`: Stores information about photos, videos, and notes associated with waypoints.

### 2.2. Applying the Schema to Supabase

1.  **Navigate to SQL Editor**: In your Supabase project dashboard, go to "SQL Editor".
2.  **Create New Query**: Click on "New query".
3.  **Paste SQL**: Open `db-schema.sql` (or `supabase-migration.sql`) from your project files, copy its entire content, and paste it into the Supabase SQL editor.
4.  **Run Query**: Click the "Run" button. Supabase will execute the SQL commands and create your tables.
5.  **Verify Tables**: Go to the "Table Editor" section in Supabase to see your newly created tables and their structure.

## 3. Connecting Frontend to Supabase

We'll use the Supabase client library, which is already set up in `src/lib/supabase.ts`, to interact with your database.

### 3.1. Supabase Client Setup (`src/lib/supabase.ts`)

This file likely contains code similar to this:

```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key must be provided via environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```
This code initializes the Supabase client using your environment variables.

### 3.2. Using the Supabase Client for Data Fetching

You can fetch data using the `supabase.from('table_name').select('*')` method.

-   `supabase.from('treks').select('*')`: Fetches all columns from the `treks` table.
-   `supabase.from('treks').select('*, waypoints(*)')`: Fetches all columns from `treks` and also related `waypoints` (if you have set up foreign key relationships in your schema).

## 4. Example: Moving from Placeholder Data to Real Data

Let's modify the `MapBottomDrawer` and `WaypointNavigatorPanel` to fetch data from Supabase.

### 4.1. Fetching a Single Trek and its Waypoints

We'll create a function to fetch a specific trek and its associated waypoints.

**Modify `src/lib/data.ts` (Optional but Recommended):**
It's good practice to have your data interfaces match your database schema. If your Supabase tables have slightly different structures, you might adjust these interfaces. For now, we'll assume they are compatible.

**Create a data fetching function:**
You can create a new file, e.g., `src/lib/api.ts`, or add this function to an existing utility file.

```typescript
// src/lib/api.ts (or similar)
import { supabase } from '@/lib/supabase';
import { Trek, Waypoint, Media } from '@/lib/data'; // Ensure these types are accurate

export const getTrekById = async (trekId: string): Promise<Trek | null> => {
  try {
    // Fetch trek details
    const { data: trekData, error: trekError } = await supabase
      .from('treks')
      .select('*, details(*), interactive(*), waypoints(*)') // Adjust select based on your schema
      .eq('id', trekId)
      .single(); // Use single() if you expect only one result

    if (trekError) throw trekError;
    if (!trekData) return null;

    // Supabase might return data in a different structure, you might need to map it
    // to your frontend `Trek` interface. For example, if 'details' is a JSONB column.
    // Let's assume for now the structure is directly mappable or you'll map it.

    // Example mapping if 'details' and 'interactive' are JSONB columns:
    const mappedTrek: Trek = {
      id: trekData.id,
      name: trekData.name,
      difficulty: trekData.difficulty,
      coordinates: trekData.coordinates,
      details: {
        duration: trekData.details?.duration || '',
        distance: trekData.details?.distance || '',
        elevation: trekData.details?.elevation || '',
        bestSeason: trekData.details?.bestSeason || '',
        startingPoint: trekData.details?.startingPoint || '',
        permitsRequired: trekData.details?.permitsRequired || false,
        emergencyContact: trekData.details?.emergencyContact || '',
      },
      interactive: {
        photoGallery: trekData.interactive?.photoGallery || [],
        weatherForecast: trekData.interactive?.weatherForecast || { temperature: { min: 0, max: 0, unit: 'C' }, conditions: '', windSpeed: { value: 0, unit: '' }, precipitation: { chance: 0, unit: '' } },
        bookingLinks: trekData.interactive?.bookingLinks || [],
        similarTreks: trekData.interactive?.similarTreks || [],
        reviews: trekData.interactive?.reviews || [],
      },
      waypoints: trekData.waypoints ? trekData.waypoints.map((wp: any) => ({ // Assuming waypoints are fetched as an array
        id: wp.id,
        name: wp.name,
        description: wp.description,
        coordinates: wp.coordinates,
        media: {
          photos: wp.media?.photos || [], // Assuming media is a JSONB column with photos, videos, notes
          videos: wp.media?.videos || [],
          notes: wp.media?.notes || [],
        },
      })) : [],
    };

    return mappedTrek;

  } catch (error) {
    console.error('Error fetching trek:', error);
    return null;
  }
};
```
*   **Note**: You'll need to adjust the `.select()` query and the data mapping based on your actual Supabase table structure and column names. The example assumes `details` and `interactive` are JSONB columns, and `waypoints` are fetched via a relationship. If `waypoints` are in a separate table, you'd need a separate query or a more advanced Supabase `select` with joins.

### 4.2. Modifying `MapBottomDrawer` to Fetch Data

Now, let's update `MapBottomDrawer` to fetch the trek data when it's opened.

1.  **Add State for Trek Data**: Use `useState` to store the fetched trek data and a loading state.
2.  **Use `useEffect`**: Fetch the data when the component mounts or when `isOpen` or `trekId` changes.
3.  **Pass Fetched Data**: Pass the fetched trek data to `WaypointNavigatorPanel`.

```typescript
// src/components/MapBottomDrawer.tsx (Modified)
"use client";

import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import { Trek } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import WaypointNavigatorPanel from './WaypointNavigatorPanel';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import { getTrekById } from '@/lib/api'; // Import your data fetching function

interface MapBottomDrawerProps {
  isOpen: boolean;
  trekId: string | null; // Accept trekId instead of the whole trek object
  onClose: () => void;
  onTrekSelect: (trek: Trek) => void; // For similar treks
}

export default function MapBottomDrawer({ isOpen, trekId, onClose }: MapBottomDrawerProps) {
  const [trek, setTrek] = useState<Trek | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && trekId) {
      const fetchTrekData = async () => {
        setIsLoading(true);
        setError(null);
        const fetchedTrek = await getTrekById(trekId);
        if (fetchedTrek) {
          setTrek(fetchedTrek);
        } else {
          setError('Failed to load trek data.');
        }
        setIsLoading(false);
      };
      fetchTrekData();
    } else {
      // Reset state when modal is closed or no trekId is provided
      setTrek(null);
      setError(null);
    }
  }, [isOpen, trekId]); // Re-fetch if isOpen or trekId changes

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent
        className="sm:max-w-screen-lg max-h-[80vh] overflow-y-auto"
        onInteractOutside={onClose}
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>{trek?.name || 'Trek Details'}</DialogTitle>
          <DialogDescription>
            Explore waypoint details and progress for the selected trek.
          </DialogDescription>
          <DialogClose asChild>
            <Button variant="ghost" size="icon" onClick={onClose} className="absolute right-4 top-4">
              <X className="w-5 h-5" />
            </Button>
          </DialogClose>
        </DialogHeader>

        {isLoading && <p>Loading trek data...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!isLoading && !error && trek && <WaypointNavigatorPanel trek={trek} />}
        {!isLoading && !error && !trek && isOpen && trekId && <p>No trek data found.</p>}
      </DialogContent>
    </Dialog>
  );
}
```

**Important Changes:**
*   The `MapBottomDrawerProps` now accepts `trekId: string | null` instead of `trek: Trek | null`.
*   `useState` hooks are added for `trek`, `isLoading`, and `error`.
*   `useEffect` is used to call `getTrekById` when the modal opens and a `trekId` is available.
*   Loading and error states are displayed.
*   `WaypointNavigatorPanel` is rendered only when `trek` data is successfully loaded.

### 4.3. Updating the Parent Component (e.g., `src/app/page.tsx`)

You'll need to modify the component that renders `MapBottomDrawer` to provide the `trekId` and manage the `isOpen` state.

```typescript
// Example: src/app/page.tsx (or wherever MapBottomDrawer is used)
import MapBottomDrawer from '@/components/MapBottomDrawer';
import { Trek } from '@/lib/data'; // Import Trek type

// ... other imports

export default function HomePage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedTrekId, setSelectedTrekId] = useState<string | null>(null);

  // Function to handle opening the drawer with a specific trek
  const handleOpenDrawer = (trekId: string) => {
    setSelectedTrekId(trekId);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedTrekId(null); // Clear selected trek when closing
  };

  // Example: You might have a list of treks and a button to open the drawer
  // const treks = MOCK_ARTICLES[0].treks; // Or fetched from Supabase

  return (
    <div>
      {/* ... your map component and other page content ... */}

      {/* Example of how you might trigger the drawer */}
      {/* <button onClick={() => handleOpenDrawer('trek-1-1')}>View Jogini Waterfall Trek</button> */}

      <MapBottomDrawer
        isOpen={isDrawerOpen}
        trekId={selectedTrekId}
        onClose={handleCloseDrawer}
        onTrekSelect={(trek: Trek) => { /* handle selecting a similar trek if needed */ }}
      />
    </div>
  );
}
```

By following these steps, you'll have a functional backend with Supabase, and your frontend components will be dynamically fetching and displaying real data.
