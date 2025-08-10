# Mountain Explorer: Next.js/React to Elixir/Phoenix Conversion Prompt for LLM Agent

This document serves as a comprehensive prompt and guide for an LLM-powered VSCode agent (with MCP capabilities) to convert the "Mountain Explorer" application from its current Next.js/React stack to Elixir with the Phoenix Framework.

## 1. Project Overview: Mountain Explorer (Current State)

The "Mountain Explorer" is a Next.js application designed for discovering mountains, trails, stories, and expeditions, primarily focused on the Himalayas.

**Key Technologies (Current):**
- **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS, Shadcn UI, Mapbox GL JS / React Map GL (for interactive 3D maps).
- **Backend/Data:** Supabase (PostgreSQL database, Authentication), Payload CMS (likely for content management), custom React hooks for data fetching and authentication.
- **Database Schema:** Defined in `db-schema.sql` (profiles, peaks, trails, stories, expeditions, user_peaks, user_trails, expedition_participants, story_images, overpass_queries).
- **Core Functionality:** Interactive map, dynamic content panels (list/detail views), search, user authentication (sign-up/in/out), user progress tracking, admin panel.
- **State Management:** Primarily React's `useState` and custom hooks (`useSupabase`, `useAuth`).
- **Styling:** Tailwind CSS and Shadcn UI components.

**Key Files Reviewed (for context):**
- `package.json`: Lists all dependencies, including `@supabase/supabase-js`, `mapbox-gl`, `react-map-gl`, `payload`, `next`.
- `APP_OVERVIEW.md`: Detailed description of folder structure, core logic, state management, styling, and key components.
- `db-schema.sql`: Full PostgreSQL database schema.
- `src/app/page.tsx`: Main application entry point, orchestrates UI, fetches data, manages global state.
- `src/components/MapboxMap.tsx`: Mapbox integration, 3D terrain, markers, popups, camera animations.
- `src/hooks/useSupabase.ts`: Custom React hooks for Supabase data fetching (peaks, trails, stories, expeditions, search, user progress) with joins.
- `src/lib/data.ts`: Defines TypeScript interfaces for data structures (Article, Trek, Waypoint, Media, etc.) and mock data (`MOCK_ARTICLES`).

## 2. Target Framework: Elixir + Phoenix

The goal is to re-implement the entire application using Elixir and the Phoenix Framework.

**Key Phoenix Components to Utilize:**
- **Phoenix LiveView:** For building interactive, real-time user interfaces without writing much JavaScript. This will replace React components and much of the client-side state management.
- **Ecto:** For database interactions with PostgreSQL, replacing direct Supabase client calls for data manipulation.
- **Phoenix Channels:** For real-time features where LiveView might not be sufficient or for specific PubSub patterns.
- **Phoenix Controllers/Routers:** For handling HTTP requests and routing, replacing Next.js API routes.
- **Tailwind CSS:** Can be integrated directly into Phoenix projects.

## 3. Conversion Goals (High-Level)

1.  **Replicate all existing features and functionality** in Elixir/Phoenix.
2.  **Maintain the current UI/UX** as closely as possible, leveraging Tailwind CSS.
3.  **Migrate database interactions** from Supabase client to Ecto.
4.  **Re-implement authentication** using a robust Elixir authentication library.
5.  **Handle Mapbox GL JS integration** effectively within LiveView.
6.  **Ensure real-time capabilities** are preserved or enhanced.

## 4. Phase-by-Phase Implementation Strategy for LLM Agent

The conversion should be approached iteratively, focusing on core functionalities first.

### Phase 1: Project Setup & Database Migration (Backend Foundation)

**Goal:** Establish the basic Phoenix project, configure Ecto, and migrate the database schema.

**Steps:**
1.  **Initialize Phoenix Project:** Create a new Phoenix project (e.g., `mix phx.new mountain_explorer --no-html --no-webpack --no-dashboard` or with LiveView if preferred from the start).
2.  **Configure Ecto:** Set up `config/config.exs` for PostgreSQL connection.
3.  **Database Schema Migration:**
    *   Translate `db-schema.sql` into Ecto migrations (`mix ecto.gen.migration create_tables`).
    *   Define Ecto Schemas for all tables (e.g., `profiles`, `peaks`, `trails`, `stories`, `expeditions`, `user_peaks`, `user_trails`, `expedition_participants`, `story_images`, `overpass_queries`).
    *   Ensure relationships (e.g., `belongs_to`, `has_many`) are correctly defined in schemas.
    *   Implement initial data seeding if necessary (from `db-schema.sql` sample data).
4.  **Context Modules:** Create Phoenix Contexts (e.g., `MountainExplorer.Accounts`, `MountainExplorer.Mountains`, `MountainExplorer.Content`, `MountainExplorer.Expeditions`) to encapsulate business logic and database interactions.
5.  **Basic Authentication:** Integrate an Elixir authentication library (e.g., `Pow` or `Guardian`) for user registration, login, and session management. This will replace Supabase Auth.

