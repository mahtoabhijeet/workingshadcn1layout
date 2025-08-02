# UI Customization Guide for Mountain Explorer

This guide provides an overview of the project's UI structure and instructions on how to make changes to colors, themes, and component logic.

## 1. Project Structure Overview

The key directories for UI development are:

*   **`src/app`**: Contains the main application layout (`layout.tsx`) and pages (`page.tsx`). Global CSS is defined in `globals.css`.
*   **`src/components`**: Houses reusable React components.
    *   **`src/components/ui`**: This directory contains UI components built using `shadcn/ui`. These are often styled using Tailwind CSS and can be customized.
*   **`src/hooks`**: Contains custom React hooks, often used for state management or data fetching (e.g., `useSupabase.ts`, `useAuth.ts`).
*   **`src/lib`**: Contains utility functions, data definitions, and API integrations (e.g., `data.ts`, `utils.ts`, `supabase.ts`).

## 2. Styling and Theming

This project uses **Tailwind CSS** for styling, with `shadcn/ui` components.

### Global Styles

*   **`src/app/globals.css`**: This file contains the main CSS for the entire application. You can add or modify global styles here. It also imports Tailwind's base, components, and utilities.

### Tailwind CSS Configuration

*   **`tailwind.config.ts`** (located in the project root): This file is where you configure Tailwind CSS.
    *   **Colors**: You can define and extend your color palette here. For example, to change the primary color:
        ```javascript
        // tailwind.config.ts
        module.exports = {
          theme: {
            extend: {
              colors: {
                primary: {
                  DEFAULT: 'hsl(var(--primary))',
                  foreground: 'hsl(var(--primary-foreground))',
                },
                // ... other colors
              },
            },
          },
          // ...
        }
        ```
        The actual HSL values for `--primary` and `--primary-foreground` are defined as CSS variables in `src/app/globals.css`.
    *   **Theme Variables**: `shadcn/ui` components use CSS variables for theming. These variables are defined in `src/app/globals.css` under the `:root` selector.
        ```css
        /* src/app/globals.css */
        :root {
          --background: 0 0% 100%;
          --foreground: 222.2 84% 4.9%;
          --card: 0 0% 100%;
          --card-foreground: 222.2 84% 4.9%;
          --primary: 174 70% 35%; /* This is the teal color */
          --primary-foreground: 210 20% 98%;
          /* ... other variables */
        }
        ```
        To change the primary color, you would adjust the HSL values for `--primary`. For example, to change the teal to a blue:
        `--primary: 217 91% 60%;`

### Component-Specific Styles

*   Most components use Tailwind CSS classes directly in their JSX. You can modify these classes to change their appearance.
*   For more complex styling or custom variants, you might find `cn` (a utility for conditionally joining Tailwind classes) used in `src/lib/utils.ts`.

## 3. Component Logic and Structure

### Reusable UI Components

*   **`src/components`**: This directory contains the main application-specific components like `MapBottomDrawer.tsx`, `TranslucentDrawer.tsx`, `MainDrawer.tsx`, etc. These components encapsulate specific UI functionalities and often combine smaller `shadcn/ui` components.
*   **`src/components/ui`**: These are the foundational UI components (e.g., `button.tsx`, `card.tsx`, `input.tsx`). If you need to make a fundamental change to how a button or card looks across the entire application, you would modify the respective file here.

### Page-Level Logic

*   **`src/app/page.tsx`**: This is the main page component where different UI components are assembled, and overall page-level state and logic are managed. Changes to the layout of the main application, or how different panels interact, would typically happen here.

### Data and State Management

*   **`src/lib/data.ts`**: Defines data structures (like `Trek`, `Article`) and provides mock data (`MOCK_ARTICLES`). If you need to change the structure of the data displayed in the UI, this is where you'd start.
*   **`src/hooks/useSupabase.ts` / `src/hooks/useAuth.ts`**: These custom hooks handle data fetching from Supabase and authentication. If you need to change how data is retrieved or user authentication is handled, look into these files.

## 4. Practical Examples of UI Changes

### Example 1: Changing the Primary Color

1.  Open `src/app/globals.css`.
2.  Locate the `--primary` CSS variable within the `:root` selector.
3.  Modify the HSL values to your desired color. For instance, to change from teal to a shade of purple:
    ```css
    --primary: 270 70% 50%; /* Example purple */
    --primary-foreground: 210 20% 98%;
    ```
4.  Save the file. Tailwind will automatically recompile, and your primary color will update across the application.

### Example 2: Modifying a Component's Layout

Let's say you want to change the layout of the `MapBottomDrawer`.

1.  Open `src/components/MapBottomDrawer.tsx`.
2.  Locate the JSX structure you want to modify. For example, if you want to change how the header is displayed:
    ```jsx
    {/* Original Header */}
    <div className="p-4 border-b flex items-center justify-between">
      <h2 className="text-xl font-bold">{trek.name}</h2>
      <Button variant="ghost" size="icon" onClick={onClose}>
        <X className="w-5 h-5" />
      </Button>
    </div>
    ```
3.  You could change the `flex items-center justify-between` classes to `flex flex-col items-start` to stack the title and close button vertically:
    ```jsx
    {/* Modified Header */}
    <div className="p-4 border-b flex flex-col items-start">
      <h2 className="text-xl font-bold">{trek.name}</h2>
      <Button variant="ghost" size="icon" onClick={onClose} className="mt-2">
        <X className="w-5 h-5" />
      </Button>
    </div>
    ```
4.  Save the file to see the changes.

### Example 3: Adding a New UI Component

1.  Create a new `.tsx` file in `src/components` (or `src/components/ui` if it's a generic UI element).
    *   Example: `src/components/MyNewComponent.tsx`
2.  Define your React component with its JSX and any necessary logic.
3.  Import and use your new component in a parent component (e.g., `src/app/page.tsx` or another component in `src/components`).

This guide should provide a solid foundation for you to start making UI changes. Remember to always test your changes thoroughly!
