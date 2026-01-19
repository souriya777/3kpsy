# 3kpsy Code Review - Actionable Checklist

## CRITICAL ISSUES - Fix First

### [ ] 1. Duplicate Modal Implementation (TsBarnumModal vs RoadmapModal)
**Files:**
- `/src/components/TsBarnumModal.svelte` (380 lines) - KEEP
- `/src/components/RoadmapModal.svelte` (350 lines) - DELETE

**Action Items:**
- [ ] Delete `/src/components/RoadmapModal.svelte`
- [ ] Verify RoadmapModal not imported anywhere (already confirmed)
- [ ] Keep TsBarnumModal as single source of truth for roadmap

**Time Estimate:** 5 minutes

---

### [ ] 2. Missing Error Handling & Loading States
**Files to Update:**
- `/src/components/DeepWorkModal.svelte` - increment/decrement
- `/src/components/SleepModal.svelte` - updateWakeUp/updateSleep
- `/src/components/ProjectsModal.svelte` - all increment/decrement
- `/src/components/TsBarnumModal.svelte` - increment/decrement

**Action Items:**
```javascript
// Before:
function increment() {
  dailyMetrics.update(m => { m.deepWork += 0.5; return m; });
  saveDailyMetrics(); // Silent fail
}

// After:
let isSaving = $state(false);
async function increment() {
  isSaving = true;
  try {
    dailyMetrics.update(m => { m.deepWork += 0.5; return m; });
    await saveDailyMetrics();
  } catch (error) {
    console.error('Failed to save:', error);
    // TODO: Show toast notification
  } finally {
    isSaving = false;
  }
}
```

**Checklist:**
- [ ] Add `let isSaving = $state(false)` to each modal
- [ ] Make all save calls `await` with try-catch
- [ ] Disable buttons during save: `disabled={isSaving}`
- [ ] Add error state: `let error = $state(null)`
- [ ] Test offline scenario

**Time Estimate:** 45 minutes

---

### [ ] 3. Modal State Race Condition
**File:** `/src/App.svelte` (lines 17-23)

**Current Problem:**
```javascript
let tsBarnumModalOpen = $state(false);
let deepWorkModalOpen = $state(false);
let sleepModalOpen = $state(false);
let projectsModalOpen = $state(false);
```

**Solution:**
```javascript
let activeModal = $state(null); // null | 'tsBarnum' | 'deepWork' | 'sleep' | 'projects'

function openModal(name) {
  activeModal = name;
}

function closeModal() {
  activeModal = null;
}
```

**Then update render logic:**
```svelte
{#if activeModal === 'tsBarnum'}
  <TsBarnumModal bind:isOpen={activeModal} />
{/if}
```

**Action Items:**
- [ ] Replace 4 boolean states with 1 activeModal state
- [ ] Create openModal() and closeModal() functions
- [ ] Update all modal open calls: `onclick={() => openModal('tsBarnum')}`
- [ ] Update modal bindings to check activeModal value
- [ ] Test rapid modal switching

**Time Estimate:** 30 minutes

---

### [ ] 4. Firebase Listener Memory Leak
**File:** `/src/stores/auth.js` (lines 16-24, 67-69)

**Issue:** `cleanupAuth()` function exists but is never called

**Solution:**
```javascript
// In App.svelte
$effect(() => {
  if (!$user) {
    cleanupAuth();
  }
});
```

**Action Items:**
- [ ] Import cleanupAuth in App.svelte
- [ ] Add $effect to call cleanupAuth on user logout
- [ ] Test that listener is removed after signOut
- [ ] Verify memory doesn't leak on multiple sign in/out cycles

**Time Estimate:** 15 minutes

---

## IMPORTANT ISSUES - Fix Next

### [ ] 5. Firebase Offline Persistence
**File:** `/src/stores/firebase.js` (line 29)

**Current:**
```javascript
export const db = getFirestore(app);
// Note says it's enabled but it's NOT
```

**Solution:**
```javascript
import { enableIndexedDbPersistence } from 'firebase/firestore';

export const db = getFirestore(app);

// Enable offline persistence
if (typeof window !== 'undefined') {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Multiple tabs open - persistence disabled');
    } else if (err.code === 'unimplemented') {
      console.warn('Browser doesn\'t support persistence');
    }
  });
}
```

**Action Items:**
- [ ] Add enableIndexedDbPersistence call
- [ ] Add error handling for multi-tab scenario
- [ ] Test offline functionality
- [ ] Verify data persists after page refresh (offline)

**Time Estimate:** 20 minutes

---

