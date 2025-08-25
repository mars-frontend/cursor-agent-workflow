# Feature Request: Company Details View

## Business Requirements
Users need to view comprehensive company information including company details, provider services, financial configurations, and associated store listings in a read-only modal interface.

## User Stories
- As a logged-in user, I want to open a "Company details" modal from the companies listing page
- As a user, I want to view all company information including contact details and provider services
- As a user, I want to see financial details like commission rates and product fees
- As a user, I want to browse the list of stores associated with the company
- As a user, I want to search through the company's store list for specific locations

## Frontend Requirements

### Modal Interface
- **Modal Title:** "Company details" displayed prominently at the top
- **Close Button:** 'X' icon positioned at the top right for closing the modal
- **Modal Size:** Large modal window centered on screen with two-panel layout
- **Modal Footer:** "CLOSE" button positioned at the bottom right

### Two-Panel Layout

#### Left Panel - Company Information
- **Company Identification:**
  - **Company ID:** Read-only text displaying company identifier (e.g., "COMP0067")
  - **Company Name:** Read-only text displaying company name (e.g., "IVS")

- **Contact and Provider Details:**
  - **Company Email:** Multi-line display of company email addresses
  - **Provider:** Read-only text showing provider name (e.g., "Digital Currency Systems")
  - **Provider Service:** Multi-line text area displaying all provider services

- **Product and Service Configuration:**
  - **Custom Receipt Message:** Read-only text field for OMNY product customization
  - **Check Free Pay Company Level Commission:** Read-only text showing commission rate (e.g., "$0.34")
  - **Failed Reversal Notification Email(s):** Read-only text field for notification emails

- **Card Brand Configuration:**
  - **Netspend GPR Card Brands:** Read-only text displaying selected GPR card brands
  - **Netspend DDA Card Brands:** Read-only text displaying selected DDA card brands

- **Inventory and Product Lists:**
  - **Inventory Replenishment Email(s):** Read-only text field for inventory notifications
  - **Fiserv Product List:**
    - **Payout to Debit Card:** Detailed fee breakdown (Company Fee, Commission, Consumer Fee)
    - **Payout to Bank Account:** Detailed fee breakdown (Company Fee, Commission, Consumer Fee)

#### Right Panel - Store List
- **Store List Section:**
  - **Section Title:** "Store List" displayed prominently
  - **Search Functionality:** "Search store here" input field with search icon
  - **Store Listing:** Numbered list of stores (e.g., "1. IVS store 52", "2. ivs_testStore_11")
  - **Show More Link:** "Show More" link for paginating through additional stores

### Data Display Format
- **Provider Services:** Multi-line text area showing comma-separated service list
- **Financial Information:** Currency formatting for fees and commission rates
- **Store List:** Numbered list format with store names
- **Email Addresses:** Multi-line display for multiple email addresses

### Interactive Features
- **Store Search:** Real-time search functionality within the store list
- **Modal Overlay:** Proper z-index layering over the companies listing page
- **Responsive Layout:** Two-panel layout that adapts to different screen sizes
- **Scrollable Content:** Both panels should handle overflow content gracefully

### Responsive Design
- Modal should be properly sized for different screen dimensions
- Two-panel layout should stack vertically on mobile devices
- Store search should remain accessible on all device sizes
- Modal content should be scrollable on smaller screens

## Constraints
- Modal must open/close smoothly without page refresh
- All company data must be displayed in read-only format
- Store search must provide real-time filtering results
- Modal should not interfere with background page scrolling
- Two-panel layout must maintain proper proportions on all screen sizes
- Store list pagination should handle large numbers of stores efficiently
- Financial data must be properly formatted with currency symbols