### Phase 2: Core API & Data Fetching (Backend Logic)

**Goal:** Implement the backend logic for data retrieval and basic mutations, mirroring `useSupabase.ts` functionality.

**Steps:**
1.  **Implement Context Functions:** Write functions within the created contexts to perform CRUD operations and complex queries (e.g., fetching all peaks, trails with associated peaks, stories with authors/peaks/trails, search functionality).
2.  **Phoenix Controllers:** Create basic Phoenix controllers and routes to expose these context functions as API endpoints (e.g., `/api/peaks`, `/api/trails`). This will serve as the initial data source for the frontend.
3.  **Search Functionality:** Re-implement the debounced search logic from `useSearch.ts` within a Phoenix context or LiveView, performing searches across multiple tables.

### Phase 3: Frontend with LiveView (Initial UI)

**Goal:** Rebuild the main UI components using Phoenix LiveView, focusing on static content and basic interactivity.

**Steps:**
1.  **Root Layout:** Create the main LiveView layout (`lib/mountain_explorer_web/live/layout.ex` and `lib/mountain_explorer_web/live/layout.html.heex`) to include global styles (Tailwind CSS) and theme provider logic.
2.  **Main Page LiveView:** Convert `src/app/page.tsx` into a Phoenix LiveView (`lib/mountain_explorer_web/live/home_live.ex` and `home_live.html.heex`).
    *   Manage `activeTab`, `searchQuery`, `isDrawerOpen`, `showAdminPanel`, `selectedTrek` as LiveView assigns.
    *   Implement `handleTabClick` and other event handlers using `phx-click` and `handle_event` callbacks.
    *   Render conditional UI elements based on assigns.
3.  **Static UI Components:** Convert simple React components (e.g., `Button`, `Input`, `Sidebar navigation`) into LiveView components or HEEX templates. Integrate Tailwind CSS.
4.  **Data Display:** Display fetched data (peaks, trails, stories, expeditions) from the backend contexts in the LiveView.

### Phase 4: Mapbox Integration & Dynamic Panels (Complex UI)

**Goal:** Integrate Mapbox GL JS and re-implement dynamic content panels with full interactivity.

**Steps:**
1.  **Mapbox LiveView Component:** Create a dedicated LiveView component for the map (`lib/mountain_explorer_web/live/mapbox_map_live.ex` and `mapbox_map_live.html.heex`).
    *   **JavaScript Hooks:** This is crucial. Use LiveView JavaScript hooks (`phx-hook`) to initialize and interact with the Mapbox GL JS instance.
    *   Pass `selectedTrek` and other map-related state from the parent LiveView to the Mapbox hook via `data-` attributes.
    *   Implement marker rendering, popups, and camera animations (including the rotation) using JavaScript within the hook, communicating back to LiveView via `pushEvent` for state changes (e.g., `onMove`).
    *   Ensure 3D terrain is enabled.
2.  **DynamicPanel LiveView:** Convert `src/components/DynamicPanel.tsx` into a LiveView component.
    *   Manage `view`, `selectedItem`, `history` as LiveView assigns.
    *   Implement `handleItemClick`, `handleBackClick` using LiveView events.
    *   Render list and detail views dynamically.
    *   Integrate search results from the backend.
3.  **AdminPanel LiveView:** Convert `src/components/AdminPanel.tsx` into a LiveView component, potentially using LiveView forms for data entry.

### Phase 5: Real-time Features & Polish (Advanced Functionality)

**Goal:** Implement remaining features, optimize, and prepare for deployment.

**Steps:**
1.  **Real-time Updates:** If any data needs real-time updates (e.g., new stories, expedition participant counts), leverage Phoenix Channels or LiveView's built-in PubSub capabilities.
2.  **User Progress:** Re-implement `useUserProgress.ts` logic using Ecto queries and display user-specific completed peaks/trails.
3.  **File Uploads:** Implement file upload functionality for images (e.g., story images, avatars) using Phoenix and a storage solution (e.g., S3, local file system).
4.  **Error Handling & Loading States:** Implement robust error handling and display loading indicators across the application.
5.  **Testing:** Write LiveView tests and Ecto tests.
6.  **Deployment:** Prepare the Phoenix application for deployment (e.g., Docker, Gigalixir, Fly.io).

## 5. Key Considerations & Challenges for LLM Agent

-   **State Management Paradigm Shift:** The agent must understand the fundamental difference between React's client-side state and LiveView's server-rendered, stateful components. Focus on `assigns` and `handle_event` callbacks.
-   **JavaScript Interoperability:** Mapbox GL JS and other client-side libraries will require careful use of LiveView Hooks (`phx-hook`) to bridge Elixir and JavaScript. The agent should prioritize minimal JS and push events back to LiveView for state changes.
-   **Supabase vs. Ecto:** The agent needs to translate Supabase client calls and RLS (Row Level Security) concepts into Ecto queries and potentially Phoenix authorization logic.
-   **Payload CMS:** If Payload CMS is actively used for content management, the agent needs to consider how its data models and API interactions will be replicated or integrated with Phoenix. If it's just for schema definition, Ecto will handle it.
-   **Mock Data Removal:** Ensure `MOCK_ARTICLES` and similar mock data are replaced with actual data fetched via Ecto.
-   **Environment Variables:** Ensure all necessary environment variables (e.g., Mapbox Access Token, Supabase credentials if still used for some reason, or new DB credentials) are correctly configured in Phoenix.

