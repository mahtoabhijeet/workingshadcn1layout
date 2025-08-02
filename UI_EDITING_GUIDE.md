# UI Editing Guide

This guide provides instructions on how to navigate the project's folder structure and modify UI elements, including their size, color, and position. It also outlines a workflow for making changes that affect multiple files.

## 1. Folder Structure Navigation

Understanding the project's folder structure is key to efficiently locating and modifying UI elements.

-   **/src/app/**: Contains the main application layout, pages, and global styles.
    -   `globals.css`: Global CSS styles, including base styles, CSS variables for theming, and potentially animations.
    -   `layout.tsx`: The root layout component.
    -   `page.tsx`: The main landing page.
-   **/src/components/**: Houses reusable UI components.
    -   **`ui/`**: Contains individual shadcn/ui components (e.g., `button.tsx`, `card.tsx`, `dialog.tsx`). These files define the base styling for each component.
    -   **Feature-specific components**: Components like `WaypointNavigatorPanel.tsx`, `MapBottomDrawer.tsx`, `MapboxMap.tsx` contain the logic and JSX for specific features. These components often use Tailwind CSS classes directly in their JSX or import styles from other files.
-   **/src/lib/**: Contains utility functions, data structures, and mock data.
    -   `data.ts`: Defines interfaces for data models (like `Trek`, `Waypoint`, `Media`) and provides mock data.
-   **`tailwind.config.js`**: The configuration file for Tailwind CSS. This is where you can customize the design system, including colors, spacing, breakpoints, fonts, and more.
-   **`components.json`**: Configuration file for shadcn/ui, specifying which components are installed and their paths.

## 2. Styling Elements (Size, Color, Position)

Most UI styling in this project is handled using **Tailwind CSS utility classes**. For more complex or global styles, `globals.css` and `tailwind.config.js` are used.

### 2.1. Size

-   **Tailwind CSS**: Use utility classes like `w-`, `h-`, `min-w-`, `max-w-`, `min-h-`, `max-h-`, `p-` (padding), `m-` (margin), `text-` (font size), etc.
    -   Example: `w-1/3` for width, `h-screen` for full viewport height, `p-4` for padding, `text-lg` for font size.
-   **Component Files (`.tsx`)**: Look for these classes directly within the JSX of the component you want to modify. For example, in `WaypointNavigatorPanel.tsx`, you'll find classes like `h-full`, `w-full`, `sm:w-36`, `aspect-square`.
-   **`tailwind.config.js`**: If you need to use custom sizes not available in Tailwind's default configuration, you can extend the `theme.extend.spacing` or `theme.extend.screens` sections.

### 2.2. Color

-   **Tailwind CSS**: Use color utility classes like `bg-`, `text-`, `border-`, `hover:bg-`, `text-`, etc. Colors are mapped to Tailwind's color palette, which is configured in `tailwind.config.js`.
    -   Example: `bg-primary`, `text-muted-foreground`, `border-border`, `hover:bg-secondary`.
-   **`tailwind.config.js`**: This file defines the color palette. You can find color definitions under `theme.colors` or `theme.extend.colors`. For example, `primary` might be defined as `hsl(var(--primary))`.
-   **`globals.css`**: This file defines CSS variables (e.g., `--primary`, `--background`, `--border`) which are used by Tailwind's HSL color configuration. To change a color globally, you would typically modify the CSS variable definition in `globals.css` and ensure `tailwind.config.js` is configured to use these variables.
    -   Example: To change the primary color, you might edit `hsl(var(--primary))` in `globals.css`.
-   **Component Files (`.tsx`)**: Look for color utility classes applied directly to elements.

### 2.3. Position

-   **Tailwind CSS**: Use utility classes for positioning:
    -   `absolute`, `relative`, `fixed`, `sticky` for positioning context.
    -   `top-`, `bottom-`, `left-`, `right-` for offset values.
    -   `z-` for z-index.
    -   `translate-x-`, `translate-y-` for translations.
    -   `inset-` for combined top/bottom/left/right.
    -   `mx-auto` for centering block elements horizontally.
-   **Component Files (`.tsx`)**: Look for these classes in the JSX. For example, `MapBottomDrawer.tsx` uses `absolute bottom-0 left-0 ...`.
-   **`globals.css`**: Can be used for more complex positioning or animations that are not easily achievable with Tailwind utilities alone.

## 3. Multi-File Editing Workflow

When a UI change requires modifications across multiple files, follow these steps to ensure consistency and avoid errors:

1.  **Identify the target element**: Determine which UI element needs to be changed.
2.  **Locate the component file**: Find the `.tsx` file responsible for rendering that element (e.g., `src/components/WaypointNavigatorPanel.tsx`).
3.  **Analyze existing styles**: Examine the component file for Tailwind CSS classes or imports related to styling. Check `tailwind.config.js` and `globals.css` for relevant theme variables or global styles.
4.  **Determine the scope of the change**:
    *   **Single Component Change**: If the change only affects one component, modify its `.tsx` file directly.
    *   **Global Style Change**: If the change affects multiple instances of an element across the application (e.g., changing the primary color), modify the relevant CSS variable in `globals.css` or update `tailwind.config.js`.
    *   **Component Reusability**: If a change is needed for a specific component's variant (e.g., a special button style), consider creating a new component or adding a specific prop to the existing component.
5.  **Plan the sequence of edits**:
    *   **Configuration First**: If the change involves modifying `tailwind.config.js` or global CSS variables in `globals.css`, make these changes first. This ensures that subsequent component-level changes using these configurations will pick up the new values.
    *   **Component Logic**: Modify component logic (state, props, event handlers) as needed.
    *   **Component Styling**: Apply or adjust Tailwind classes in the component's JSX.
    *   **Parent/Child Dependencies**: If changing a parent component affects its children, or vice versa, ensure the order of edits maintains a consistent state. For example, if a parent component passes down a new prop that a child component relies on, update the parent first.
6.  **Test thoroughly**: After making changes, preview the application to ensure the modifications are applied correctly and do not introduce regressions. Check different screen sizes and interactive states.

**Example Workflow: Changing the primary button color**

1.  **Identify**: You want to change the primary button color.
2.  **Locate**: The primary color is likely defined as a CSS variable. Check `globals.css` and `tailwind.config.js`.
    *   `globals.css` might have `--primary: hsl(220 50% 47%);`
    *   `tailwind.config.js` might have `primary: { DEFAULT: "hsl(var(--primary))", ... }`
3.  **Plan**: Change the `--primary` CSS variable in `globals.css`.
4.  **Edit**:
    *   Open `src/app/globals.css`.
    *   Find the `--primary` definition and change its value (e.g., to `hsl(150 60% 40%)` for a green color).
5.  **Test**: All elements using `bg-primary`, `text-primary`, etc., should now reflect the new green color. Check buttons, progress indicators, etc.

By following these guidelines, you can effectively manage UI changes and maintain a well-organized codebase.
