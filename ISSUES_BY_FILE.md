# 3kpsy Code Review - Issues by File

## App.svelte
**File:** `/src/App.svelte`

### Issues Found:

#### CRITICAL: Modal State Race Condition (Lines 17-23)
```javascript
let tsBarnumModalOpen = $state(false);
let deepWorkModalOpen = $state(false);
let sleepModalOpen = $state(false);
let projectsModalOpen = $state(false);
```
**Problem:** 4 independent states can conflict
**Fix:** Use single `activeModal` state

#### MINOR: No Error Handling for Refresh (Lines 34-40)
```javascript
async function handleRefresh() {
  await Promise.all([...]);
  // No try-catch, no error display
}
```
**Fix:** Add error handling and user feedback

---

## auth.js
**File:** `/src/stores/auth.js`

### Issues Found:

#### CRITICAL: Memory Leak - Unsubscribe Not Called (Lines 17-24, 67-69)
```javascript
const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
  // ...
});

function cleanupAuth() {
  unsubscribe(); // Exists but never called
}
```
**Problem:** Listener never unsubscribed, accumulates on sign out
**Fix:** Call `cleanupAuth()` in App.svelte $effect

---

## firebase.js
**File:** `/src/stores/firebase.js`

### Issues Found:

#### IMPORTANT: Offline Persistence Not Enabled (Lines 28-32)
```javascript
// Note: offline persistence is enabled by default in modern Firebase
// ^^^ THIS IS WRONG - it's NOT enabled by default
export const db = getFirestore(app);
```
**Problem:** Comment is misleading, persistence actually disabled
**Fix:** Call `enableIndexedDbPersistence(db)`

---

## metrics.js
**File:** `/src/stores/metrics.js`

### Issues Found:

#### MINOR: Error Handling Incomplete (Lines 84-87, 115-117, etc)
```javascript
catch (error) {
  console.error('Failed to save daily metrics:', error);
  throw error;
}
```
**Problem:** Errors thrown but no user feedback
**Fix:** Add error state to store or use toast notifications

#### MINOR: Missing Validation (Line 37)
```javascript
milestone: newMilestone.trim(),
```
**Problem:** No max length, no character validation
**Fix:** Validate length before saving

---

## Modal.svelte
**File:** `/src/components/Modal.svelte`

### Issues Found:

#### MINOR: Missing Keyboard Focus Management (Lines 14-18)
```javascript
function handleKeydown(e) {
  if (e.key === 'Escape') {
    close();
  }
}
```
**Problem:** No focus trap, focus not restored on close
**Fix:** Add focus management logic

#### MINOR: Focus Window Instead of Modal (Line 21)
```svelte
<svelte:window onkeydown={handleKeydown} />
```
**Problem:** Should focus modal element itself
**Fix:** Attach to modal div instead

---

## TsBarnumModal.svelte
**File:** `/src/components/TsBarnumModal.svelte`

### Issues Found:

#### CRITICAL: No Error Handling (Lines 14-33)
```javascript
function incrementProgress() {
  projectsMetrics.update(m => {
    m.tsBarnum = Math.min(100, m.tsBarnum + 5);
    return m;
  });
  saveProjectsMetrics(); // No await, no error handling
}
```
**Problem:** Silent failure on network error
**Fix:** Add async/await with try-catch

#### CRITICAL: Duplicate Code with RoadmapModal
**Problem:** 380 lines duplicated from RoadmapModal
**Fix:** Keep this file, delete RoadmapModal

#### IMPORTANT: Missing Type Safety (Line 10)
```javascript
let { isOpen = $bindable(false) } = $props();
```
**Fix:** Add JSDoc type definition

#### IMPORTANT: Input Not Validated (Line 37)
```javascript
if (!newMilestone.trim()) return;
```
**Problem:** No max length, no character checks
**Fix:** Add validation constraints

#### IMPORTANT: CSS Duplication (Lines 156-379)
```scss
.modal { /* 200+ lines duplicated with DeepWorkModal, etc */ }
```
**Fix:** Move to shared Modal.svelte styles

#### MINOR: Unused z-index (Line 165)
```scss
z-index: calc(var(--z-index-modal) + 2);
```
**Problem:** Inconsistent with other modals
**Fix:** Standardize z-index strategy

#### MINOR: Hardcoded Color (Line 234)
```scss
background: rgba(var(--color-accent), 0.2);
```
**Note:** OK as using CSS variable, but could be more consistent

---

## RoadmapModal.svelte
**File:** `/src/components/RoadmapModal.svelte`

### Status: DELETE THIS FILE

**Issues:**
- IMPORTANT: 350-line file with no imports in codebase
- CRITICAL: Duplicate of TsBarnumModal functionality
- MINOR: Same bugs as TsBarnumModal (no error handling)

**Action:** Delete `/src/components/RoadmapModal.svelte`

