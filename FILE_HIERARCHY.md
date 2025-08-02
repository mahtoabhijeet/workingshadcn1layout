# Mountain Explorer File Hierarchy and Functional Overview

This document provides an ASCII-based file hierarchy of the Mountain Explorer application, with a one-line heuristic for each file's function. It aims to clarify data flow, common UI patterns, logic patterns, database fetching patterns, and backend functions for beginners.

```
.
├── .gitignore                                  # Specifies intentionally untracked files to ignore by Git.
├── APP_OVERVIEW.md                             # Comprehensive overview of the application's architecture and components.
├── components.json                             # Configuration for Shadcn UI components.
├── db-schema.sql                               # SQL schema for the Supabase PostgreSQL database.
├── eslint.config.mjs                           # ESLint configuration for code quality and consistency.
├── next.config.js                              # Next.js configuration file.
├── next.config.ts                              # TypeScript version of Next.js configuration.
├── package-lock.json                           # Records the exact dependency tree for reproducible builds.
├── package.json                                # Defines project metadata and lists dependencies and scripts.
├── payload.config.ts                           # Configuration for Payload CMS (if used for backend content management).
├── postcss.config.mjs                          # PostCSS configuration for CSS processing (e.g., Tailwind CSS).
├── README.md                                   # Project README, typically for setup and general information.
├── SETUP_GUIDE.md                              # Guide for initial project setup and environment configuration.
├── SUPABASE_GUIDE.md                           # Specific guide for Supabase integration and setup.
├── supabase-migration.sql                      # SQL scripts for Supabase database migrations.
├── tailwind.config.js                          # Tailwind CSS configuration for custom styles and themes.
├── tsconfig.json                               # TypeScript compiler configuration for the project.
├── tsconfig.node.json                          # TypeScript configuration specific to Node.js environment.
├── UI_EDITING_GUIDE.md                         # Guide for editing and customizing UI components.
├── UI_GUIDE.md                                 # General guide for understanding the application's UI.
├── mountain-explorer/                          # (Potentially an older or nested project directory, or a module)
│   ├── src/                                    # Source code for the nested mountain-explorer module.
│   │   ├── components/                         # Reusable React components for the nested module.
│   │   │   ├── MapboxMap.tsx                   # Mapbox map component for the nested module.
│   │   │   └── TabbedBottomPanel.tsx           # Tabbed bottom panel component for the nested module.
│   │   └── hooks/                              # Custom React hooks for the nested module.
│   │       └── useSupabase.ts                  # Supabase data fetching hooks for the nested module.
├── public/                                     # Static assets served directly by Next.js.
│   ├── file.svg                                # SVG icon asset.
│   ├── globe.svg                               # SVG icon asset.
│   ├── next.svg                                # Next.js logo SVG.
│   ├── vercel.svg                              # Vercel logo SVG.
│   └── window.svg                              # SVG icon asset.
└── src/                                        # Main application source code.
    ├── app/                                    # Next.js App Router root.
    │   ├── favicon.ico                         # Favicon for the application.
    │   ├── globals.css                         # Global CSS styles, including Tailwind imports.
    │   ├── layout.tsx                          # Root layout, sets up global providers like ThemeProvider.
    │   └── page.tsx                            # Main application page, orchestrates primary UI and data flow.
    ├── collections/                            # Defines data collections, likely for Payload CMS.
    │   └── Users.ts                            # Defines the User collection schema.
    ├── components/                             # Reusable React components.
    │   ├── AdminPanel.tsx                      # Component for administrative functionalities.
    │   ├── DynamicPanel.tsx                    # Displays dynamic content (articles, treks) in list/detail views.
    │   ├── MainDrawer.tsx                      # Main navigation drawer component.
    │   ├── MapBottomDrawer.tsx                 # Drawer component appearing at the bottom of the map.
    │   ├── MapboxMap.tsx                       # Integrates Mapbox GL JS for interactive maps with markers.
    │   ├── theme-provider.tsx                  # Context provider for managing dark/light theme.
    │   ├── TranslucentDrawer.tsx               # A translucent drawer UI component.
    │   ├── WaypointNavigatorPanel.tsx          # Panel for navigating through trek waypoints.
    │   └── ui/                                 # Shadcn UI components (reusable, styled primitives).
    │       ├── alert.tsx                       # UI component for alerts.
    │       ├── avatar.tsx                      # UI component for user avatars.
    │       ├── badge.tsx                       # UI component for badges.
    │       ├── button.tsx                      # UI component for interactive buttons.
    │       ├── card.tsx                        # UI component for content cards.
    │       ├── carousel.tsx                    # UI component for image carousels.
    │       ├── dialog.tsx                      # UI component for modal dialogs.
    │       ├── drawer.tsx                      # UI component for slide-out drawers.
    │       ├── input.tsx                       # UI component for text input fields.
    │       ├── popover.tsx                     # UI component for popover elements.
    │       ├── progress.tsx                    # UI component for progress indicators.
    │       ├── select.tsx                      # UI component for dropdown selections.
    │       ├── separator.tsx                   # UI component for visual separators.
    │       ├── sheet.tsx                       # UI component for side sheets.
    │       ├── tabs.tsx                        # UI component for tabbed navigation.
    │       ├── textarea.tsx                    # UI component for multi-line text input.
    │       └── tooltip.tsx                     # UI component for tooltips.
    ├── hooks/                                  # Custom React hooks for encapsulating logic.
    │   ├── Untitled-1.md                       # (Likely a temporary or scratchpad markdown file).
    │   ├── useAuth.ts                          # Handles user authentication state and actions with Supabase.
    │   ├── useSupabase.ts                      # Provides data fetching hooks for various Supabase tables.
    │   └── useOverpassQueries.ts               # (Likely for fetching data from OpenStreetMap Overpass API).
    └── lib/                                    # Utility functions and configurations.
        ├── data.ts                             # Defines data interfaces and mock data for the application.
        ├── db-init.ts                          # (Likely for database initialization scripts).
        ├── db.ts                               # (Likely for direct database connection or ORM setup).
        ├── supabase.ts                         # Configures Supabase client and defines database types.
        └── utils.ts                            # General utility functions.
```

