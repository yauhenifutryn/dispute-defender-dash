

# Updated Plan: Add "Scan Inbox for Disputes" to Main Dashboard

This feature will be part of the initial dashboard build since the app hasn't been implemented yet. Here's the full scope including the new scan feature:

## Everything from the Original Plan
All previously planned features (sidebar, dashboard table, detail view, status badges, economics widget, HITL block, God Mode) remain unchanged.

## New Addition: "Scan Inbox for Disputes" Button

### Location
- Prominent button in the Dashboard header area, next to the page title — styled with the primary indigo/blue accent color and a `Radar` or `ScanSearch` Lucide icon.

### Click Behavior
1. **Scanning State (3 seconds)**: Button text changes to "Scanning Inbox…" with a spinning/pulsing icon animation. Button becomes disabled during scan.
2. **After 3 seconds**: A new mock dispute is generated (randomized vendor name/category from a pool) with status `SCANNED_MATCH` and injected at the top of the disputes list.
3. **Success Toast**: A Sonner toast fires — e.g., *"New dispute found! Flight delay claim against Ryanair detected."*
4. **Button resets** to its idle state, ready for another scan.

### Mock Data Generation
- Picks randomly from a small pool of vendors (e.g., Ryanair, DHL, Amazon, EasyJet) and categories (flight_delay, damaged_parcel, late_delivery).
- Assigns a random estimated value ($30–$250).
- Sets today's date and `SCANNED_MATCH` status.

### State Management
- Uses the same React `useState` array that holds all mock disputes, so the new entry appears seamlessly in the table and is clickable to open the detail view like any other dispute.