---

## DeepWorkModal.svelte
**File:** `/src/components/DeepWorkModal.svelte`

### Issues Found:

#### CRITICAL: No Error Handling (Lines 13-21)
```javascript
function increment() {
  dailyMetrics.update(m => {
    if (m.deepWork < 24) m.deepWork += 0.5;
    return m;
  });
  saveDailyMetrics(); // No error handling
}
```
**Fix:** Add async/await, try-catch, loading state

#### IMPORTANT: Inconsistent Modal Structure (Lines 41-71)
```svelte
{#if isOpen}
  <div class="modal" role="dialog" aria-labelledby="modal-title">
  <!-- Own implementation of modal -->
{/if}
```
**Problem:** Doesn't use base Modal.svelte component
**Fix:** Refactor to use Modal.svelte

#### MINOR: Missing Type Safety (Line 10)
```javascript
let { isOpen = $bindable(false) } = $props();
```
**Fix:** Add JSDoc @type annotation

#### MINOR: Duplicate CSS with Other Modals (Lines 73-150)
```scss
.modal { /* Same styles as TsBarnumModal */ }
.btn { /* Repeated in 4 modals */ }
```
**Fix:** Extract to shared component/stylesheet

---

## SleepModal.svelte
**File:** `/src/components/SleepModal.svelte`

### Issues Found:

#### CRITICAL: No Error Handling (Lines 22-28, 31-37)
```javascript
function updateWakeUp(event) {
  dailyMetrics.update(m => {
    m.wakeUp = event.target.value;
    return m;
  });
  saveDailyMetrics(); // No error handling
}
```
**Fix:** Add async/await, try-catch

#### IMPORTANT: No Input Validation
**Problem:** Time inputs have no constraints
**Fix:** Add min/max attributes or validation

#### IMPORTANT: Inconsistent Modal (Lines 52-100)
**Problem:** Custom modal implementation instead of using Modal.svelte
**Fix:** Use base Modal component

#### IMPORTANT: Duplicate CSS (Lines 102-250)
**Problem:** `.modal`, `.field`, `input[type="time"]` styles repeated
**Fix:** Extract to shared stylesheets

#### MINOR: Missing Type Safety (Line 10)
**Fix:** Add JSDoc @type annotation

---

## ProjectsModal.svelte
**File:** `/src/components/ProjectsModal.svelte`

### Issues Found:

#### CRITICAL: No Error Handling (Lines 13-20, 33-39)
```javascript
function incrementCompleted() {
  projectsMetrics.update(m => {
    m.completed++;
    return m;
  });
  saveProjectsMetrics(); // No error handling
}
```
**Fix:** Add async/await, try-catch, loading state

#### IMPORTANT: Inconsistent Modal Structure
**Problem:** Custom implementation instead of Modal.svelte
**Fix:** Use base Modal component

#### IMPORTANT: Duplicate CSS (Lines 116-224)
**Problem:** Modal and button styles duplicated
**Fix:** Extract to shared styles

#### MINOR: Missing Type Safety (Line 10)
**Fix:** Add JSDoc @type annotation

---

## WeeklyChart.svelte
**File:** `/src/components/WeeklyChart.svelte`

### Issues Found:

#### IMPORTANT: Hardcoded Colors (Lines 67-68, 77-78, 104, 131, 137, 150)
```javascript
borderColor: '#3ccaa0', // Should use CSS variable
backgroundColor: 'rgba(60, 202, 160, 0.15)',
// ... more hardcoded colors
```
**Problem:** Colors not derived from design system
**Fix:** Export colors from store or use CSS variables

#### IMPORTANT: No Error Handling (Lines 43-46)
```javascript
function createChart() {
  if (!chartCanvas) return;
  // If Chart.js fails to load, whole component breaks
}
```
**Fix:** Add try-catch for Chart.js initialization

#### MINOR: Missing Type Safety (Lines 12-15)
```javascript
let chartCanvas = $state(null);
let chart;
let loading = $state(true);
let weeklyData = $state([]);
```
**Fix:** Add JSDoc types

#### MINOR: Magic Numbers (Lines 167-168)
```javascript
min: 4,  // 4:00 AM - should be constant
max: 12  // 12:00 PM - should be constant
```
**Fix:** Extract to named constants

#### MINOR: Accessibility Issue (Line 187)
```svelte
<canvas bind:this={chartCanvas}></canvas>
```
**Fix:** Add `role="img"` and `aria-label`

#### MINOR: Hardcoded Height (Line 228)
```scss
height: 30rem;
```
**Fix:** Could be CSS variable

---

## PullToRefresh.svelte
**File:** `/src/components/PullToRefresh.svelte`

### Issues Found:

#### MINOR: Inline Styles with Hardcoded Values (Line 100)
```svelte
style="transform: translateY({pullDistance}px); transition: {isDragging ? 'none' : 'transform 0.3s ease-out'}"
```
**Problem:** Transition value hardcoded
**Fix:** Use CSS variable for transition

