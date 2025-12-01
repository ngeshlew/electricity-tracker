# Fuel Tracker Dashboard Audit

**Date:** November 21, 2025  
**Status:** Issues identified and documented

## Executive Summary

This audit identifies missing data, incorrect units, and terminology issues across the fuel tracker dashboard. The main issues are:
- KWH references still present in several components (should be L/litres)
- Missing data fields in topup history (retailer, location, grade, VAT)
- Incorrect UK averages (using electricity values instead of fuel)
- Date formatting issues
- Wrong terminology (electricity vs fuel)

---

## Section-by-Section Audit

### 1. Summary Cards (Top Row)

**Issues Found:**
- ✅ **FIXED:** "Consumption" card shows "0.0 L" - Correct
- ❌ **ISSUE:** "Average" card shows "0.00 KWH" - Should show "L" (litres)
- ✅ **FIXED:** "Cost" card shows "£0.00" - Correct
- ⚠️ **DATA:** All cards show 0.0 values - Expected with only 1 topup, but calculations may need review

**Location:** `src/components/dashboard/SummaryCards.tsx` line 292

**Fix Required:**
- Change "KWH" to "L" in the Average card value display

---

### 3. Consumption Breakdown

**Issues Found:**
- ✅ **CORRECT:** Graph shows data correctly with "LITRES" label
- ⚠️ **DATA:** Weekly breakdown table shows mostly zeros except Week 46 (44.3 L)
  - This is expected behavior - weeks without topups show 0
  - However, the calculation logic may need review for better distribution

**Location:** `src/components/dashboard/ConsumptionBreakdown.tsx`

**Status:** Working as designed, but could be improved

---

### 4. Monthly Overview

**Issues Found:**
- ✅ **CORRECT:** Shows "44.3 Total Litres" - Correct
- ✅ **CORRECT:** Shows "£60.20 Total Cost" - Correct
- ⚠️ **DATA:** Weekly breakdown shows zeros for weeks without topups
  - This is expected but could be confusing to users
  - Consider showing "No data" instead of "0 L"

**Location:** `src/components/dashboard/MonthlyOverview.tsx`

**Status:** Functionally correct, UX could be improved

---

### 5. Performance Section (Annual Progress Cards)

**Issues Found:**
- ❌ **ISSUE:** Shows "0.0 kWh Progress" - Should be "L" (litres)
- ❌ **ISSUE:** Target shows "1189.1 kWh" - Should be litres (fuel target, not electricity)
- ❌ **ISSUE:** "Your Average: 0.0 kWh" - Should be "L"
- ❌ **ISSUE:** "UK Average: 8.5 kWh" - Should be "2.5 L" (fuel average, not electricity)
- ✅ **CORRECT:** Cost values appear correct (£0.00, £2.50)

**Location:** `src/components/dashboard/AnnualProgressCards.tsx`
- Line 109: `{totalConsumption.toFixed(1)} kWh`
- Line 119: `Target: {annualUsageTarget.toFixed(1)} kWh`
- Line 133: `{userAverageDaily.toFixed(1)} kWh`
- Line 137: `{ukAverageDaily} kWh`
- Line 63: `const ukAverageDaily = 8.5; // kWh/day` - Wrong value and unit

**Fix Required:**
- Replace all "kWh" with "L"
- Update UK average from 8.5 kWh/day to 2.5 L/day
- Update annual targets to fuel-specific values

---

### 6. UK Average Comparison Card

**Issues Found:**
- ❌ **ISSUE:** Shows "Your Average: 0.0 kWh" - Should be "L"
- ❌ **ISSUE:** Shows "UK Average: 8.5 kWh" - Should be "2.5 L"
- ❌ **ISSUE:** Tooltip mentions "8.5 kWh/day for average UK household" - Wrong unit and value
- ✅ **CORRECT:** Cost comparison appears correct

**Location:** `src/components/dashboard/UKAverageComparison.tsx`
- Line 25: `const ukAverageDaily = 8.5; // kWh/day` - Wrong
- Line 29: `sum + point.kwh` - Should be `point.litres`
- Line 104: `{userAverageDaily.toFixed(1)} kWh`
- Line 108: `{ukAverageDaily} kWh`
- Line 97: Tooltip text mentions "8.5 kWh/day"

