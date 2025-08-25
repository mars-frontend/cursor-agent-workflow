# Feature Request: Add Company

## Business Requirements
Users need to add new companies to the system with comprehensive configuration options including company details, provider services, and operational settings.

## User Stories
- As a logged-in user, I want to open an "Add Company" modal from the companies listing page
- As a user, I want to fill out company information including name, emails, and provider details
- As a user, I want to select multiple provider services for the company
- As a user, I want to configure company-specific settings like commission rates and email notifications
- As a user, I want to enable/disable various operational features through toggle switches

## Frontend Requirements

### Modal Interface
- **Modal Title:** "Add Company" displayed prominently at the top left
- **Close Button:** 'X' icon positioned at the top right for closing the modal
- **Modal Size:** Centered white dialog box that overlays the companies listing page

### Form Fields

#### Company Information
- **Company Name:** Required text input field labeled "Company Name *"
- **Company Emails:** Text input field for company email addresses

#### Provider Configuration
- **Provider:** Required dropdown field labeled "Provider*" (e.g., "Digital Currency Systems")
- **Provider Service:** Multi-select field labeled "Provider Service *" with selected services displayed as removable tags

#### Provider Services Available
- Bill Payment
- Barma Withdrawal card
- Check Deposit
- Wireless Services
- Tolling & Transit Services
- Digital Gift Cards
- Swipe Reload Cards
- Prepaid Debit Card Services
- Crypto Currency Exchange
- Digital Payouts

#### Company Settings
- **Custom Receipt Message:** Text input for OMNY product receipt customization
- **Commission Rate:** Numeric input field for "$ Check Free Pay Company Level Commission" (default: 0.00)
- **CC for Rejection Emails:** Dropdown field for rejection notification recipients
- **Failed Reversal Notification Emails:** Dropdown field for reversal failure notifications

#### Operational Features
- **IP Restriction:** Toggle switch labeled "Enable IP Restriction for Company" (default: off)
- **Netspend GPR Card Brands:** Dropdown field for GPR card brand selection
- **Netspend DDA Card Brands:** Dropdown field for DDA card brand selection
- **POS Override Requirement:** Toggle switch for requiring POS override for same teller/store card operations

### Interactive Features
- **Multi-select Provider Services:** Selected services display as grey tags with 'X' removal option
- **Toggle Switches:** Visual feedback for enabled/disabled features (grey for off, colored for on)
- **Form Validation:** Required field indicators (*) and validation feedback
- **Modal Overlay:** Proper z-index layering over the companies listing page

### Responsive Design
- Modal should be properly sized for different screen dimensions
- Form fields should maintain proper spacing and readability on mobile devices
- Toggle switches and dropdowns should be touch-friendly on mobile

## Constraints
- Modal must open/close smoothly without page refresh
- Form validation must provide immediate feedback
- Multi-select provider services must handle at least 10 different service types
- Toggle switches must provide immediate visual state changes
- Modal should not interfere with background page scrolling
