# Mountain Explorer Application Overview

This document provides a concise yet detailed overview of the Mountain Explorer application, designed to serve as a context provider for an LLM working on project changes. It covers folder structure, core logic, state management, styling, and key components.

## 1. Introduction

Mountain Explorer is a Next.js application designed to help users discover and explore mountains, trails, stories, and expeditions, primarily focused on the Himalayas. It features an interactive map, dynamic content panels, and user authentication, with data managed via Supabase.

## 2. Folder Structure

The application follows a standard Next.js project structure with additional custom directories:

*   **`/src`**: Contains the main application source code.
    *   **`/src/app`**: Next.js App Router root.
        *   `layout.tsx`: Root layout, includes `ThemeProvider` for dark/light mode.
        *   `page.tsx`: The main application page, orchestrating the sidebar, map, and dynamic content panels.
        *   `globals.css`: Global CSS styles, including Tailwind CSS imports.
    *   **`/src/collections`**: Likely for Payload CMS collections (e.g., `Users.ts`).
    *   **`/src/components`**: Reusable React components.
        *   `DynamicPanel.tsx`: Displays lists and details of articles/treks.
        *   `MapboxMap.tsx`: Integrates Mapbox GL JS for interactive maps.
        *   `AdminPanel.tsx`, `MapBottomDrawer.tsx`, `MainDrawer.tsx`, `TranslucentDrawer.tsx`, `WaypointNavigatorPanel.tsx`: Other UI components.
        *   `theme-provider.tsx`: Context provider for theme management.
        *   `ui/`: Shadcn UI components (e.g., `button.tsx`, `input.tsx`, `card.tsx`, `dialog.tsx`, etc.).
    *   **`/src/hooks`**: Custom React hooks for logic encapsulation.
        *   `useAuth.ts`: Handles user authentication logic with Supabase.
        *   `useSupabase.ts`: Provides various data fetching hooks for Supabase tables (peaks, trails, stories, expeditions).
        *   `useOverpassQueries.ts`: (Not reviewed, but likely for OpenStreetMap Overpass API queries).
    *   **`/src/lib`**: Utility functions and configurations.
        *   `data.ts`: Defines data interfaces (Article, Trek, Waypoint, etc.) and mock data (`MOCK_ARTICLES`).
        *   `supabase.ts`: Supabase client initialization and database type definitions.
        *   `db.ts`, `db-init.ts`: (Likely related to database interactions, possibly for Payload CMS or direct DB access).
        *   `utils.ts`: General utility functions.
*   **`/public`**: Static assets (images, icons).
*   **Root Directory**: Configuration files (`next.config.js`, `tailwind.config.js`, `package.json`, `tsconfig.json`, `.env.local` for environment variables), database schema (`db-schema.sql`), and documentation (`SUPABASE_GUIDE.md`, `UI_GUIDE.md`, `SETUP_GUIDE.md`).

## 3. Core Technologies

*   **Next.js**: React framework for server-side rendering, routing, and API routes.
*   **React**: JavaScript library for building user interfaces.
*   **TypeScript**: Superset of JavaScript for type safety.
*   **Tailwind CSS**: Utility-first CSS framework for rapid UI development.
*   **Shadcn UI**: Reusable UI components built with Tailwind CSS and Radix UI.
*   **Supabase**: Backend-as-a-Service for database (PostgreSQL), authentication, and storage.
*   **Mapbox GL JS / React Map GL**: For interactive mapping functionalities and 3D terrain.
*   **Lucide React**: Icon library.

## 4. Data Flow and State Management

The application's data flow primarily revolves around React's `useState` and custom hooks for data fetching and authentication.