**Fix Required:**
- Replace all "kWh" with "L"
- Update UK average to 2.5 L/day
- Update tooltip text
- Fix chartData to use `litres` instead of `kwh`

---

### 7. Seasonal Consumption Comparison

**Issues Found:**
- ❌ **ISSUE:** Subtitle says "Compare your **electricity usage** across different seasons"
- Should say "Compare your **fuel consumption** across different seasons"
- ⚠️ **DATA:** Shows "NO SEASONAL DATA AVAILABLE" - Expected with only 1 topup

**Location:** `src/components/dashboard/SeasonalTracker.tsx`
- Line 208: "Compare your electricity usage across different seasons"
- Line 232: "Compare your electricity usage across different seasons"
- Line 16: `import { useElectricityStore }` - Should be `useFuelStore`
- Line 45: `useElectricityStore()` - Should be `useFuelStore()`

**Fix Required:**
- Change "electricity usage" to "fuel consumption"
- Update store import and usage

---

### 8. Topup History Table

**Issues Found:**
- ❌ **MISSING DATA:** Retailer column shows "-" (empty)
- ❌ **MISSING DATA:** Location column shows "-" (empty)
- ❌ **MISSING DATA:** Grade column shows "-" (empty)
- ❌ **MISSING DATA:** Net Price column shows "-" (empty)
- ❌ **MISSING DATA:** VAT column shows "-" (empty)
- ❌ **MISSING DATA:** Mileage column shows "-" (empty)
- ✅ **CORRECT:** Litres, Cost/Litre, Total Cost, Fuel Type display correctly

**Root Cause:**
The topup was created without these fields being filled in the form, OR the form is not properly saving these fields to the backend.

**Location:** `src/components/fuel-topup/FuelTopupsLog.tsx` - Display logic is correct
**Location:** `src/components/fuel-topup/FuelTopupForm.tsx` - Need to verify form submission

**Fix Required:**
- Verify form is collecting retailer, location, grade, VAT fields
- Verify form is submitting these fields to the backend
- Verify backend is saving these fields
- Test adding a new topup with all fields filled

---

### 9. Consumption Chart (Weekly Consumption)

**Issues Found:**
- ❌ **ISSUE:** Tooltip shows "kWh" instead of "L"
- ⚠️ **DATA:** Chart shows minimal data - Expected with only 1 topup

**Location:** `src/components/dashboard/ConsumptionChart.tsx`
- Line 51: `{data.consumption.toFixed(2)} kWh` - Should be "L"
- Line 89: `value: 'kWh'` - Should be "Litres" or "L"

**Fix Required:**
- Replace "kWh" with "L" in tooltip and axis labels

---

## Summary of Required Fixes

### High Priority (Data/Unit Errors)
1. ✅ Fix "Average" card showing "KWH" → "L"
2. ✅ Fix AnnualProgressCards showing "kWh" → "L" and wrong UK average
3. ✅ Fix UKAverageComparison showing "kWh" → "L" and wrong UK average
4. ✅ Fix ConsumptionChart tooltip showing "kWh" → "L"
5. ✅ Fix SeasonalTracker terminology "electricity usage" → "fuel consumption"
6. ✅ Fix SeasonalTracker using wrong store (useElectricityStore → useFuelStore)

### Medium Priority (Data Display)
9. ⚠️ Investigate why topup history fields are empty (retailer, location, grade, VAT)

### Low Priority (UX Improvements)
10. Consider showing "No data" instead of "0 L" for weeks without topups
11. Review calculation logic for better data distribution across weeks

---

## Testing Checklist

After fixes are applied, verify:
- [ ] All "kWh" references replaced with "L"
- [ ] UK averages show 2.5 L/day (not 8.5 kWh/day)
- [ ] Annual targets are fuel-specific (not electricity)
- [ ] Topup form saves all fields (retailer, location, grade, VAT)
- [ ] Topup history displays all saved fields
- [ ] All terminology says "fuel consumption" not "electricity usage"
- [ ] All components use `useFuelStore` not `useElectricityStore`

---

## Notes

- Most issues are unit/terminology related (kWh → L)
- The empty fields in topup history suggest the form may not be saving all data
- Some "0" values are expected with limited data, but UX could be improved