## Data Flow and Common Patterns

### Data Flow Overview

Data in Mountain Explorer generally flows in a unidirectional manner, primarily from Supabase (backend) through custom React hooks to the UI components. User interactions trigger state changes, which can lead to re-fetching data or updating the UI.

1.  **Backend (Supabase)**: The primary data source, storing `peaks`, `trails`, `stories`, `expeditions`, and `profiles` (users).
2.  **`src/lib/supabase.ts`**: Initializes the Supabase client and defines the `Database` TypeScript types, ensuring type safety for all database interactions. This is the foundational layer for connecting to the backend.
3.  **`src/hooks/useSupabase.ts`**: This is the **data fetching pattern hub**. It contains custom hooks (`usePeaks`, `useTrails`, `useStories`, `useExpeditions`, `useSearch`, `useUserProgress`) that abstract the logic of querying Supabase. These hooks manage `loading`, `error`, and `data` states, making data consumption in components clean and consistent.
4.  **`src/hooks/useAuth.ts`**: This is the **authentication logic pattern**. It manages the user's authentication state (`user`, `loading`) and provides functions (`signIn`, `signUp`, `signOut`) to interact with Supabase Auth.
5.  **`src/app/page.tsx`**: The **main orchestration layer**. It consumes data from `useSupabase.ts` and `useAuth.ts` hooks. It manages global UI states (e.g., `activeTab`, `isDrawerOpen`, `selectedTrek`) and passes data and state setters down to child components.
6.  **`src/components/DynamicPanel.tsx`**: A **UI pattern for dynamic content display**. It receives `activeTab` and `onTrekSelect` props from `page.tsx`. It manages its own internal UI state (`view`, `selectedItem`, `history`) to switch between list and detail views for articles/treks. It uses mock data from `src/lib/data.ts` but is designed to eventually consume real data.
7.  **`src/components/MapboxMap.tsx`**: A **UI pattern for interactive mapping**. It receives `selectedTrek` and `isBottomDrawerOpen` props from `page.tsx` to control map behavior (e.g., flying to a selected trek, adjusting map height). It displays markers based on data (currently mock data from `src/lib/data.ts`).
8.  **`src/lib/data.ts`**: Defines the **data structure pattern** (interfaces like `Article`, `Trek`, `Waypoint`) and provides mock data. This file is crucial for understanding the shape of the data used throughout the frontend.

### Common Change Patterns

*   **UI Patterns (Frontend)**:
    *   **Component-based UI**: Changes to visual elements typically involve modifying existing components in `src/components/` or creating new ones. Shadcn UI components in `src/components/ui/` provide a consistent base.
    *   **State-driven UI**: UI elements often react to changes in React `useState` variables or data from custom hooks. Modifying how data is displayed or interacted with usually means adjusting component state and rendering logic.
    *   **Prop Drilling / Context**: Data and functions are passed down via props. For global concerns like theming, `src/components/theme-provider.tsx` uses React Context.
    *   **Styling**: UI changes often involve adjusting Tailwind CSS classes directly in JSX. For global style changes, `src/app/globals.css` and `tailwind.config.js` are the places to look.

*   **Logic Patterns (Frontend)**:
    *   **Hook-based Logic**: Reusable logic (like data fetching or authentication) is encapsulated in custom hooks within `src/hooks/`. Changes to data fetching or auth logic should primarily happen here.
    *   **Event Handlers**: User interactions (clicks, input changes) are handled by functions within components (e.g., `handleTabClick` in `page.tsx`, `handleItemClick` in `DynamicPanel.tsx`).

*   **Database Fetching Patterns**:
    *   **Supabase Client**: All database interactions go through the Supabase client initialized in `src/lib/supabase.ts`.
    *   **Custom Hooks (`useSupabase.ts`)**: The primary way to fetch data. To add new data queries or modify existing ones, you'd typically add a new hook or modify an existing one in `src/hooks/useSupabase.ts`. This ensures consistent loading/error handling.
    *   **Type Safety**: The `Database` interface in `src/lib/supabase.ts` is critical for type-safe queries. If the Supabase schema changes, this interface needs to be updated.

*   **Backend Functions (Supabase/Payload CMS)**:
    *   **Supabase Database**: The actual "backend" logic for data storage and retrieval is handled by Supabase's PostgreSQL database. Changes to data models (tables, columns, relationships) would involve modifying `db-schema.sql` and running Supabase migrations.
    *   **Supabase Row Level Security (RLS)**: Not explicitly in code, but crucial for backend security. RLS policies define who can access/modify what data directly on the database.
    *   **Payload CMS (`payload.config.ts`, `src/collections/Users.ts`)**: If Payload CMS is fully integrated, it would provide an admin interface and API endpoints for managing content. Changes to content types or their APIs would involve modifying files in `src/collections/` and `payload.config.ts`.
    *   **Next.js API Routes**: While not explicitly reviewed in detail, Next.js allows for API routes (`/pages/api` or within `src/app/api` for App Router). If custom server-side logic beyond direct Supabase interaction is needed (e.g., integrating with external APIs, complex data processing), these routes would be the place for "backend functions" within the Next.js app itself.

This hierarchy and pattern overview should provide a solid foundation for understanding the project and making targeted changes.