#### MINOR: Magic Numbers (Lines 19-20)
```javascript
const PULL_THRESHOLD = 80;
const MAX_PULL = 120;
```
**Note:** Already extracted to constants, GOOD

#### MINOR: Missing Type Safety (Line 10)
```javascript
let { onRefresh = async () => {}, children } = $props();
```
**Fix:** Add JSDoc @type annotation

---

## MetricCard.svelte
**File:** `/src/components/MetricCard.svelte`

### Issues Found:

#### IMPORTANT: Accessibility Issue (Line 21)
```svelte
<button class="metric__row" onclick={onOpenModal}>
```
**Problem:** No aria-label explaining what opens
**Fix:** Add `aria-label="Edit {title}"`

#### MINOR: Using @html for Value (Line 23)
```svelte
<span class="value">{@html value}</span>
```
**Note:** OK for this use case since only displaying metrics, but be careful

---

## Drawer.svelte
**File:** `/src/components/Drawer.svelte`

### Issues Found:

#### MINOR: Test Code in Production UI (Lines 72-78)
```svelte
<button class="nav-item" onclick={handleSeedTestData} disabled={isSeeding}>
  <span class="nav-label">{isSeeding ? 'seeding...' : 'seed test data'}</span>
</button>
```
**Problem:** Test utility exposed in production
**Fix:** Hide behind `{#if import.meta.env.DEV}`

#### MINOR: No Loading Spinner (Line 77)
```svelte
<span class="nav-label">{isSeeding ? 'seeding...' : 'seed test data'}</span>
```
**Problem:** Just text, no spinner
**Fix:** Add loading indicator

---

## _base.scss
**File:** `/src/styles/base/_base.scss`

### Issues Found:

#### MINOR: Unused CSS Variables (Lines 59-69)
```scss
--font-size-xxxs: 1rem;      // UNUSED
--font-size-base: 1.8rem;    // UNUSED
--shadow-hover: ...;          // UNUSED
--font-size-h1 through h3: ... // UNUSED (semantic aliases)
```
**Fix:** Delete unused variables

#### MINOR: Duplicated Semantic Aliases (Lines 72-75)
```scss
--font-size-p: var(--font-size-base);
--font-size-h3: var(--font-size-l);
--font-size-h2: var(--font-size-xl);
--font-size-h1: var(--font-size-xxl);
```
**Problem:** These semantic names never used
**Fix:** Remove or use consistently

---

## metrics.test.js
**File:** `/src/stores/metrics.test.js`

### Issues Found:

#### MINOR: Emoji in Console Logs (Lines 27, 32, 106, etc)
```javascript
console.log('✅ Test data seeded successfully!');
```
**Note:** OK for development but could be cleaner

#### MINOR: No Input Validation (Lines 35-78)
```javascript
const testData = [
  { deepWork: 0.5, ... },
  // No validation that these values are reasonable
];
```
**Fix:** Add basic validation for test data

---

## Summary: Files Needing Changes

### DELETE (1 file)
- `/src/components/RoadmapModal.svelte` - 350 lines

### CRITICAL FIXES (6 files)
1. `/src/App.svelte` - Modal state, refresh error handling
2. `/src/stores/auth.js` - Cleanup listener
3. `/src/components/TsBarnumModal.svelte` - Error handling
4. `/src/components/DeepWorkModal.svelte` - Error handling
5. `/src/components/SleepModal.svelte` - Error handling
6. `/src/components/ProjectsModal.svelte` - Error handling

### IMPORTANT FIXES (8 files)
1. `/src/stores/firebase.js` - Enable persistence
2. `/src/components/Modal.svelte` - Focus management
3. `/src/components/WeeklyChart.svelte` - Colors, error handling, accessibility
4. `/src/styles/base/_base.scss` - Consolidate modals
5. `/src/components/MetricCard.svelte` - Accessibility
6. `/src/components/TsBarnumModal.svelte` - Type safety, validation, CSS
7. `/src/components/DeepWorkModal.svelte` - Type safety, CSS
8. `/src/components/SleepModal.svelte` - Type safety, CSS

### MINOR FIXES (4+ files)
1. `/src/components/PullToRefresh.svelte` - Inline styles, types
2. `/src/components/Drawer.svelte` - Test code visibility
3. `/src/styles/base/_base.scss` - Unused variables
4. All modals - Function naming consistency

---

## Estimated Changes Required

- **Lines to Add:** ~150-200 (error handling, types, validation)
- **Lines to Delete:** ~700+ (duplicates, unused CSS)
- **Lines to Modify:** ~300-400 (refactoring, consolidation)
- **New Files:** 2-3 (extracted styles, utilities)

**Net Result:** ~200-300 fewer lines, much cleaner code

