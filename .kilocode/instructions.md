# Interactive Trekking Guide Implementation - SPA Enhancement

## Current State Analysis
Based on the provided screenshots, the application currently has:
- ✅ Left sidebar navigation with Trails, Peaks, Stories, Expeditions
- ✅ Central Mapbox 3D terrain map with location marker
- ✅ Right sidebar with article cards (Article 1-5) showing placeholder content
- ✅ Basic layout structure implemented

## Enhancement Overview
Extend the existing SPA architecture to add interactive drawer functionality without breaking current routing or component structure. All interactions should remain within the single page application context.

## Core Components & Flow

### 1. Article Cards Enhancement (Right Sidebar - Already Implemented)
**Current Status:** ✅ Basic cards with placeholder content exist
**Required Enhancement:** 
- Add click handlers to existing article cards
- Transform placeholder content into Manali trekking articles
- Maintain existing card styling and layout
- Each card should trigger the main drawer opening

### 2. Main Drawer (Overlay Mode)
**Implementation:** Create new overlay component that doesn't disrupt existing layout
**Trigger:** Click on any article card in the right sidebar
**Position:** Full-screen overlay with proper z-index management
**Behavior:** 
- Slides in from right as overlay (not replacing current content)
- Maintains SPA routing - no URL changes
- Dismissible via ESC key, close button, or outside click
- Two content states managed within single component

**Content States:**
- **State 1:** Article detail view with organized trek lists by difficulty
- **State 2:** Individual trek details with comprehensive information

**SPA Compliance:**
- No route changes or page navigation
- Preserve all existing state (map position, sidebar selection, etc.)
- Use React portals for proper DOM placement

### 3. Bottom Map Drawer (Within Map Container)
**Current Map Container:** ✅ Mapbox 3D terrain map is already initialized
**Implementation:** Add drawer component within existing map container bounds
**Trigger:** Trek selection from main overlay drawer
**Position:** Bottom 1/3 of the existing map container (not viewport)
**Constraints:** 
- Must not interfere with existing map controls
- Should overlay existing map without changing container dimensions
- Preserve current map initialization and 3D terrain functionality

**Content:** Interactive key-value pairs of trek information
**Interaction States:**
- **Hover:** Visual feedback on interactive elements
- **Click:** Expandable sections, booking actions, photo galleries

**SPA Integration:**
- Coordinate with main drawer state without route changes
- Maintain map instance and current view when drawer opens/closes

### 4. Map Integration (Existing Mapbox Instance)
**Current Implementation:** ✅ 3D terrain mode initialized with location marker
**Enhancement Requirements:**
- Extend existing map instance with `flyTo` functionality
- Add trek coordinate data for Manali region trails
- Implement smooth camera transitions when trek is selected
- Preserve existing map state and controls

