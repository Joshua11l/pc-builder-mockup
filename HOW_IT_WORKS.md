# PC Build Generator - How It Works

## Overview

The **PC Build Generator** is a web application that automatically generates compatible PC builds based on your budget. It selects the best components, validates compatibility, and lets you save and export your builds.

---

## How It Works

### 1. **Enter Your Budget**
- User inputs their budget (e.g., $1000, $1500, $2000)
- The system validates that the budget is sufficient for a complete build

### 2. **Intelligent Build Generation**
The application uses a smart algorithm to create your PC build:

**Budget Allocation**
- CPU: 18-22% of budget
- GPU: 28-32% of budget (most important for gaming)
- Motherboard: 10-14%
- RAM: 8-12%
- Storage: 8-12%
- PSU: 6-10%
- Case: 4-8%
- Cooler: 2-6%

**Component Selection**
- Scores each component based on performance-per-dollar
- Selects from the top 5 best options with weighted randomization
- Better components have higher probability of selection
- Ensures variety across different builds with the same budget

**Compatibility Checking**
- Validates CPU and motherboard socket compatibility
- Ensures RAM type matches motherboard specifications
- Checks GPU fits inside the selected case
- Verifies PSU provides sufficient wattage for all components
- Confirms cooler supports the CPU socket and TDP

### 3. **View and Customize Your Build**
- See detailed specs for each component
- View vendor links (Amazon, Newegg) to purchase parts
- **Swap components**: Click any part to see compatible alternatives
- **Edit mode**: Toggle to manually change any component
- View compatibility report with warnings and recommendations

### 4. **Save and Export**
- **Login required**: Create an account to save builds
- **Save builds**: Store unlimited builds in the cloud
- **Edit saved builds**: Load and modify any saved build
- **Delete builds**: Remove builds you no longer need
- **Export options**:
  - **PDF**: Professional build sheet with compatibility report
  - **CSV**: Spreadsheet with all component details and vendor links

### 5. **Performance Score**
The system calculates a performance score (15-95%) based on:
- Budget utilization (how much of your budget was spent)
- Component completeness (all 8 components selected)
- Quality of selected components

---

## Technologies Used

### **Frontend**
| Technology | Purpose |
|------------|---------|
| **React 19.1.0** | UI framework for building the interface |
| **React Router 6.30.0** | Navigation between pages (Home, Build, Saved, Auth) |
| **Tailwind CSS 3.4.18** | Modern styling with utility classes |
| **React Icons 5.5.0** | Icons for UI elements |
| **React Toastify 11.0.5** | User notifications (success, error, info) |
| **React Circular Progressbar 2.2.0** | Animated performance score display |

### **Backend & Database**
| Technology | Purpose |
|------------|---------|
| **Supabase** | Complete backend solution |
| **PostgreSQL** | Relational database for storing components and builds |
| **Supabase Auth** | User authentication with JWT tokens |
| **Row Level Security (RLS)** | Secure data access (users only see their own builds) |

### **Export & Utilities**
| Technology | Purpose |
|------------|---------|
| **jsPDF 2.5.1** | Generate PDF documents |
| **jsPDF-AutoTable 3.8.2** | Create tables in PDFs |

### **Build Tools**
| Technology | Purpose |
|------------|---------|
| **Create React App** | Development and build setup |
| **PostCSS** | CSS processing |
| **Autoprefixer** | Cross-browser CSS compatibility |

---

## Application Flow

```
┌─────────────────────────────────────────────────────────────┐
│                      1. USER INPUT                          │
│                   Enter Budget ($1000)                      │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                  2. FETCH COMPONENTS                        │
│          Query Supabase for all PC components              │
│      (CPU, GPU, Motherboard, RAM, Storage, etc.)           │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                 3. BUDGET ALLOCATION                        │
│        Allocate budget across component categories         │
│           (GPU gets most, Cooler gets least)               │
│            Add randomization for variety                    │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              4. COMPONENT SELECTION                         │
│   For each category (CPU → MB → RAM → GPU → etc.):        │
│   • Filter compatible components                           │
│   • Score by performance/price ratio                       │
│   • Select from top 5 with weighted randomization          │
│   • Ensure doesn't exceed remaining budget                 │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              5. COMPATIBILITY CHECK                         │
│   • CPU socket matches motherboard socket                  │
│   • RAM type matches motherboard specs                     │
│   • GPU fits in case (physical dimensions)                 │
│   • PSU provides enough wattage                            │
│   • Cooler supports CPU socket and TDP                     │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│               6. CALCULATE PERFORMANCE                      │
│   Score = (Budget Utilization × 85%) + Completeness Bonus  │
│             Range: 15% to 95%                               │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                  7. DISPLAY BUILD                           │
│   • Show all 8 components with specs                       │
│   • Display vendor links                                   │
│   • Show compatibility report                              │
│   • Animate performance score                              │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              8. USER ACTIONS (Optional)                     │
│   • Swap individual components                             │
│   • Save build (requires login)                            │
│   • Export to PDF/CSV                                      │
│   • Edit and modify saved builds                           │
└─────────────────────────────────────────────────────────────┘
```

---

## Key Features

### **Smart Algorithm**
- **Multi-strategy approach**: Tries 4 different strategies until successful
- **Lookahead budgeting**: Reserves budget for remaining components
- **Randomization**: Same budget produces different builds for variety
- **Fallback handling**: Always provides a working build if budget allows