### [ ] 6. Consolidate Modal Architecture
**Files to Update:**
- All modal components (TsBarnumModal, DeepWorkModal, SleepModal, ProjectsModal)
- Modal.svelte needs to be properly implemented as base

**Action Items:**
- [ ] Fix Modal.svelte to handle Escape key properly
- [ ] Update all modal files to use Modal.svelte as base
- [ ] Extract `.modal`, `.modal__header`, `.btn-close` CSS to Modal.svelte
- [ ] Each modal only implements its own content styles

**Example Refactor:**
```svelte
<!-- DeepWorkModal.svelte -->
<script>
  let { isOpen = $bindable(false) } = $props();
  let isSaving = $state(false);
  
  async function increment() {
    isSaving = true;
    try {
      dailyMetrics.update(m => { m.deepWork += 0.5; return m; });
      await saveDailyMetrics();
    } finally {
      isSaving = false;
    }
  }
</script>

<Modal bind:isOpen title="Deep Work">
  {#snippet children()}
    <div class="actions">
      <button onclick={increment} disabled={isSaving}>+0.5h</button>
    </div>
  {/snippet}
</Modal>
```

**Time Estimate:** 1 hour (for all modals)

---

### [ ] 7. Add Type Safety to Components
**Files:**
- `/src/components/WeeklyChart.svelte`
- `/src/components/PullToRefresh.svelte`
- All modal components

**Action Items:**
- [ ] Add JSDoc type definitions to all component props
- [ ] Check for TypeScript errors in IDE
- [ ] Add types for callback functions

**Example:**
```javascript
/**
 * Pull-to-refresh container component for mobile UX
 * @component
 * @param {Object} props
 * @param {() => Promise<void>} [props.onRefresh] - Callback when user pulls to refresh
 * @param {import('svelte').Snippet} props.children - Content to display
 */
let { onRefresh = async () => {}, children } = $props();
```

**Time Estimate:** 30 minutes

---

### [ ] 8. Fix Accessibility Issues
**Issues to Fix:**

**A. Modal Focus Management**
```javascript
// In Modal.svelte
let modalElement;

$effect(() => {
  if (isOpen && modalElement) {
    // Focus first focusable element
    const focusable = modalElement.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    focusable?.focus();
  }
});
```

**B. MetricCard aria-label**
```svelte
<button class="metric__row" onclick={onOpenModal} aria-label="Edit {title}">
```

**C. WeeklyChart canvas**
```svelte
<canvas
  bind:this={chartCanvas}
  role="img"
  aria-label="Weekly metrics chart showing last 7 days"
></canvas>
```

**Action Items:**
- [ ] Add focus management to Modal.svelte
- [ ] Add aria-labels to all buttons
- [ ] Add focus trap (Tab stays within modal)
- [ ] Test with screen reader
- [ ] Test keyboard navigation

**Time Estimate:** 45 minutes

---

### [ ] 9. Eliminate CSS Duplication
**Button Styles:**
- Create `/src/styles/components/_buttons.scss`
- Extract `.btn` and variants from all modals
- Import in components that need it

**Color Hardcoding in JS:**
- WeeklyChart.svelte uses: `#3ccaa0`, `#ffd93d`, `rgba(202, 60, 102, 0.9)`
- Create JS export of CSS variables
- Or refactor chart to use CSS custom properties

**Action Items:**
- [ ] Create `/src/styles/components/_buttons.scss` with `.btn` styles
- [ ] Create `/src/styles/components/_modals.scss` with modal base styles
- [ ] Remove duplicate modal styles from individual components
- [ ] Create `/src/styles/utils/_colors.js` or similar for JavaScript colors
- [ ] Update WeeklyChart to use color exports

**Time Estimate:** 1 hour

---

### [ ] 10. Remove Unused CSS Variables
**File:** `/src/styles/base/_base.scss`

**Variables to Remove:**
- `--font-size-xxxs` - never used
- `--font-size-base` - never used
- `--shadow-hover` - never used
- `--font-size-h1`, `--font-size-h2`, `--font-size-h3` - semantic aliases never used

**Action Items:**
- [ ] Delete unused variables
- [ ] Search codebase to confirm no usage
- [ ] Update documentation/comments

**Time Estimate:** 10 minutes

---

## MINOR ISSUES - Lower Priority

### [ ] 11. Function Naming Consistency
**Standardize to:**
- `handle*` for event handlers
- verb-noun for actions

**Current Issues:**
- `increment()` vs `incrementProgress()`
- `handleRefresh()` vs `handleSeedTestData()` - naming inconsistent

**Action Items:**
- [ ] Rename increment/decrement functions consistently
- [ ] Rename all event handlers to use `handle` prefix
- [ ] Update all call sites

