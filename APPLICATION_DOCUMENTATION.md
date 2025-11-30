# PC Build Generator - Application Documentation

## Table of Contents
1. [Overview](#overview)
2. [Technologies Used](#technologies-used)
3. [Application Architecture](#application-architecture)
4. [Core Features & Implementation](#core-features--implementation)
5. [Code Walkthrough](#code-walkthrough)
6. [Database Schema](#database-schema)
7. [API Integration](#api-integration)

---

## Overview

The **PC Build Generator** is a full-stack web application that helps users build compatible PC configurations within their budget. The application uses an intelligent algorithm to select compatible components, validates compatibility, and allows users to save, edit, and export their builds.

### Key Features
- **Automated Build Generation**: Generate complete PC builds based on budget constraints
- **Compatibility Validation**: Real-time checking of component compatibility (sockets, power, physical dimensions)
- **User Authentication**: Secure login/registration with Supabase Auth
- **Build Management**: Save, edit, delete, and export builds
- **Component Swapping**: Manually swap components with compatible alternatives
- **Export Functionality**: Export builds to PDF or CSV formats
- **Responsive Design**: Full mobile and desktop support

---

## Technologies Used

### Frontend
- **React 19.1.0** - UI library for building component-based interfaces
- **React Router DOM 6.30.0** - Client-side routing and navigation
- **Tailwind CSS 3.4.18** - Utility-first CSS framework for styling
- **React Icons 5.5.0** - Icon library for UI elements
- **React Toastify 11.0.5** - Toast notifications for user feedback
- **React Circular Progressbar 2.2.0** - Performance visualization

### Backend & Database
- **Supabase 2.39.0** - Backend-as-a-Service (PostgreSQL database + Authentication)
  - PostgreSQL for data storage
  - Row Level Security (RLS) for data protection
  - JWT-based authentication

### Export & Utilities
- **jsPDF 2.5.1** - PDF generation library
- **jsPDF-AutoTable 3.8.2** - Table generation for PDFs

### Build Tools
- **React Scripts 5.0.1** - Create React App build tooling
- **PostCSS 8.5.6** - CSS processing
- **Autoprefixer 10.4.21** - CSS vendor prefixing

---

## Application Architecture

### Directory Structure
```
pc-builder-mockup/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── BudgetInput.js
│   │   ├── ExportBuild.js
│   │   ├── Modal.js
│   │   └── Navbar.js
│   ├── context/           # React Context for global state
│   │   └── UserContext.js
│   ├── lib/               # Library configurations
│   │   └── supabase.js
│   ├── screens/           # Page components
│   │   ├── Auth.js
│   │   ├── BuildScreen.js
│   │   ├── HomeScreen.js
│   │   ├── PasswordReset.js
│   │   ├── SavedBuildsScreen.js
│   │   └── Support.js
│   ├── services/          # Business logic & API calls
│   │   ├── authService.js
│   │   ├── buildService.js
│   │   ├── componentService.js
│   │   └── exportService.js
│   ├── App.js             # Root component
│   ├── index.js           # Entry point
│   └── index.css          # Global styles
├── supabase-schema-updated.sql  # Database schema
├── package.json
└── tailwind.config.js     # Tailwind configuration
```

### Architecture Pattern
The application follows a **Service-Oriented Architecture** with clear separation of concerns:

1. **Presentation Layer** (Components/Screens) - UI and user interaction
2. **Business Logic Layer** (Services) - Algorithm implementation and data processing
3. **Data Access Layer** (Supabase Client) - Database operations
4. **State Management** (React Context + Hooks) - Global and local state

---

## Core Features & Implementation

### 1. Automated Build Generation

**File**: `src/services/buildService.js`

The build generation algorithm uses a sophisticated multi-strategy approach:

#### Algorithm Overview
```javascript
// Lines 97-186
export const generateBuild = async (budget) => {
  // 1. Fetch all available components from database
  const { data: componentsGrouped } = await getAllComponents()

  // 2. Calculate minimum viable build cost
  const minimumViableCost = calculateMinimumBuildCost(componentsGrouped)

  // 3. Validate budget is sufficient
  if (budget < minimumViableCost) {
    return error with minimum required budget
  }

  // 4. Try multiple strategies until successful
  // Strategy 1: Standard allocation (20% CPU, 30% GPU, etc.)
  // Strategy 2: Budget-optimized allocation
  // Strategy 3: Aggressive cost-cutting
  // Strategy 4: Minimum viable build (last resort)
}
```

#### Smart Component Selection (Lines 319-378)
```javascript
const selectComponentSmartly = (components, idealBudget, remainingBudget, type, step, totalSteps) => {
  // 1. Calculate budget reservation for remaining components
  const reservedBudget = remainingBudget * (stepsRemaining * 0.06)

  // 2. Filter affordable components
  const affordable = components.filter(c => price <= availableBudget)

  // 3. Score components based on performance/price ratio
  const scoredComponents = affordable.map(component => ({
    score: calculateComponentScore(component, type),
    distanceFromTarget: Math.abs(price - targetPrice)
  }))

  // 4. RANDOMIZATION: Select from top 5 candidates with weighted probability
  // Better components have higher probability but variety is maintained
  const topCandidates = scoredComponents.slice(0, 5)
  const weights = topCandidates.map((_, index) => Math.pow(2, topCandidatesCount - index))

  // 5. Randomly select based on exponential weights
  return weightedRandomSelection(topCandidates, weights)
}
```

**How It Works:**
1. User enters budget in `BudgetInput.js`
2. `BuildScreen.js` calls `generateBuild(budget)`
3. Algorithm calculates dynamic budget allocation with randomization (±2%)
4. Components selected in order: CPU → Motherboard → RAM → GPU → Case → Storage → PSU → Cooler
5. Each component selection considers:
   - Compatibility with already selected components
   - Performance/price ratio
   - Budget constraints
   - Randomization for variety
6. Returns complete build with compatibility report

### 2. Compatibility Validation

**File**: `src/services/buildService.js` (Lines 414-476)

The system validates multiple compatibility constraints:

#### Socket Compatibility
```javascript
// CPU and Motherboard must have matching sockets
if (build.cpu.specs.socket !== build.motherboard.specs.socket) {
  issues.push('CPU socket does not match motherboard socket')
}
```

#### RAM Compatibility
```javascript
// RAM type must match motherboard specification
if (build.ram.specs.type !== build.motherboard.specs.ram_type) {
  issues.push('RAM type does not match motherboard')
}
```

#### Physical Dimensions
```javascript
// GPU must fit inside the case
const gpuLength = parseInt(build.gpu.specs.length)
const maxGpuLength = parseInt(build.case.specs.max_gpu_length)
if (gpuLength > maxGpuLength) {
  issues.push(`GPU (${gpuLength}mm) does not fit in case (max ${maxGpuLength}mm)`)
}
```

#### Power Requirements
```javascript
// PSU must provide sufficient wattage
const totalTDP = (build.cpu.specs.tdp || 0) + (build.gpu.specs.tdp || 0) + 100
const recommendedWattage = Math.ceil(totalTDP * 1.3) // 30% headroom
const psuWattage = build.psu.specs.wattage

if (psuWattage < totalTDP) {
  issues.push(`PSU wattage insufficient`)
} else if (psuWattage < recommendedWattage) {
  warnings.push(`PSU lower than recommended`)
}
```

#### Cooler Compatibility
```javascript
// Cooler must support CPU socket
const socketSupport = build.cooler.specs.socket_support || []
if (!socketSupport.includes(build.cpu.specs.socket)) {
  issues.push('Cooler does not support CPU socket')
}

// Cooler must handle CPU TDP
if (coolerTDP < cpuTDP) {
  warnings.push(`Cooler TDP rating (${coolerTDP}W) is lower than CPU TDP`)
}
```

### 3. User Authentication

**File**: `src/services/authService.js`

Uses Supabase Authentication with email/password:

#### Registration (Lines 10-33)
```javascript
export const registerUser = async (email, password, name) => {
  // 1. Create user account with Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: name }  // Store name in user metadata
    }
  })

  // 2. Supabase sends verification email automatically
  // 3. Return success/error to UI
}
```

#### Login (Lines 35-51)
```javascript
export const loginUser = async (email, password) => {
  // 1. Authenticate with Supabase
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  // 2. Supabase creates session with JWT token
  // 3. Token stored in localStorage automatically
  // 4. Return user data to application
}
```

#### Session Management (Lines 63-68)
```javascript
export const getCurrentUser = async () => {
  // Retrieve current session from Supabase
  const { data: { session } } = await supabase.auth.getSession()
  return session?.user || null
}
```

**Flow in UI** (`src/screens/Auth.js`):
1. User fills email/password form (Lines 100-141)
2. Form validates input (min 6 chars, password match on signup)
3. Calls `loginUser()` or `registerUser()` from authService
4. On success, UserContext updates (Lines 48-58)
5. User redirected to homepage with authenticated state

### 4. Build Management

#### Saving Builds
**File**: `src/services/buildService.js` (Lines 488-517)

```javascript
export const saveBuild = async (userId, buildName, build, totalPrice, budget, compatibilityReport) => {
  // 1. Insert build into Supabase database
  const { data, error } = await supabase
    .from('builds')
    .insert({
      user_id: userId,
      build_name: buildName,
      components: build,        // Stored as JSONB
      total_price: totalPrice,
      budget,
      compatibility_report: compatibilityReport,
    })

  // 2. Log activity for analytics
  await supabase.from('activity_log').insert({
    user_id: userId,
    action: 'build_saved',
    details: { build_name: buildName, total_price: totalPrice }
  })
}
```

**UI Implementation** (`src/screens/BuildScreen.js` Lines 200-236):
```javascript
function handleSave() {
  // 1. Check authentication
  if (!user) {
    toast.error('Please login to save builds')
    return
  }

  // 2. Prompt for build name using custom modal
  setPromptModal({
    isOpen: true,
    type: 'save',
    title: 'Save Build',
    message: 'Enter a name for this build',
    placeholder: 'My Gaming PC'
  })
}

// 3. On modal submit
const onPromptSubmit = async (buildName) => {
  const result = await saveBuild(
    user.id,
    buildName,
    generatedBuild,
    totalPrice,
    budget,
    compatibilityReport
  )

  if (result.success) {
    setSaved(true)
    toast.success('Build saved successfully!')
  }
}
```

#### Viewing Saved Builds
**File**: `src/screens/SavedBuildsScreen.js`

```javascript
// 1. Load builds on component mount (Lines 40-61)
async function loadBuilds() {
  const currentUser = await getCurrentUser()
  const result = await getUserBuilds(currentUser.id)

  if (result.success) {
    setSavedBuilds(result.data)
  }
}

// 2. Display builds in grid layout (Lines 156-260)
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  {savedBuilds.map((build) => (
    <div key={build.id} className="build-card">
      {/* Header with name and date */}
      {/* Component list with vendor links */}
      {/* Action buttons: Edit, Export, Delete */}
    </div>
  ))}
</div>
```

#### Editing Saved Builds
**Implementation** (Lines 98-101):

```javascript
function handleEdit(build) {
  // Navigate to BuildScreen with build data in state
  navigate('/build', { state: { editBuild: build } })
}
```

**BuildScreen receives and loads** (Lines 96-122):
```javascript
useEffect(() => {
  if (location.state?.editBuild) {
    const editBuild = location.state.editBuild

    // Load components as display items
    const loadedItems = Object.entries(editBuild.components || {})
      .map(([type, component]) => mapComponentToDisplayItem(type, component))
      .filter(Boolean)

    // Calculate performance score
    const calculatedPerformance = calculatePerformanceScore(...)

    // Set state
    setItems(loadedItems)
    setBudget(loadedBudget)
    setOptimal(calculatedPerformance)
    setEditMode(true)
  }
}, [])
```

#### Deleting Builds
**With Confirmation Modal** (Lines 67-83):

```javascript
function removeBuild(buildId, buildName) {
  // Show confirmation modal
  setDeleteModal({ isOpen: true, buildId, buildName })
}

async function confirmDeleteBuild() {
  // Call delete service
  const result = await deleteBuild(deleteModal.buildId, user.id)

  if (result.success) {
    toast.success('Build deleted successfully!')
    loadBuilds() // Refresh list
  }
}
```

### 5. Component Swapping

**File**: `src/screens/BuildScreen.js`

#### Edit Mode Toggle (Lines 401-412)
```javascript
<button
  onClick={() => setEditMode(!editMode)}
  className={editMode ? 'active-style' : 'inactive-style'}
>
  {editMode ? 'View Mode' : 'Edit Mode'}
</button>
```

#### Conditional Button Rendering (Lines 578-605)
```javascript
{!editMode ? (
  // VIEW MODE: Buy Now + Small Swap Button
  <>
    <a href={item.link} target="_blank">
      Buy Now
    </a>
    <button onClick={() => setSwappingComponent(item.category)}>
      <AiOutlineSwap size={16} />
    </button>
  </>
) : (
  // EDIT MODE: Large "Change Component" Button
  <button onClick={() => setSwappingComponent(item.category)}>
    <AiOutlineSwap size={16} />
    Change Component
  </button>
)}
```

#### Swap Modal
When user clicks swap, modal shows compatible alternatives filtered by current build constraints.

### 6. Performance Score Calculation

**File**: `src/screens/BuildScreen.js` (Lines 166-175)

```javascript
// Calculate performance score based on budget utilization and component quality
const budgetUtilization = Math.min(result.totalPrice / normalizedBudget, 1.0)
const baseScore = budgetUtilization * 100

// Adjust for component count (more components = more complete build)
const componentCount = displayItems.length
const completenessBonus = Math.min(componentCount / 8, 1.0) * 10

const performanceScore = Math.min(95, Math.max(15, Math.floor(baseScore * 0.85 + completenessBonus)))
```

**How It Works:**
- If you spend $800 of $1000 budget = 80% utilization
- Base score = 80 points
- With 8 components = 10 bonus points
- Final score = (80 × 0.85) + 10 = 78%
- Displayed in animated circular progress bar

### 7. Export Functionality

**File**: `src/services/exportService.js`

#### CSV Export (Lines 13-67)
```javascript
export const exportToCSV = (build, buildName, totalPrice) => {
  // 1. Create CSV headers
  const headers = ['Component Type', 'Name', 'Brand', 'Price', 'Key Specs', 'Amazon Link', 'Newegg Link']

  // 2. Convert components to rows
  const rows = Object.entries(build).map(([type, component]) => [
    type.toUpperCase(),
    component.name,
    component.brand,
    `$${component.price.toFixed(2)}`,
    formatSpecs(component.specs),
    component.vendor_links?.amazon || 'N/A',
    component.vendor_links?.newegg || 'N/A',
  ])

  // 3. Add total row
  rows.push(['TOTAL', '', '', `$${totalPrice.toFixed(2)}`, '', '', ''])

  // 4. Create CSV string
  const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n')

  // 5. Trigger download
  const blob = new Blob([csvContent], { type: 'text/csv' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `${buildName.replace(/\s+/g, '_')}_build.csv`
  link.click()
}
```

#### PDF Export (Lines 78-192)
```javascript
export const exportToPDF = async (build, buildName, totalPrice, compatibilityReport) => {
  // 1. Dynamic import jsPDF (code splitting)
  const { jsPDF } = await import('jspdf')
  await import('jspdf-autotable')

  const doc = new jsPDF()

  // 2. Add title and header
  doc.setFontSize(20)
  doc.text('PC Build Generator', 105, 20, { align: 'center' })
  doc.text(buildName, 105, 30, { align: 'center' })

  // 3. Generate components table with autoTable
  doc.autoTable({
    startY: 45,
    head: [['Type', 'Name', 'Brand', 'Price', 'Key Specs']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [41, 128, 185] }
  })

  // 4. Add compatibility report
  if (compatibilityReport) {
    doc.text('Compatibility Report', 14, finalY + 15)
    // Add issues, warnings, power info
  }

  // 5. Save and download
  doc.save(`${buildName}_build.pdf`)
}
```

---

## Code Walkthrough

### Application Entry Point

**File**: `src/index.js`
```javascript
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'  // Global Tailwind styles
import App from './App'

// Create root and render App
const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

### Root Component

**File**: `src/App.js`
```javascript
export default function App() {
  return (
    // 1. UserProvider wraps entire app for authentication context
    <UserProvider>
      {/* 2. React Router for navigation */}
      <Router>
        <div className="relative min-h-screen text-text-main">
          {/* 3. Navbar on all pages */}
          <Navbar />

          {/* 4. Route definitions */}
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/build" element={<BuildScreen />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/password-reset" element={<PasswordReset />} />
            <Route path="/saved" element={<SavedBuildsScreen />} />
            <Route path="/support" element={<Support />} />
          </Routes>
        </div>
      </Router>
    </UserProvider>
  )
}
```

### User Context (Global State)

**File**: `src/context/UserContext.js`
```javascript
const UserContext = createContext()

export function UserProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Load user from Supabase session on mount
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setUser(session.user)
          setIsAuthenticated(true)
        } else {
          setUser(null)
          setIsAuthenticated(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  // Provide login, logout, logActivity functions
  return (
    <UserContext.Provider value={{ user, isAuthenticated, login, logout, logActivity }}>
      {children}
    </UserContext.Provider>
  )
}

// Custom hook for consuming context
export const useUser = () => useContext(UserContext)
```

**Usage in components:**
```javascript
import { useUser } from '../context/UserContext'

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useUser()

  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome, {user.email}</p>
      ) : (
        <button onClick={() => navigate('/auth')}>Login</button>
      )}
    </div>
  )
}
```

### Supabase Client Setup

**File**: `src/lib/supabase.js`
```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

// Create singleton Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### Component Services

**File**: `src/services/componentService.js`

```javascript
import { supabase } from '../lib/supabase'

// Get all components grouped by type
export const getAllComponents = async () => {
  const { data, error } = await supabase
    .from('components')
    .select('*')
    .order('type', { ascending: true })
    .order('price', { ascending: true })

  // Group by type for easy access
  const grouped = data.reduce((acc, component) => {
    if (!acc[component.type]) {
      acc[component.type] = []
    }
    acc[component.type].push(component)
    return acc
  }, {})

  return { success: true, data: grouped }
}

// Get components by type
export const getComponentsByType = async (type) => {
  const { data, error } = await supabase
    .from('components')
    .select('*')
    .eq('type', type)
    .order('price', { ascending: true })

  return { success: true, data }
}
```

### Custom Modal System

**File**: `src/components/Modal.js`

Replaces browser's `window.confirm()` and `window.prompt()` with themed modals:

```javascript
// Base modal with glassmorphism design
export function Modal({ isOpen, onClose, title, children }) {
  // Prevent body scroll when modal open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
      <div className="rounded-3xl border border-white/15 bg-card-elevated/95">
        <h3>{title}</h3>
        <button onClick={onClose}>✕</button>
        {children}
      </div>
    </div>
  )
}

// Confirmation modal (replaces window.confirm)
export function ConfirmModal({ isOpen, onClose, onConfirm, title, message, isDanger }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <p>{message}</p>
      <button onClick={onClose}>Cancel</button>
      <button onClick={() => { onConfirm(); onClose(); }}>
        Confirm
      </button>
    </Modal>
  )
}

// Prompt modal (replaces window.prompt)
export function PromptModal({ isOpen, onClose, onSubmit, title, message, placeholder }) {
  const [value, setValue] = useState('')

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <p>{message}</p>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
      />
      <button onClick={() => { onSubmit(value); onClose(); }}>
        Submit
      </button>
    </Modal>
  )
}
```

**Usage:**
```javascript
// Old way (browser dialogs)
const confirmed = window.confirm('Delete this build?')
const name = window.prompt('Enter build name')

// New way (themed modals)
<ConfirmModal
  isOpen={deleteModal.isOpen}
  onConfirm={handleDelete}
  title="Delete Build"
  message="Are you sure?"
/>

<PromptModal
  isOpen={promptModal.isOpen}
  onSubmit={handleSave}
  title="Save Build"
  message="Enter a name"
/>
```

---

## Database Schema

**File**: `supabase-schema-updated.sql`

### Tables

#### 1. Users Table
```sql
-- Managed by Supabase Auth
-- Stores: email, encrypted password, metadata
```

#### 2. Components Table
```sql
CREATE TABLE components (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type VARCHAR(50) NOT NULL,           -- cpu, gpu, motherboard, etc.
  name VARCHAR(255) NOT NULL,
  brand VARCHAR(100),
  price DECIMAL(10, 2),
  specs JSONB,                          -- Flexible JSON for component specs
  vendor_links JSONB,                   -- { amazon: "url", newegg: "url" }
  availability VARCHAR(50),
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_components_type ON components(type);
CREATE INDEX idx_components_price ON components(price);
```

**Example Component:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "type": "cpu",
  "name": "AMD Ryzen 5 5600X",
  "brand": "AMD",
  "price": 199.99,
  "specs": {
    "cores": 6,
    "threads": 12,
    "base_clock": "3.7 GHz",
    "boost_clock": "4.6 GHz",
    "socket": "AM4",
    "tdp": 65
  },
  "vendor_links": {
    "amazon": "https://amazon.com/...",
    "newegg": "https://newegg.com/..."
  }
}
```

#### 3. Builds Table
```sql
CREATE TABLE builds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  build_name VARCHAR(255) NOT NULL,
  components JSONB NOT NULL,            -- Complete build object
  total_price DECIMAL(10, 2),
  budget DECIMAL(10, 2),
  compatibility_report JSONB,           -- Issues, warnings, TDP info
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE builds ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own builds"
  ON builds FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own builds"
  ON builds FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own builds"
  ON builds FOR DELETE
  USING (auth.uid() = user_id);
```

**Example Build:**
```json
{
  "id": "456e7890-e89b-12d3-a456-426614174111",
  "user_id": "789e0123-e89b-12d3-a456-426614174222",
  "build_name": "My Gaming PC",
  "components": {
    "cpu": { "id": "...", "name": "Ryzen 5 5600X", "price": 199.99, ... },
    "gpu": { "id": "...", "name": "RTX 3060", "price": 329.99, ... },
    "motherboard": { ... },
    "ram": { ... },
    "storage": { ... },
    "psu": { ... },
    "case": { ... },
    "cooler": { ... }
  },
  "total_price": 1249.99,
  "budget": 1500.00,
  "compatibility_report": {
    "compatible": true,
    "issues": [],
    "warnings": ["PSU wattage lower than recommended"],
    "totalTDP": 265,
    "recommendedPSU": 650
  }
}
```

#### 4. Activity Log Table
```sql
CREATE TABLE activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action VARCHAR(100) NOT NULL,         -- build_saved, user_login, etc.
  details JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## API Integration

### Supabase Client Methods

#### Authentication
```javascript
// Sign up
supabase.auth.signUp({ email, password, options: { data: { full_name } }})

// Sign in
supabase.auth.signInWithPassword({ email, password })

// Sign out
supabase.auth.signOut()

// Get session
supabase.auth.getSession()

// Auth state change listener
supabase.auth.onAuthStateChange((event, session) => { ... })
```

#### Database Queries
```javascript
// Select all
supabase.from('components').select('*')

// Select with filter
supabase.from('components').select('*').eq('type', 'cpu')

// Select with multiple filters
supabase.from('components')
  .select('*')
  .eq('type', 'gpu')
  .gte('price', 200)
  .lte('price', 400)

// Insert
supabase.from('builds').insert({ user_id, build_name, components, total_price })

// Update
supabase.from('builds').update({ build_name: 'New Name' }).eq('id', buildId)

// Delete
supabase.from('builds').delete().eq('id', buildId).eq('user_id', userId)

// Order by
supabase.from('components').select('*').order('price', { ascending: true })
```

---

## Styling & Design System

### Tailwind Configuration

**File**: `tailwind.config.js`

```javascript
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#7c3aed',        // Purple
        secondary: '#0ea5e9',      // Blue
        bg: '#0f172a',             // Dark blue-gray
        'bg-soft': '#111c30',
        'card-bg': '#111c30',
        'card-elevated': '#152238',
        'text-main': '#f8fafc',    // White
        'text-sub': '#94a3b8',     // Gray
        accent: '#38bdf8',         // Light blue
      },
      backgroundImage: {
        'body-gradient': 'linear-gradient(135deg, #0f172a 0%, #111c30 45%, #1e293b 100%)',
        'card-gradient': 'linear-gradient(180deg, rgba(124, 58, 237, 0.12) 0%, rgba(14, 165, 233, 0.08) 100%)'
      },
      boxShadow: {
        glow: '0 20px 45px -15px rgba(14,165,233,0.45)',
      },
      animation: {
        fadeIn: 'fadeIn 0.2s ease-out',
        scaleIn: 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
}
```

### Design Patterns Used

#### Glassmorphism
```jsx
<div className="bg-card-elevated/80 backdrop-blur-8 border border-white/10">
  {/* Semi-transparent background with blur effect */}
</div>
```

#### Responsive Grid
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* 1 column on mobile, 2 on tablet, 3 on desktop */}
</div>
```

#### Hover Effects
```jsx
<button className="bg-primary hover:bg-primary/90 transition-all duration-200">
  Click Me
</button>
```

---

## Performance Optimizations

### 1. Code Splitting
```javascript
// Dynamic import for jsPDF (only loaded when exporting)
const { jsPDF } = await import('jspdf')
```

### 2. Memoization
```javascript
// Prevent unnecessary re-renders
const memoizedValue = useMemo(() => expensiveCalculation(data), [data])
```

### 3. Database Indexing
```sql
CREATE INDEX idx_components_type ON components(type);
CREATE INDEX idx_components_price ON components(price);
```

### 4. Row Level Security
- Database queries automatically filtered by user_id
- No manual filtering needed in application code

---

## Security Features

### 1. Authentication
- JWT tokens managed by Supabase
- Secure password hashing (bcrypt)
- Email verification on signup

### 2. Row Level Security (RLS)
```sql
-- Users can only access their own builds
CREATE POLICY "Users can view own builds"
  ON builds FOR SELECT
  USING (auth.uid() = user_id);
```

### 3. Input Validation
```javascript
// Email validation
if (!email || !email.includes('@')) {
  toast.error('Invalid email')
}

// Password requirements
if (password.length < 6) {
  toast.error('Password must be at least 6 characters')
}

// Budget validation
const normalizedBudget = Number(budgetInput) || 0
if (normalizedBudget < 100) {
  toast.error('Budget must be at least $100')
}
```

### 4. SQL Injection Prevention
- Supabase client uses parameterized queries
- No raw SQL strings constructed from user input

---

## Deployment

### Environment Variables
```env
REACT_APP_SUPABASE_URL=https://xxxxx.supabase.co
REACT_APP_SUPABASE_ANON_KEY=xxxxx
```

### Build Process
```bash
npm run build
# Creates optimized production build in /build directory
# Minified JS, CSS, optimized assets
```

### Hosting Options
- **Vercel** - Recommended for React apps
- **Netlify** - Easy deployment with CI/CD
- **AWS S3 + CloudFront** - For custom infrastructure

---

## Future Enhancements

### Potential Features
1. **Price Tracking** - Monitor component prices over time
2. **Build Comparison** - Compare multiple builds side-by-side
3. **Community Sharing** - Share builds with other users
4. **AI Recommendations** - ML-based component suggestions
5. **Build Templates** - Pre-made builds (Gaming, Workstation, Budget)
6. **Real-time Stock Checking** - Live availability from vendors
7. **Build Notes** - Add custom notes and modifications
8. **3D Build Visualization** - Visual representation of components

---

## Conclusion

The PC Build Generator is a comprehensive full-stack application that combines:
- **Intelligent Algorithms** for build generation and optimization
- **Modern React Patterns** for UI development
- **Supabase Backend** for authentication and data storage
- **Responsive Design** with Tailwind CSS
- **User-Centric Features** like save/edit/export functionality

The application demonstrates proficiency in:
- Frontend development (React, state management, routing)
- Backend integration (Supabase, PostgreSQL, authentication)
- Algorithm design (build generation, compatibility checking)
- UI/UX design (responsive layouts, glassmorphism, animations)
- Software architecture (service-oriented, separation of concerns)

---

**Author**: Jorge Lopez
**Version**: 1.0
**Last Updated**: November 2025