### **Compatibility System**
Validates 5 critical compatibility constraints:
1. **Socket matching** (CPU ↔ Motherboard)
2. **RAM type matching** (RAM ↔ Motherboard)
3. **Physical dimensions** (GPU ↔ Case)
4. **Power requirements** (PSU ↔ Total TDP)
5. **Cooler support** (Cooler ↔ CPU socket & TDP)

### **User Authentication**
- **Secure registration** with email verification
- **JWT-based authentication** managed by Supabase
- **Password reset** functionality
- **Session persistence** across browser refreshes
- **Row-level security** ensures data privacy

### **Build Management**
- **Save unlimited builds** to your account
- **Edit saved builds** by loading them back into the builder
- **Delete builds** with confirmation modal
- **View all builds** in a responsive grid layout

### **Export System**
- **PDF Export**: Professional document with:
  - Component table with specs
  - Total price breakdown
  - Compatibility report
  - Date generated

- **CSV Export**: Spreadsheet with:
  - All component details
  - Vendor links (Amazon, Newegg)
  - Prices and specifications

---

## Database Structure

### **Components Table**
Stores all available PC parts:
```
- id (UUID)
- type (cpu, gpu, motherboard, ram, storage, psu, case, cooler)
- name (e.g., "AMD Ryzen 5 5600X")
- brand (e.g., "AMD")
- price (199.99)
- specs (JSONB - flexible specs like cores, threads, TDP, socket, etc.)
- vendor_links (JSONB - Amazon, Newegg URLs)
- image_url
```

### **Builds Table**
Stores user-saved builds:
```
- id (UUID)
- user_id (references auth.users)
- build_name (e.g., "My Gaming PC")
- components (JSONB - complete build object)
- total_price (1249.99)
- budget (1500.00)
- compatibility_report (JSONB)
- created_at
```

### **Activity Log Table**
Tracks user actions:
```
- id (UUID)
- user_id
- action (build_saved, user_login, component_swapped, etc.)
- details (JSONB)
- created_at
```

---

## Design System

### **Glassmorphism UI**
- Semi-transparent cards with backdrop blur
- Gradient overlays
- Soft shadows and glows
- Modern, sleek aesthetic

### **Color Palette**
- **Primary**: Purple (#7c3aed)
- **Secondary**: Blue (#0ea5e9)
- **Background**: Dark blue-gray (#0f172a)
- **Accent**: Light blue (#38bdf8)

### **Responsive Breakpoints**
- **xs**: 475px
- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px

### **Animations**
- Fade in on page load
- Scale in for modals
- Smooth transitions on hover
- Animated progress bar

---

## Security Features

### **Authentication Security**
✅ Password minimum 6 characters
✅ Password confirmation on registration
✅ Email verification required
✅ JWT tokens with automatic expiration
✅ Secure session management

### **Database Security**
✅ Row Level Security (RLS) policies
✅ Users can only access their own builds
✅ SQL injection prevention via parameterized queries
✅ Input validation on all forms

### **API Security**
✅ Supabase Anonymous Key (restricted permissions)
✅ Server-side validation
✅ Rate limiting via Supabase

---

## Example: How a $1000 Build is Generated

```javascript
// 1. User inputs budget
budget = $1000

// 2. Budget allocation (with randomization)
cpu:         $200 (20%)
gpu:         $300 (30%)
motherboard: $120 (12%)
ram:         $100 (10%)
storage:     $100 (10%)
psu:         $80  (8%)
case:        $60  (6%)
cooler:      $40  (4%)

// 3. Component selection
CPU: AMD Ryzen 5 5600X ($199) - 6 cores, Socket AM4
Motherboard: MSI B450 ($119) - Socket AM4, DDR4
RAM: Corsair 16GB DDR4 ($99) - 3200MHz, DDR4
GPU: NVIDIA RTX 3060 ($329) - 12GB VRAM
Case: NZXT H510 ($59) - Mid tower, supports 380mm GPU
Storage: Samsung 980 1TB NVMe ($109) - 3500 MB/s read
PSU: EVGA 650W 80+ Gold ($79) - 650W, Gold efficiency
Cooler: Cooler Master Hyzen 212 ($39) - 150W TDP, AM4 support

// 4. Compatibility check
✓ CPU socket (AM4) matches Motherboard socket (AM4)
✓ RAM type (DDR4) matches Motherboard RAM type (DDR4)
✓ GPU length (304mm) fits in Case (max 380mm)
✓ PSU wattage (650W) sufficient for TDP (430W total)
✓ Cooler supports CPU socket (AM4) and TDP (65W)

// 5. Calculate performance
Total spent: $1033 (over budget by $33, algorithm adjusts)
Final total: $987
Budget utilization: 98.7%
Performance score: (98.7% × 85%) + 10% = 93.9%

// 6. Result
Build successfully generated!
Compatible: ✓
Total: $987
Performance: 94%
```

---

## Summary

The PC Build Generator combines an intelligent algorithm with modern web technologies to create an automated, user-friendly PC building experience. It handles the complexity of component compatibility while giving users the flexibility to customize their builds, all backed by a secure cloud database for saving and managing multiple configurations.

**Technologies**: React + Supabase + Tailwind CSS + jsPDF
**Algorithm**: Multi-strategy budget allocation with weighted random selection
**Security**: JWT authentication + Row Level Security
**Features**: Auto-generation + Manual editing + Cloud saves + PDF/CSV export