**Integration Points:**
- Hook into existing map instance (don't recreate)
- Coordinate flyTo with bottom drawer opening
- Handle multiple trek markers efficiently
- Maintain current location marker functionality

## Technical Implementation Guidelines

## SPA Architecture Considerations

### State Management (Preserve Existing + Add New)
```javascript
// Extend existing state without breaking current functionality
const [drawerState, setDrawerState] = useState('closed' | 'article' | 'trek')
const [selectedArticle, setSelectedArticle] = useState(null)
const [selectedTrek, setSelectedTrek] = useState(null)
const [mapDrawerOpen, setMapDrawerOpen] = useState(false)
const [expandedSections, setExpandedSections] = useState({})
const [hoveredElement, setHoveredElement] = useState(null)
// Preserve all existing state variables (map position, sidebar selection, etc.)
```

### Implementation Guidelines
- **No Route Changes:** All interactions happen within the current page context
- **Preserve Existing Functionality:** Current navigation, map controls, and sidebar behavior must remain intact
- **Overlay Pattern:** Use React portals and proper z-index management for drawers
- **State Isolation:** New drawer states should not interfere with existing application state
- **Performance:** Lazy load drawer content to maintain current page performance

### Event Flow (SPA Compliant)
1. **Article card click** (existing right sidebar) → Open main overlay drawer with article content
2. **Trek selection** (within overlay drawer) → Update overlay content + Open map bottom drawer + Trigger map flyTo
3. **Map drawer interactions:**
   - Hover over info cards → Show tooltips/previews without navigation
   - Click expandable sections → Reveal content within same drawer context
   - Action button clicks → Handle within current page context (modal forms, etc.)
4. **Drawer dismissal** → Close drawers, return to original state, preserve all existing functionality
5. **State preservation** → All sidebar selections, map position, and application state maintained throughout interactions

### Component Architecture (SPA Integration)
```
├── ExistingApp (Current SPA Structure)
│   ├── LeftSidebar (✅ Implemented - Trails, Peaks, Stories, Expeditions)
│   ├── MapContainer (✅ Implemented - 3D Terrain Mapbox)
│   │   ├── ExistingMapInstance
│   │   └── NEW: MapBottomDrawer (overlay within map bounds)
│   │       ├── InteractiveInfoCards
│   │       ├── ExpandableDetailSections
│   │       └── ActionButtons
│   ├── RightSidebar (✅ Implemented - Article Cards)
│   │   └── ArticleCard (enhance with click handlers)
│   └── NEW: MainDrawerOverlay (React Portal)
│       ├── ArticleDetailView
│       │   └── TrekList (organized by difficulty)
│       └── TrekDetailView
├── SharedState (Context/Zustand - preserve existing state)
└── SPA Router (maintain existing routing - no new routes)
```

## Data Structure Requirements

### Article Schema
```typescript
interface Article {
  id: string
  title: string
  description: string
  coverImage: string
  treks: Trek[]
}
```

### Trek Schema
```typescript
interface Trek {
  id: string
  name: string
  difficulty: 'Easy' | 'Moderate' | 'Hard'
  coordinates: [longitude, latitude]
  details: {
    duration: string
    distance: string
    elevation: string
    bestSeason: string
    startingPoint: string
    permitsRequired: boolean
    emergencyContact: string
  }
  interactive: {
    photoGallery: string[]
    weatherForecast: WeatherData
    bookingLinks: BookingLink[]
    similarTreks: string[]
    reviews: Review[]
  }
}

interface BookingLink {
  provider: string
  url: string
  price?: string
}

interface Review {
  rating: number
  comment: string
  author: string
  date: string
}
```

## Desktop-Focused UX Considerations
- Implement smooth CSS transitions for drawer animations (no mobile-specific gestures)
- Add skeleton loaders for drawer content loading states
- Ensure overlay drawers are dismissible via ESC key, close button, and outside click
- Include proper focus management for accessibility within SPA context
- Use subtle hover animations for desktop interactions (scale, shadow, color changes)
- Implement loading spinners for dynamic content within drawers
- **SPA Specific:**
  - Maintain scroll positions when drawers open/close
  - Preserve focus states appropriately
  - Ensure browser back/forward buttons don't interfere with drawer states
  - Handle window resize events gracefully for overlay positioning

## Performance Optimizations (SPA Context)
- Lazy load drawer components only when needed (don't affect initial page load)
- Implement virtual scrolling for large trek lists within drawers
- Cache map flyTo positions to prevent repeated API calls
- Use React.memo for drawer components to prevent unnecessary re-renders
- Debounce hover interactions to optimize performance
- **SPA Specific:**
  - Code split drawer components for better bundle management
  - Use React.lazy for drawer content to maintain current page performance
  - Implement proper cleanup on drawer unmount to prevent memory leaks
  - Cache trek data client-side to avoid repeated API calls

## Accessibility Requirements
- Proper ARIA labels for all interactive elements
- Keyboard navigation support
- Screen reader announcements for state changes
- Focus trapping within open drawers
- High contrast mode support

## Mobile Responsiveness
**Note:** Current focus is desktop web application. Mobile considerations are noted for future reference but not current implementation priority.

- Main overlay drawer: Full-screen on mobile, sidebar on desktop (future consideration)
- Map drawer: Adjust height appropriately for smaller screens (future consideration)
- **Current Priority:** Ensure desktop experience is optimal and SPA functionality is preserved