*   **Global State**: Managed within `src/app/page.tsx` for active tabs, search queries, drawer visibility, and selected treks.
*   **Supabase Integration**:
    *   `src/lib/supabase.ts`: Initializes the Supabase client using environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`). It also defines TypeScript interfaces for Supabase database tables (`Database` type).
    *   `src/hooks/useSupabase.ts`: Contains generic and specific hooks (`usePeaks`, `useTrails`, `useStories`, `useExpeditions`, `useSearch`, `useUserProgress`) that abstract data fetching from Supabase tables. These hooks manage loading, error, and data states.
    *   `src/hooks/useAuth.ts`: Manages user authentication state (`user`, `loading`) and provides functions for `signUp`, `signIn`, `signOut`, and `resetPassword` using Supabase Auth.
*   **Local Component State**: Components like `DynamicPanel` manage their own UI-specific states (e.g., `view` state for list/detail, `selectedItem`, `history` for navigation).
*   **Mock Data**: `src/lib/data.ts` provides `MOCK_ARTICLES` which includes `Trek` data. This mock data is currently used by `DynamicPanel` and `MapboxMap` for demonstration purposes. In a production environment, this would typically be replaced by data fetched from Supabase.

## 5. Key Components Overview

### `src/app/layout.tsx`

*   **Purpose**: Defines the root HTML structure and integrates global providers.
*   **Logic**: Sets up `Geist` and `Geist_Mono` fonts. Wraps the entire application with `ThemeProvider` from `@/components/theme-provider` for consistent theming (dark/light mode).
*   **State**: None directly, acts as a wrapper.
*   **Styling**: Imports `globals.css`.

### `src/app/page.tsx`

*   **Purpose**: The main dashboard/landing page, orchestrating the primary UI elements.
*   **Logic**:
    *   Manages the active tab (`activeTab`), search query (`searchQuery`), and visibility of various panels (`isDrawerOpen`, `showAdminPanel`, `isMapBottomDrawerOpen`).
    *   Fetches data for peaks, trails, stories, and expeditions using `usePeaks`, `useTrails`, `useStories`, `useExpeditions` from `useSupabase.ts`.
    *   Handles user authentication status using `useAuth.ts`.
    *   Conditionally renders a Supabase configuration message if `isSupabaseReady()` returns false.
    *   Passes `selectedTrek` and `isMapBottomDrawerOpen` to `MapboxMap` to control map behavior.
    *   Passes `activeTab` and `onTrekSelect` to `DynamicPanel`.
*   **State**: `activeTab`, `searchQuery`, `isDrawerOpen`, `showAdminPanel`, `selectedTrek`, `isMapBottomDrawerOpen`.
*   **Styling**: Uses Tailwind CSS for layout (sidebar, main content area) and responsive design.

### `src/components/DynamicPanel.tsx`

*   **Purpose**: Displays dynamic content (articles, treks) in a list or detail view.
*   **Logic**:
    *   Manages the `view` state (`'list'` or `'detail'`) and `selectedItem` (Article or Trek).
    *   Maintains a `history` array for back navigation.
    *   `handleItemClick`: Navigates to the detail view for a selected article or trek. If a trek is selected, it calls `onTrekSelect` prop to update the map.
    *   `handleBackClick`: Navigates back through the history.
    *   `renderListView`: Displays a searchable list of articles (currently using `MOCK_ARTICLES`).
    *   `renderDetailView`: Displays detailed information for a selected article or trek, including nested treks for articles.
*   **State**: `view`, `selectedItem`, `contentType`, `history`, `expandedSections`.
*   **Styling**: Uses Shadcn UI `Card`, `Button`, `Input` components and Tailwind CSS for layout and responsiveness.

### `src/components/MapboxMap.tsx`

*   **Purpose**: Renders an interactive Mapbox map with markers and 3D terrain.
*   **Logic**:
    *   Initializes Mapbox map with `react-map-gl`.
    *   Sets initial `viewState` to Manali coordinates.
    *   Includes `NavigationControl`, `FullscreenControl`, and `ScaleControl`.
    *   Displays a main marker for Manali and markers for all treks from `MOCK_ARTICLES`.
    *   Highlights the `selectedTrek` with a different marker color and shows a popup.
    *   Implements a camera rotation animation when no trek is selected.
    *   Adjusts its height based on `isBottomDrawerOpen` prop.
*   **State**: `viewState`, `showPopup`.
*   **Styling**: Uses Tailwind CSS for sizing and positioning, and Mapbox GL JS for map rendering.

### `src/lib/data.ts`

*   **Purpose**: Defines TypeScript interfaces for data structures and provides mock data.
*   **Logic**: Pure data definitions.
*   **State**: None.
*   **Styling**: None.

### `src/hooks/useSupabase.ts`

*   **Purpose**: Provides custom React hooks for interacting with the Supabase database.
*   **Logic**:
    *   `useSupabaseQuery`: A generic hook for fetching data from Supabase, handling loading and error states.
    *   Specific hooks (`usePeaks`, `useTrails`, `useStories`, `useExpeditions`, `usePeak`, `useTrail`, `useStory`, `useExpedition`): Utilize `useSupabaseQuery` to fetch data from respective tables, including joins for related data (e.g., `peak:peaks(*)`).
    *   `useSearch`: Performs a debounced search across multiple Supabase tables.
    *   `useUserProgress`: Fetches user-specific completed peaks and trails.
*   **State**: `data`, `loading`, `error` for each hook.
*   **Styling**: None.

### `src/hooks/useAuth.ts`

*   **Purpose**: Provides authentication functionalities using Supabase Auth.
*   **Logic**:
    *   Manages the `user` state and `loading` state for authentication.
    *   Listens for Supabase authentication state changes (`onAuthStateChange`).
    *   Provides `signUp`, `signIn`, `signOut`, and `resetPassword` functions.
*   **State**: `user`, `loading`.
*   **Styling**: None.

### `src/lib/supabase.ts`

*   **Purpose**: Configures and exports the Supabase client instance and defines database types.
*   **Logic**:
    *   Checks if Supabase environment variables are properly configured.
    *   Creates and exports a Supabase client instance (`supabase`).
    *   Provides `createSupabaseClient` for SSR contexts and `isSupabaseReady` for configuration checks.
    *   Defines the `Database` interface, which includes `Tables`, `Views`, `Functions`, and `Enums` for type-safe interactions with the Supabase database schema (profiles, peaks, trails, stories, expeditions).
*   **State**: None.
*   **Styling**: None.

## 6. Styling

The application uses **Tailwind CSS** for styling, often combined with **Shadcn UI** components.
*   **`src/app/globals.css`**: Imports Tailwind's base, components, and utilities, along with any custom global styles.
*   **`tailwind.config.js`**: Configures Tailwind CSS, including custom themes, colors, and plugins.
*   Components are styled using Tailwind utility classes directly in JSX, providing a highly modular and efficient styling approach.

## 7. Supabase Integration

Supabase is a critical part of the application's backend.
*   **Database**: Stores information about `profiles`, `peaks`, `trails`, `stories`, and `expeditions`. The `db-schema.sql` file defines the table structures.
*   **Authentication**: Handles user registration, login, and session management.
*   **Realtime**: Supabase's realtime capabilities could be leveraged for live updates (though not explicitly shown in the reviewed code, the `useSupabase` hooks are set up to fetch data, and could be extended for realtime subscriptions).
*   **Environment Variables**: Supabase URL and Anon Key are loaded from `.env.local` for secure configuration.

## 8. Future Work/Considerations

*   **Data Persistence**: Replace `MOCK_ARTICLES` with actual data fetched from Supabase for articles and their associated treks.
*   **User Interactions**: Implement full sign-in/sign-up flows and integrate user-specific data (e.g., completed treks, saved stories).
*   **Map Interactivity**: Enhance map interactions, such as clicking on trek markers to open their details in the `DynamicPanel`.
*   **Admin Panel Functionality**: Implement the actual features for the `AdminPanel`.
*   **Error Handling & Loading States**: Improve user feedback for loading states and errors across the application.
*   **Testing**: Add unit and integration tests for components and hooks.