## 6. MCP Abilities & LLM Workflow Tips for VSCode Agents

This section outlines how an LLM agent with MCP capabilities can efficiently execute this conversion.

### Leveraging MCP Tools:

-   **`read_file`**: Crucial for understanding existing code, configurations, and documentation. Use it extensively to gather context before writing new code.
-   **`list_files`**: For exploring the project structure, especially new directories created for the Phoenix app.
-   **`write_to_file`**: For creating new Elixir modules, LiveView templates, Ecto migrations, and configuration files. This will be used heavily.
-   **`replace_in_file`**: For making targeted modifications to existing files (e.g., updating `mix.exs`, `config.exs`, router files).
-   **`execute_command`**:
    -   `mix phx.new`: To scaffold the new Phoenix project.
    -   `mix ecto.gen.migration`: To create database migrations.
    -   `mix ecto.migrate`: To run migrations.
    -   `mix deps.get`: To fetch Elixir dependencies.
    -   `mix phx.server`: To run the Phoenix development server for testing.
    -   `npm install` / `npm run build` (if frontend assets are managed by npm/webpack within Phoenix).
-   **`browser_action`**:
    -   Launch the Phoenix application locally (`http://localhost:4000`) to visually verify UI components, map functionality, and overall application behavior after each major phase.
    -   Interact with the UI (click buttons, type in search fields) to test interactivity.
    -   Capture screenshots to assess visual fidelity and identify layout issues.
    -   Monitor console logs for JavaScript errors related to LiveView hooks or Mapbox.
-   **`search_files`**: To find specific patterns, function calls, or data structures across the existing codebase that need to be translated. Useful for identifying all usages of Supabase client calls or specific React components.
-   **`list_code_definition_names`**: To quickly grasp the high-level structure of Elixir modules and LiveViews as they are created, ensuring proper organization.

### Up-to-Date LLM Workflow Tips in VSCode:

1.  **Iterative Development (Small Steps):**
    *   Break down each phase into smaller, manageable tasks.
    *   Implement one feature or component at a time.
    *   After each significant change (e.g., creating a new LiveView, implementing a context function), use `execute_command` to run tests or `browser_action` to verify.
    *   **Crucial:** Wait for user confirmation after each tool use before proceeding. Do not assume success.

2.  **Context is King:**
    *   Always `read_file` for relevant existing files before attempting to translate or re-implement.
    *   If unsure about a specific part of the existing Next.js code, `read_file` the component or hook in question.
    *   When writing Elixir code, refer to the `APP_OVERVIEW.md` and `db-schema.sql` frequently.

3.  **Leverage `plan_mode_respond` (if in Plan Mode):**
    *   If the task becomes complex or requires a significant architectural decision, switch to Plan Mode and use `plan_mode_respond` to propose a detailed plan to the user before executing.
    *   Use `ask_followup_question` for any ambiguities or missing information.

4.  **Proactive Error Handling:**
    *   Anticipate common Elixir/Phoenix errors (e.g., Ecto schema mismatches, LiveView event handling issues, JavaScript hook errors).
    *   After `execute_command` (especially `mix phx.server`), check for compilation errors or runtime exceptions.
    *   When using `browser_action`, always review the console logs for client-side errors.

5.  **Modular Design:**
    *   Encourage the agent to follow Phoenix's conventions: use contexts for business logic, LiveViews for UI, and separate modules for utilities.
    *   Keep LiveView components focused on specific UI concerns.

6.  **Testing Early & Often:**
    *   As soon as a basic feature is implemented (e.g., a data fetching function in a context), suggest writing a simple test for it.
    *   For LiveViews, use `mix test` to run LiveView tests.

7.  **Version Control Awareness:**
    *   While the agent doesn't directly commit, it should be aware that changes are being made to files. The user will handle version control.

8.  **Focus on Functional Equivalence:**
    *   The primary goal is to achieve the same functionality and user experience, not necessarily a line-by-line translation. The agent should adapt to Elixir/Phoenix idioms.

9.  **Mapbox Specifics:**
    *   The agent must understand that Mapbox GL JS is a client-side library. It cannot be directly run in Elixir.
    *   The LiveView hook will be the bridge: Elixir sends data to JS, JS renders the map and sends events back to Elixir.
    *   Pay close attention to `useEffect` dependencies in `MapboxMap.tsx` and translate that logic into LiveView hook lifecycle callbacks (e.g., `mounted`, `updated`).

By following this prompt and workflow, the LLM agent should be well-equipped to undertake the complex task of converting the Mountain Explorer application to Elixir and Phoenix.