**Time Estimate:** 20 minutes

---

### [ ] 12. Add Input Validation
**Files:**
- `/src/components/TsBarnumModal.svelte` - milestone input
- Time inputs in SleepModal

**Action Items:**
- [ ] Add max length validation to milestone input (100 chars)
- [ ] Add min/max constraints to time inputs
- [ ] Show validation error messages

**Time Estimate:** 20 minutes

---

### [ ] 13. Extract Magic Numbers to Constants
**Files:**
- `/src/components/PullToRefresh.svelte` - `80`, `120`, `0.5`
- `/src/components/WeeklyChart.svelte` - `30rem`, `4`, `12`
- Modal components - `0.5h` increment, `5%` increment

**Action Items:**
- [ ] Move magic numbers to top of component as constants
- [ ] Add comments explaining what they represent
- [ ] Consider moving shared constants to `/src/lib/constants.js`

**Time Estimate:** 15 minutes

---

### [ ] 14. Remove Test Code from Production UI
**File:** `/src/components/Drawer.svelte` (lines 72-78)

**Options:**
1. Only show in dev mode:
   ```javascript
   {#if import.meta.env.DEV}
     <button onclick={handleSeedTestData}>Seed test data</button>
   {/if}
   ```

2. Or remove entirely and use dev tools

**Action Items:**
- [ ] Decide if keeping test seed button (yes if useful for QA)
- [ ] If keeping, hide in production build
- [ ] Update development docs

**Time Estimate:** 10 minutes

---

### [ ] 15. Add Error Boundary/Fallback for Chart
**File:** `/src/components/WeeklyChart.svelte`

**Action Items:**
- [ ] Wrap createChart() in try-catch
- [ ] Show table view if Chart.js fails to load
- [ ] Log helpful error message

**Time Estimate:** 15 minutes

---

## Testing & Verification

### [ ] Unit Test Planning
**Consider adding tests for:**
- [ ] `saveDailyMetrics()` - mock Firebase
- [ ] `loadDailyMetrics()` - mock Firebase
- [ ] Milestone functions - add/toggle/remove
- [ ] Modal state management

**Time Estimate:** 2-3 hours

---

### [ ] Integration Test Planning
**Test scenarios:**
- [ ] User signs in → metrics load
- [ ] Edit metric → data saves → persists after refresh
- [ ] Multiple modals don't open simultaneously
- [ ] Offline mode works

**Time Estimate:** 4-5 hours

---

### [ ] Manual Testing Checklist
- [ ] Sign in/out flow works
- [ ] All modals open/close properly
- [ ] Data saves on slow network (with timeout)
- [ ] Data saves with no network (offline mode)
- [ ] Pull-to-refresh works on mobile
- [ ] All buttons are keyboard accessible
- [ ] Chart displays correctly
- [ ] Drawer navigation works

**Time Estimate:** 30 minutes per pass

---

## Summary by Estimated Time

| Priority | Task | Time | Status |
|----------|------|------|--------|
| 🔴 | Delete RoadmapModal.svelte | 5 min | Pending |
| 🔴 | Fix modal state race condition | 30 min | Pending |
| 🔴 | Add error handling to modals | 45 min | Pending |
| 🔴 | Fix Firebase listener leak | 15 min | Pending |
| 🟠 | Enable Firebase persistence | 20 min | Pending |
| 🟠 | Fix modal architecture | 1 hour | Pending |
| 🟠 | Add type safety | 30 min | Pending |
| 🟠 | Fix accessibility | 45 min | Pending |
| 🟠 | Eliminate CSS duplication | 1 hour | Pending |
| 🟠 | Remove unused CSS vars | 10 min | Pending |
| 🟡 | Function naming | 20 min | Pending |
| 🟡 | Input validation | 20 min | Pending |
| 🟡 | Extract magic numbers | 15 min | Pending |
| 🟡 | Remove test code | 10 min | Pending |
| 🟡 | Error boundary for chart | 15 min | Pending |

**Total Quick Fixes (Critical + Important):** ~4 hours
**Total With Minor Fixes:** ~5-6 hours
**Total With Tests:** 11-14 hours

---

## Documentation Updates Needed

- [ ] Add Firestore security rules document
- [ ] Update README with offline mode details
- [ ] Add accessibility checklist to CONTRIBUTING.md
- [ ] Document modal patterns and best practices
- [ ] Add CSS variable naming guide

---

## Architecture Diagrams to Create

- [ ] Component dependency graph
- [ ] Data flow diagram (auth → metrics → UI)
- [ ] Modal state machine diagram
- [ ] Firestore data structure diagram

