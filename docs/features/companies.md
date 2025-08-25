# Feature Request: Companies listing

## Business Requirements
Users need a company listing to view company listing, pagination, search and add company action.

## User Stories
- As a logged-in user, I want to see company listing with pagination
- As a user, I want quick access to common actions (sort by company id, company name, active stores, search by company id, company name)
- As a user, I want to see add company button

## Frontend Requirements

### UI Components
- **Header Section:**
  - Page title "Companies" displayed prominently
  - Quick search bar with magnifying glass icon
  - Add Company button (green circular button with plus icon)

### Data Table Display
- **Table Columns:**
  - Company ID (sortable, with sort indicator)
  - Company Name
  - Active Stores (numeric count)
  - Active/Inactive (toggle switch)
  - Actions (Edit pencil icon, View eye icon)

### Interactive Features
- **Search Functionality:**
  - Quick search bar for filtering companies
  - Search by company ID or company name
- **Sorting:**
  - Sortable columns with visual indicators
  - Default sort by Company ID (ascending)
- **Pagination:**
  - Rows per page selector (default: 15)
  - Navigation arrows for page navigation
  - Display current range and total count (e.g., "1-15 of 69")
- **Status Management:**
  - Toggle switches for Active/Inactive status
  - Visual feedback (green for active, grey for inactive)

### Responsive Design
- Table must be mobile responsive
- Actions column should remain accessible on small screens
- Search and add button should be properly positioned on mobile

## Constraints
- Must load in under 2 seconds
- Must be mobile responsive
- Table should handle at least 69 companies with smooth pagination
- Toggle switches should provide immediate visual feedback