# Flutter App Update To-Do List

Use this checklist to bring the Flutter application in line with the latest web & backend updates for Sujatha Caterers.

## 1. Backend & Data Models
- [ ] **Update Order Model**: Modify the local `Order` class/model to match the updated backend schema.
    - [ ] Add `variant` (String) to the `mealBox` object.
    - [ ] Add `deliveryMode` (String) to the `mealBox` object.
    - [ ] Ensure `taxes` object inside `mealBox` supports `cgst` and `sgst` fields.

## 2. Meal Box Feature
- [ ] **Update Minimum Quantity**: Change the minimum order quantity logic from 5 to **1**.
- [ ] **Implement Variants**:
    - [ ] Add a selector for **Premium (₹199)** vs **Classic (₹179)**.
    - [ ] **Premium Logic**: Includes *Veg Biryani, Veg Kurma, Raitha*.
    - [ ] **Classic Logic**: Replaces the above 3 items with *Pulihora*.
- [ ] **Implement Delivery Modes**:
    - [ ] Add a toggle for **Pickup** vs **Door Delivery**.
    - [ ] **Pickup Mode**: Show a dropdown with these fixed locations:
        - Taraka Rama Nagar - 10th Line
        - Tanvika Function Hall - Ala Hospital Backside
        - Sujatha Convention - Vidya Nagar Main Road
        - Near SBI Bank, Pattabhipuram
        - Sujatha Caterers Main Kitchen, Guntur
    - [ ] **Door Delivery Mode**: Show address input form and a banner: *"Delivery charges to be paid directly to Rapido rider."*
- [ ] **Update API Payload**: Ensure `POST /api/orders` sends the new `variant` and `deliveryMode` fields in the `mealBox` object.

## 3. Catering / Breakfast Menu Logic
- [ ] **Update Package Rules**:
    - [ ] **Basic**: Allow only Idly, Vada, Upma.
    - [ ] **Classic**: Add Pongal and 1 Sweet.
    - [ ] **Premium**: Add Dosa (along with previous items).
    - [ ] **Luxury**: Add Mysore Bonda + Auto-include Tea & Coffee.
- [ ] **Implement Mutual Exclusion**:
    - [ ] Prevent users from selecting both **Pongal** and **Upma**. If one is selected, show a warning or deselect the other.
- [ ] **Update Complimentary Logic**:
    - [ ] **Basic/Classic/Premium**: Force user to select **one** drink (Tea OR Coffee). Store/Send as `Opted-drink`.
    - [ ] **Luxury**: Automatically include both Tea and Coffee (do not show selection).

## 4. Pricing & Taxes
- [ ] **Update GST Logic**:
    - [ ] Change global GST calculation to **5% total** (2.5% CGST + 2.5% SGST).
    - [ ] Apply this 5% rule to both Catering and Meal Box orders.
- [ ] **Update Platform Fee**: Ensure a fixed platform fee (e.g., ₹15) is applied if consistent with web logic.

## 5. UI / Display Updates
- [ ] **Order History / Profile**:
    - [ ] Display **"Pickup Loc:"** label if `deliveryMode` is 'pickup', otherwise **"Delivery Loc:"**.
    - [ ] Show **Variant** and **Delivery Mode** in the Meal Box order card.
- [ ] **Invoice Screen**:
    - [ ] Update layout to support Meal Box orders (list items as tags/chips).
    - [ ] Show breakdown of Variant and Quantity for Meal Box invoices.