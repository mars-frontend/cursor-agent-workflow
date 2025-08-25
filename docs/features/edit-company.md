# Feature Request: Edit Company

## Business Requirements
Users need to edit existing company configurations with comprehensive options including company details, provider services, operational settings, and security restrictions.

## User Stories
- As a logged-in user, I want to open an "Edit Company" modal from the companies listing page
- As a user, I want to modify company information including name, emails, and provider details
- As a user, I want to update provider services and operational settings
- As a user, I want to configure IP restrictions and card brand configurations
- As a user, I want to save changes or cancel modifications to company settings

## Frontend Requirements

### Modal Interface
- **Modal Title:** "Edit Company" displayed prominently at the top
- **Close Button:** 'X' icon positioned at the top right for closing the modal
- **Modal Size:** Centered white dialog box that overlays the companies listing page

### Form Fields

#### Company Identification
- **Company ID:** Read-only text field displaying the company identifier (e.g., "COMP0067")
- **Company Name:** Editable text input field pre-filled with current company name (e.g., "IVS")

#### Contact and Provider Details
- **Company Emails:** Multi-select input field displaying existing email addresses as removable tags
  - Each email tag has an 'X' icon for removal
  - Dropdown arrow for adding new emails or selecting from existing list
- **Provider:** Dropdown field showing current provider selection (e.g., "Digital Currency Systems")
- **Provider Services:** Multi-select input field showing selected services as removable tags
  - Services include: Bill Payment, Barma Withdrawal card, Check Deposit, Wireless Services, Tolling & Transit Services, Digital Gift Cards, Swipe Reload Cards, Prepaid Debit Card Services, Crypto Currency Exchange, Digital Payouts

#### Receipt and Commission Settings
- **Custom Receipt Message:** Text input field for OMNY product receipt customization
- **Commission Rate:** Text input field for "$ Check Free Pay Company Level Commission" (e.g., "0.34")

#### Email Notifications
- **CC for Rejection Emails:** Dropdown field for rejection notification recipients
- **Failed Reversal Notification Emails:** Dropdown field for reversal failure notifications

#### IP and Network Restrictions
- **IP Restriction Toggle:** Toggle switch labeled "Enable IP Restriction for Company" (shows current state)
- **IP Addresses:** Multi-select input field displaying current IP addresses as removable tags
- **IP Range:** Dropdown field for IP range configuration (e.g., "103.149.158.94-103.149.158.99")

#### Card Brand Configuration
- **Netspend GPR Card Brands:** Multi-select input field showing selected GPR card brands as removable tags
- **Netspend DDA Card Brands:** Multi-select input field showing selected DDA card brands as removable tags

#### Transaction Override Settings
- **POS Override Toggle:** Toggle switch for requiring POS override for same teller/store card operations
- **Time in Minutes:** Text input field for override time limit (e.g., "5")

#### Inventory and Product Lists
- **Inventory Replenishment Emails:** Dropdown field for inventory notification recipients
- **Fiserv Product List:**
  - **Payout to Debit Card:** Checkbox with dropdown arrow for configuration
  - **Payout to Bank Account:** Checkbox with dropdown arrow for configuration

### Interactive Features
- **Multi-select Fields:** Selected items display as tags with 'X' removal options
- **Toggle Switches:** Visual feedback for enabled/disabled features (green for on, grey for off)
- **Form Pre-population:** All fields should display current company values
- **Real-time Validation:** Form validation with immediate feedback
- **Modal Overlay:** Proper z-index layering over the companies listing page

### Action Buttons
- **Cancel Button:** Grey text button positioned on the left for discarding changes
- **Save Button:** Green text button positioned on the right for saving modifications

### Responsive Design
- Modal should be properly sized for different screen dimensions
- Form fields should maintain proper spacing and readability on mobile devices
- Multi-select fields and toggle switches should be touch-friendly on mobile
- Action buttons should be easily accessible on all device sizes

## Constraints
- Modal must open/close smoothly without page refresh
- Form must pre-populate with current company data
- All changes must be validated before saving
- Multi-select fields must handle existing selections and new additions
- Toggle switches must reflect current company settings
- Modal should not interfere with background page scrolling
- Form state must be preserved if user navigates away and returns
