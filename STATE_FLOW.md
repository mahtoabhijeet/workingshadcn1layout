# Mountain Explorer State Logic Flow

This document outlines the logic flow for the top 5 significant states within the Mountain Explorer application, illustrating how they are declared, updated, and how their changes propagate through the folder structure and components.

## 1. `activeTab`

*   **Declaration Location**: `src/app/page.tsx`
    ```typescript
    const [activeTab, setActiveTab] = useState("stories");
    ```
*   **Purpose**: Controls which content category (e.g., "stories", "peaks", "trails", "expeditions") is currently selected in the sidebar and displayed in the `DynamicPanel`.
*   **Update Mechanism**:
    *   User clicks on navigation buttons in the sidebar (`handleTabClick` function in `src/app/page.tsx`).
*   **Flow/Impact**:
    *   `src/app/page.tsx`: Manages the state.
    *   `src/components/DynamicPanel.tsx`: Receives `activeTab` as a prop. Its `renderListView` function would ideally filter content based on this tab (though currently it uses `MOCK_ARTICLES` for all tabs). The `DynamicPanel`'s content changes based on `activeTab`.
    *   **Pattern**: UI State Management, Prop Drilling.

## 2. `selectedTrek`

*   **Declaration Location**: `src/app/page.tsx`
    ```typescript
    const [selectedTrek, setSelectedTrek] = useState<Trek | null>(null);
    ```
*   **Purpose**: Holds the details of the currently selected trek, which is then highlighted on the map and displayed in the `MapBottomDrawer`.
*   **Update Mechanism**:
    *   User selects a trek from the `DynamicPanel` (`handleTrekSelect` function in `src/app/page.tsx`, which is passed as `onTrekSelect` prop to `DynamicPanel`).
    *   Closing the `MapBottomDrawer` (`handleMapBottomDrawerClose` in `src/app/page.tsx`).
*   **Flow/Impact**:
    *   `src/app/page.tsx`: Manages the state.
    *   `src/components/DynamicPanel.tsx`: Calls `onTrekSelect` prop when a trek is clicked in its detail view.
    *   `src/components/MapboxMap.tsx`: Receives `selectedTrek` as a prop. The map uses this to `flyTo` the trek's coordinates and highlight its marker.
    *   `src/components/MapBottomDrawer.tsx`: Receives `trek` as a prop and displays its details.
    *   **Pattern**: UI State Management, Prop Drilling, Inter-component Communication.

## 3. `isDrawerOpen` / `isMapBottomDrawerOpen`

*   **Declaration Location**: `src/app/page.tsx`
    ```typescript
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const [isMapBottomDrawerOpen, setMapBottomDrawerOpen] = useState(false);
    ```
*   **Purpose**: Controls the visibility of the main dynamic content drawer (`DynamicPanel`) and the map-specific bottom drawer (`MapBottomDrawer`).
*   **Update Mechanism**:
    *   `isDrawerOpen`: Set to `true` when a sidebar navigation tab is clicked (`handleTabClick`).
    *   `isMapBottomDrawerOpen`: Set to `true` when a trek is selected (`handleTrekSelect`), and `false` when the map bottom drawer is closed (`handleMapBottomDrawerClose`).
*   **Flow/Impact**:
    *   `src/app/page.tsx`: Manages both states.
    *   `src/components/DynamicPanel.tsx`: Its rendering is conditional on `isDrawerOpen`.
    *   `src/components/MapboxMap.tsx`: Receives `isBottomDrawerOpen` as a prop to adjust its height, making space for the bottom drawer.
    *   `src/components/MapBottomDrawer.tsx`: Its rendering is conditional on `isOpen` prop.
    *   **Pattern**: UI State Management, Conditional Rendering, Layout Adjustment.

## 4. `user` (Authentication State)

*   **Declaration Location**: `src/hooks/useAuth.ts`
    ```typescript
    const [user, setUser] = useState<User | null>(null);
    ```
*   **Purpose**: Represents the currently authenticated user's information.
*   **Update Mechanism**:
    *   Initial session check on component mount.
    *   Supabase authentication state changes (`onAuthStateChange` listener).
    *   `signIn`, `signUp`, `signOut` functions provided by `useAuth` hook.
*   **Flow/Impact**:
    *   `src/hooks/useAuth.ts`: Manages the state and provides authentication functions.
    *   `src/app/page.tsx`: Consumes the `user` and `loading` state from `useAuth` to conditionally display user information (email) or a "Sign In" button.
    *   Other components (e.g., `AdminPanel`, `WaypointNavigatorPanel`) might consume this state to control access or personalize content.
    *   **Pattern**: Authentication Logic, Custom Hook for Global State, Context (implicitly via hook usage).

## 5. Supabase Data States (`data`, `loading`, `error`)

*   **Declaration Location**: `src/hooks/useSupabase.ts` (within the generic `useSupabaseQuery` and specific data hooks like `usePeaks`, `useTrails`, etc.)
    ```typescript
    function useSupabaseQuery<T>(...) {
      const [data, setData] = useState<T | null>(null);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState<string | null>(null);
      // ...
    }
    ```
*   **Purpose**: Manage the fetched data, loading status, and any errors from Supabase queries for various entities (peaks, trails, stories, expeditions).
*   **Update Mechanism**:
    *   Asynchronous data fetching operations within the `useSupabaseQuery` hook's `fetchData` function.
    *   `refetch` function provided by the hooks.
*   **Flow/Impact**:
    *   `src/hooks/useSupabase.ts`: Centralizes all Supabase data fetching logic, providing a consistent interface (`data`, `loading`, `error`) for consuming components.
    *   `src/app/page.tsx`: Consumes `data` (e.g., `peaks`, `trails`, `stories`, `expeditions`) from these hooks to display counts and potentially filter content. It also uses `authLoading` from `useAuth`.
    *   Other components (e.g., `DynamicPanel` if it were to fetch real data, `AdminPanel`) would consume these states to display fetched data, show loading indicators, or handle errors.
    *   **Pattern**: Data Fetching, Custom Hooks, Loading/Error Handling.
