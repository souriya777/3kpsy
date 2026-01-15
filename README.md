# 3kpsy

🌸 Application permettant d'avoir un compteur toujours visible, motivant, un peu comme les kdramas, pour réussir ma reconversion professionnelle.

## 📋 Vue d'ensemble

Application mobile-first PWA (iPhone 12 mini) pour tracker des métriques quotidiennes avec système d'objectifs progressifs "Blue Lock". Toutes les données sont synchronisées via Firebase pour analyse future et consultation multi-périphériques.

### Métriques Trackées (4 au total)

1. **Deep Work** - Heures de travail concentré (objectif progressif: 1h → 5h max)
2. **Sommeil** - Heures de levé/couché + sieste (objectif: levé 5h30)
3. **Projets Terminés** - Format X/Y (terminés/en cours, écart idéal ≤ 2)
4. **ts-barnum** - Progression % du projet prioritaire avec roadmap

## 🎯 Objectifs du Projet

- Interface ultra-simple et rapide (tap unique)
- Système d'objectifs progressifs "Blue Lock" (atteignables court terme)
- Stockage historique complet Firebase (analyse future)
- PWA installable sur écran d'accueil iPhone
- Design minimaliste, langage non-jugeant
- Offline-first avec sync automatique

## 🏗️ Architecture Technique

### Stack

- **Frontend:** Svelte 5 (runes) + Vite
- **Package Manager:** pnpm
- **Langage:** TypeScript via JSDoc (pas .ts pur)
- **Styles:** SCSS avec pattern 7-1 + CSS variables (`:root`)
- **Backend:** Firebase (Firestore + Auth Google)
- **Charts:** Chart.js (via svelte-chartjs)
- **PWA:** Service Worker + Manifest
- **Deploy:** Vercel

### Thème

- **Background:** `#ca3c66` (rose)
- **Text:** `#ffffff` (blanc)
- **Accent:** `#ff6b9d` (rose clair, dérivé)

### Unités de Mesure

**REM au lieu de PX** via `html { font-size: 62.5%; }` (1rem = 10px)

**Pourquoi REM > PX :**
- **Accessibilité** : Respecte les préférences de taille de police de l'utilisateur (paramètres navigateur)
- **Responsive** : Change toutes les tailles proportionnellement en ajustant juste `html { font-size }`
- **Maintenance** : Ajuste toute l'échelle typographique facilement
- **Calcul mental facile** : 1.6rem = 16px, 2.4rem = 24px, 3.2rem = 32px

**Exemple :**
```scss
:root {
  --space-8: 0.8rem;  // 8px
  --space-16: 1.6rem; // 16px
  --font-size-p: 1.8rem; // 18px
}

html {
  font-size: 62.5%; // 1rem = 10px (base 16px * 0.625)
}
```

### Structure du Projet

```
3kpsy/
├── public/
│   ├── manifest.json              # PWA manifest
│   ├── icon.svg                   # source icon
│   ├── icon-192.png               # 192x192 icon
│   └── icon-512.png               # 512x512 icon
├── scripts/
│   └── generate-icons.js          # SVG to PNG converter
├── src/
│   ├── components/
│   │   ├── MetricDeepWork.svelte     # compteur heures + objectif
│   │   ├── MetricSleep.svelte        # levé/couché/sieste + objectif
│   │   ├── MetricProjects.svelte     # format X/Y avec alertes
│   │   ├── MetricProgress.svelte     # barre % ts-barnum
│   │   ├── WeeklyChart.svelte        # graphiques Chart.js
│   │   └── RoadmapModal.svelte       # milestones ts-barnum
│   ├── stores/
│   │   ├── metrics.js             # state local Svelte 5 (runes)
│   │   └── firebase.js            # config & sync
│   ├── styles/                    # SCSS 7-1 pattern
│   │   ├── abstracts/             # _mixins, _functions
│   │   ├── base/                  # _reset, _base, _typography
│   │   ├── components/            # _buttons, _cards, _inputs
│   │   ├── layout/                # _grid, _header, _navigation
│   │   ├── pages/                 # _home, _stats
│   │   ├── themes/                # _default
│   │   ├── vendors/               # chart.js overrides
│   │   └── main.scss              # imports all
│   ├── App.svelte                 # root component
│   └── main.js                    # entry point
├── .firebaserc                    # firebase project config
├── firebase.json                  # firebase hosting config
├── package.json
├── pnpm-lock.yaml
├── vite.config.js
└── README.md
```

### Structure Firebase

```javascript
// Firestore database structure
users/{userId}/
  ├── daily/{date}/                // YYYY-MM-DD format
  │   ├── deepWork: 2.5            // heures (float)
  │   ├── deepWorkGoal: 3          // objectif actuel
  │   ├── wakeUp: "07:00"          // HH:mm format
  │   ├── sleep: "23:30"           // HH:mm format
  │   ├── nap: true                // boolean
  │   ├── wakeUpGoal: "06:30"      // objectif levé
  │   ├── tsBarnum: 65             // % (0-100)
  │   └── timestamp: ISO8601
  ├── projects/
  │   ├── completed: 2             // nombre terminés
  │   └── inProgress: 15           // nombre en cours
  └── roadmap/
      └── tsBarnum: [              // array of milestones
          { id: "1", milestone: "Feature X", done: true },
          { id: "2", milestone: "Feature Y", done: false }
        ]
```

**Rationale:** Structure `daily/{date}` permet analyse historique complète (tendances, patterns, évolution sur 1 an+).

## 📝 Roadmap de Développement

### Phase 1: Setup (30-45min) ✅ COMPLÉTÉ

- [x] Init dépôt Git
- [x] Init Svelte 5 + Vite
- [x] Setup SCSS 7-1 pattern avec CSS variables
- [x] Config Firebase projet "3kpsy"
- [x] Auth Firebase (Google)
- [x] PWA manifest + service-worker

### Phase 2: Composants Métriques (3-4h) ✅ COMPLÉTÉ

- [x] **MetricDeepWork.svelte** (Svelte 5 + stores)
  - Input heures (float)
  - Boutons +0.5h / -0.5h
  - Affichage objectif actuel (1h → 5h)
  - Validation 0-24h
- [x] **MetricSleep.svelte**
  - Input levé (HH:mm)
  - Input couché (HH:mm)
  - Toggle sieste
  - Affichage objectif levé progressif
- [x] **MetricProjects.svelte**
  - Affichage "X/Y"
  - 4 boutons: +1/-1 pour X, +1/-1 pour Y
  - Alert visuelle si écart > 2
- [x] **MetricProgress.svelte**
  - Barre progression % (0-100)
  - Boutons +5% / -5%
  - Bouton "Roadmap" → modal
- [x] Stores Svelte (writable) pour state management

### Phase 3: Firebase Sync (1-2h) ✅ COMPLÉTÉ

- [x] Config Firebase SDK
- [x] Auth Google Sign-In
- [x] CRUD operations daily/{date}
- [x] Sync bidirectionnelle Firestore
- [x] Chargement automatique au démarrage
- [x] Offline-first (persistance par défaut)
- [x] Update projects/ et roadmap/

### Phase 4: Page Principale (1h) ✅ COMPLÉTÉ

- [x] Layout responsive (iPhone 12 mini: 375x812px)
- [x] Integration des 4 composants métriques
- [x] Navigation vers stats
- [x] Save automatique onChange

### Phase 5: Page Stats (2-3h)

- [ ] **WeeklyChart.svelte** avec Chart.js
- [ ] Graphique Deep Work (courbe heures/jour)
- [ ] Graphique Sommeil (heure levé/jour)
- [ ] Graphique Projets (évolution ratio X/Y)
- [ ] Graphique ts-barnum (progression %)
- [ ] Vue "Cette semaine vs dernière"
- [ ] Comparaison simple (moyenne, tendance)

### Phase 6: Roadmap Modal (1h)

- [ ] Modal pour ts-barnum milestones
- [ ] Liste éditable (add/remove/toggle)
- [ ] Sauvegarde Firebase roadmap/
- [ ] Calcul % basé sur milestones done

### Phase 7: PWA & Deploy (1h) ✅ COMPLÉTÉ

- [x] Service worker (offline, cache strategies)
- [x] Icons 192x192, 512x512
- [x] Manifest.json avec couleurs SCSS
- [x] Test iPhone 12 mini installation
- [x] Deploy Vercel
- [ ] Config DNS (si custom domain)

**TOTAL ESTIMÉ: 8-11h de développement**
**TEMPS RÉALISÉ: ~6h (Phases 1-4, 7 complètes)**

## 📋 TODO List Détaillée

### Setup & Configuration

- [ ] `pnpm create vite@latest . -- --template svelte`
- [ ] Install dependencies: `pnpm add svelte@next vite sass firebase chart.js svelte-chartjs vite-plugin-pwa`
- [ ] Create SCSS 7-1 folder structure
- [ ] Create `vite.config.js` with PWA plugin
- [ ] Create Firebase project "3kpsy" on console
- [ ] Init `firebase.json` and `.firebaserc`
- [ ] Setup Firestore rules (authenticated users only)
- [ ] Setup Firebase Auth (Google provider)

### Components Development (Svelte 5 Runes)

- [ ] Create `src/components/MetricDeepWork.svelte`
  - [ ] Props with `$props()` rune
  - [ ] Display: "2.5h aujourd'hui | Objectif: 3h"
  - [ ] Buttons: +0.5h, -0.5h
  - [ ] Validation: min 0, max 24
- [ ] Create `src/components/MetricSleep.svelte`
  - [ ] 3 inputs: wakeUp (HH:mm), sleep (HH:mm), nap (boolean)
  - [ ] Display: "Levé: 07:00 | Objectif: 06:30"
  - [ ] Time picker (native `<input type="time">`)
- [ ] Create `src/components/MetricProjects.svelte`
  - [ ] Display: "Projets: 2/15"
  - [ ] 4 buttons: +1/-1 completed, +1/-1 inProgress
  - [ ] Alert if `inProgress - completed > 2`
- [ ] Create `src/components/MetricProgress.svelte`
  - [ ] Props: `percentage`, `onChange`
  - [ ] Progress bar visual (HTML5 `<progress>`)
  - [ ] Buttons: +5%, -5%
  - [ ] Button "Roadmap" opens modal
- [ ] Create `src/components/RoadmapModal.svelte`
  - [ ] List of milestones (add/remove/toggle done)
  - [ ] Save to Firebase `roadmap/tsBarnum`
- [ ] Create `src/components/WeeklyChart.svelte`
  - [ ] Chart.js integration (Line, Bar charts)
  - [ ] 4 charts: deepWork, wakeUp, projects ratio, tsBarnum
  - [ ] Data from last 7 days

### Firebase Integration

- [ ] Create `src/stores/firebase.js`
  - [ ] Firebase config (apiKey, projectId, etc.)
  - [ ] `initializeApp()`, `getAuth()`, `getFirestore()`
  - [ ] Export `auth`, `db`
- [ ] Create `src/stores/metrics.js`
  - [ ] Svelte 5 runes (`$state`, `$derived`, `$effect`)
  - [ ] `syncFromFirestore()` function
  - [ ] `saveToFirestore()` function
  - [ ] Offline-first logic (cache + sync)
- [ ] Implement Auth flow
  - [ ] Google Sign-In button
  - [ ] `onAuthStateChanged` listener
  - [ ] Redirect if not authenticated

### Pages & Routing

- [ ] Create `src/pages/Home.svelte` (daily view)
  - [ ] Header with date
  - [ ] 4 metric components
  - [ ] Link to stats page
- [ ] Create `src/pages/Stats.svelte`
  - [ ] WeeklyChart component
  - [ ] Week selector (previous/next)
  - [ ] Simple comparison "Cette semaine vs dernière"
- [ ] Simple routing (hash-based or svelte-routing)

### PWA Configuration

- [ ] Create `public/manifest.json`
  - [ ] name: "3kpsy"
  - [ ] short_name: "3kpsy"
  - [ ] start_url: "/"
  - [ ] display: "standalone"
  - [ ] theme_color: "#ca3c66"
  - [ ] background_color: "#ca3c66"
  - [ ] icons: 192x192, 512x512
- [ ] Create `public/service-worker.js`
  - [ ] Cache static assets (CSS, JS, fonts)
  - [ ] Cache API responses (Firestore offline)
  - [ ] Network-first strategy for Firebase
- [ ] Add `<link rel="manifest">` in `index.html`
- [ ] Add meta tags for iOS (apple-touch-icon, viewport)

### SCSS Styling (7-1 Pattern with CSS Variables)

- [ ] `base/_base.scss` (`:root` with CSS variables)
  ```scss
  :root {
    // colors
    --color-primary: #ca3c66;
    --color-text: #ffffff;
    --color-accent: #ff6b9d;

    // spacing (x4/8)
    --space-4: 0.4rem;
    --space-8: 0.8rem;
    --space-12: 1.2rem;
    --space-16: 1.6rem;
    --space-24: 2.4rem;
    --space-32: 3.2rem;
    --space-40: 4rem;

    // typography
    --font-family-light: system-ui, sans-serif;
    --font-family-bold: system-ui, sans-serif;
    --font-size-h1: 3.6rem;
    --font-size-h2: 2.8rem;
    --font-size-p: 1.8rem;
    --font-size-s: 1.6rem;
    --line-height-h: 1.25;
    --line-height-p: 1.55;

    // sizes
    --max-width-container: 58rem;
  }

  html {
    font-size: 62.5%; // 1rem = 10px (accessibilité + calcul facile)
  }

  body {
    background-color: var(--color-primary);
    color: var(--color-text);
    font-family: var(--font-family-light);
    font-size: 1.6rem;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .row {
    max-width: var(--max-width-container);
    margin-inline: auto;
    padding-inline: var(--space-16);
  }
  ```
- [ ] `abstracts/_mixins.scss` (flex helpers, responsive)
- [ ] `base/_reset.scss` (normalize CSS)
- [ ] `base/_typography.scss` (h1, h2, p styles)
- [ ] `components/_buttons.scss` (+/- buttons, primary/secondary)
- [ ] `components/_cards.scss` (metric cards)
- [ ] `components/_inputs.scss` (time picker, toggles)
- [ ] `layout/_grid.scss` (metrics grid)
- [ ] `layout/_header.scss` (app header)
- [ ] `pages/_home.scss` (daily view specific)
- [ ] `pages/_stats.scss` (charts page specific)
- [ ] `main.scss` (import all partials)

### Testing & Deployment

- [ ] Test on Chrome DevTools (mobile view)
- [ ] Test on iPhone 12 mini Safari
  - [ ] Install PWA on home screen
  - [ ] Test offline mode
  - [ ] Test Firebase sync
- [ ] Build for production: `pnpm run build`
- [ ] Deploy to Vercel
  - [ ] Connect GitHub repo
  - [ ] Auto-deploy on push
  - [ ] Set environment variables (Firebase config)
- [ ] Test production URL on iPhone

## 💻 Principes de Codage

### Philosophie Générale

- **KISS (Keep It Simple, Stupid):** Privilégier la simplicité, éviter la sur-ingénierie
- **DRY (Don't Repeat Yourself):** Factoriser le code répétitif en mixins/composants
- **Mobile-First:** Design pour iPhone 12 mini (375x812px) puis progressive enhancement
- **Offline-First:** L'app doit fonctionner sans connexion, sync en arrière-plan
- **User-Centric:** Chaque feature doit servir l'utilisateur, pas l'ego du dev
- **Native-First:** Utiliser CSS variables (`:root`) et fonctionnalités natives HTML5

### Code Style

#### JavaScript/Svelte

- **JSDoc pour TypeScript:** Utiliser JSDoc comments au lieu de .ts
  ```javascript
  /**
   * @typedef {Object} Metric
   * @property {number} value - current value
   * @property {number} goal - target value
   */

  /**
   * increment metric value by step
   * @param {Metric} metric - the metric to update
   * @param {number} step - increment step
   * @returns {Metric} updated metric
   */
  function increment(metric, step) {
    return { ...metric, value: metric.value + step };
  }
  ```

- **Commentaires en anglais minuscules** (JS, SCSS, HTML, tous les fichiers)
  ```javascript
  // fetch daily metrics from firestore
  const metrics = await fetchDailyMetrics(userId, date);

  // validate deep work hours (0-24)
  if (hours < 0 || hours > 24) return false;
  ```

  ```scss
  // colors (rgba) - colors with opacity
  --color-border: rgba(var(--color-white-rgb), 0.2);

  // typography (modular scale - ratio 1.25 for harmony)
  --font-size-base: 1.8rem;
  ```

  **Pourquoi anglais :** Cohérence avec l'écosystème JS/dev, partage de code facilité, standard international.

- **Naming conventions:**
  - Variables/functions: `camelCase`
  - Composants: `PascalCase.svelte`
  - Constants: `UPPER_SNAKE_CASE`
  - Fichiers SCSS: `_kebab-case.scss`

- **Path aliases (pas de chemins relatifs)**
  ```javascript
  // ✅ good - utiliser les alias @
  import MetricCard from '@components/MetricCard.svelte';
  import { metricsStore } from '@stores/metrics';
  import '@styles/main.scss';

  // ❌ avoid - chemins relatifs
  import MetricCard from '../../components/MetricCard.svelte';
  import { metricsStore } from '../stores/metrics';
  ```

  **Configuration requise:**
  - `vite.config.js` : alias dans `resolve.alias`
  - `jsconfig.json` : alias dans `compilerOptions.paths` (pour IDE autocomplete)

- **Fonctions pures quand possible**
  ```javascript
  // ✅ good - pure function
  const calculateRatio = (completed, inProgress) => completed / inProgress;

  // ❌ avoid - side effects
  let ratio;
  const calculateRatio = (completed, inProgress) => {
    ratio = completed / inProgress; // mutates external state
  };
  ```

- **Destructuring pour la clarté**
  ```javascript
  // ✅ good
  const { deepWork, wakeUp, sleep } = dailyMetrics;

  // ❌ avoid
  const deepWork = dailyMetrics.deepWork;
  const wakeUp = dailyMetrics.wakeUp;
  ```

#### Svelte 5 Runes

- **Props avec `$props()` rune**
  ```svelte
  <script>
    /**
     * @type {{ value?: number, goal?: number, onChange?: (v: number) => void }}
     */
    let { value = 0, goal = 1, onChange = () => {} } = $props();
  </script>
  ```

- **State avec `$state()` rune**
  ```svelte
  <script>
    let count = $state(0);
    let doubled = $derived(count * 2); // computed value
  </script>

  <button onclick={() => count++}>
    Count: {count}, Doubled: {doubled}
  </button>
  ```

- **Effects avec `$effect()` rune**
  ```svelte
  <script>
    let value = $state(0);

    // runs when value changes
    $effect(() => {
      console.log('value changed:', value);
      saveToFirestore(value);
    });
  </script>
  ```

- **Event handlers inline simples, extracted si complexe**
  ```svelte
  <!-- ✅ good - simple -->
  <button onclick={() => value += 1}>+1</button>

  <!-- ✅ good - complex logic extracted -->
  <button onclick={handleIncrement}>+1</button>

  <script>
    function handleIncrement() {
      // validation, side effects, etc.
      if (value < 24) value += 1;
      onChange(value);
      saveToFirestore();
    }
  </script>
  ```

#### SCSS (7-1 Pattern avec CSS Variables)

- **CSS Variables dans `:root`** (pas SCSS `$variables`)

  **IMPORTANT: Design System centralisé**
  - **Toutes** les couleurs (hex, rgb, rgba) doivent être en variables
  - **Toutes** les transitions (durée, easing) doivent être en variables
  - **Toutes** les ombres, bordures, border-radius doivent être en variables
  - **Toutes** les font-sizes doivent être en variables avec échelle harmonieuse (modular scale)
  - Objectif : Voir le design system d'un coup d'œil dans `base/_base.scss`

  **Échelle Typographique Harmonieuse (Modular Scale)**
  - Utiliser une échelle modulaire avec ratio constant (ex: 1.25, 1.333, 1.414, 1.618)
  - Base: 1.6rem → appliquer le ratio → 2rem → 2.4rem → 3.2rem → 4rem → 4.8rem
  - Progression visuelle cohérente et agréable
  - Évite les tailles "au hasard" (ex: 17px, 23px, 31px)

  ```scss
  // base/_base.scss
  :root {
    // colors (hex)
    --color-primary: #ca3c66;
    --color-text: #ffffff;
    --color-accent: #ff6b9d;

    // colors (rgb/rgba) - pour opacité dynamique
    --color-white-rgb: 255, 255, 255;
    --color-overlay: rgba(0, 0, 0, 0.5);
    --color-border: rgba(var(--color-white-rgb), 0.2);

    // spacing
    --spacing-unit: 0.8rem; // 8px
    --space-8: 0.8rem;
    --space-16: 1.6rem;

    // transitions
    --transition-fast: 0.15s;
    --transition-normal: 0.3s;
    --transition-slow: 0.5s;
    --easing-default: ease-in-out;
    --easing-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);

    // borders & shadows
    --border-radius-small: 0.4rem;
    --border-radius-medium: 0.8rem;
    --border-radius-large: 1.6rem;
    --shadow-small: 0 2px 4px rgba(0, 0, 0, 0.1);
    --shadow-medium: 0 4px 8px rgba(0, 0, 0, 0.15);

    // typography
    --font-main: system-ui, sans-serif;
  }

  // usage
  .metric-card {
    color: var(--color-text);
    padding: calc(var(--spacing-unit) * 2);
    font-family: var(--font-main);
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius-medium);
    box-shadow: var(--shadow-small);
    transition: all var(--transition-normal) var(--easing-default);

    &:hover {
      box-shadow: var(--shadow-medium);
      transform: translateY(-2px);
    }
  }

  // pour opacité dynamique avec rgb
  .overlay {
    background: rgba(var(--color-white-rgb), 0.8);
  }
  ```

- **Mixins pour patterns répétés** (SCSS `@mixin` OK pour logique)
  ```scss
  // abstracts/_mixins.scss
  @mixin flex-center {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  @mixin respond-to($breakpoint) {
    @if $breakpoint == tablet {
      @media (min-width: 768px) { @content; }
    }
  }

  // usage
  .metric-card {
    @include flex-center;

    @include respond-to(tablet) {
      flex-direction: row;
    }
  }
  ```

- **Nesting max 3 niveaux**
  ```scss
  // ✅ good
  .metric-card {
    .metric-title {
      span { color: var(--color-accent); }
    }
  }

  // ❌ avoid - too deep
  .page {
    .section {
      .card {
        .title {
          span { color: red; } // 5 levels!
        }
      }
    }
  }
  ```

- **Utiliser fonctions natives CSS** (`calc()`, `clamp()`, etc.)
  ```scss
  .responsive-text {
    // fluid typography with clamp
    font-size: clamp(1.6rem, 1.4rem + 0.5vw, 2.4rem);
  }

  .spacing {
    padding: calc(var(--space-8) * 2); // 1.6rem = 16px
  }
  ```

#### Firebase

- **Firestore queries optimisées**
  ```javascript
  // ✅ good - indexed query with limit
  const last7Days = query(
    collection(db, `users/${userId}/daily`),
    orderBy('timestamp', 'desc'),
    limit(7)
  );

  // ❌ avoid - fetch all then filter client-side
  const allDays = await getDocs(collection(db, `users/${userId}/daily`));
  const last7Days = allDays.filter(/* ... */);
  ```

- **Offline persistence activée**
  ```javascript
  import { enableIndexedDbPersistence } from 'firebase/firestore';

  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      // multiple tabs open
    } else if (err.code === 'unimplemented') {
      // browser doesn't support
    }
  });
  ```

- **Error handling explicite**
  ```javascript
  // ✅ good
  try {
    await setDoc(doc(db, `users/${userId}/daily/${date}`), data);
  } catch (error) {
    console.error('failed to save daily metrics:', error);
    // show user-friendly error
    alert('Impossible de sauvegarder. Réessayez.');
  }

  // ❌ avoid - silent failure
  setDoc(doc(db, `users/${userId}/daily/${date}`), data);
  ```

### Git Workflow

- **Commits atomiques et descriptifs**
  ```bash
  # ✅ good
  git commit -m "add deep work metric component with +/- buttons"
  git commit -m "implement firestore sync for daily metrics"

  # ❌ avoid
  git commit -m "update"
  git commit -m "fix stuff"
  ```

- **Branches pour features importantes**
  ```bash
  git checkout -b feature/weekly-charts
  git checkout -b fix/offline-sync-bug
  ```

### Performance

- **Lazy loading pour charts**
  ```svelte
  <script>
    import { onMount } from 'svelte';

    let Chart;
    onMount(async () => {
      Chart = (await import('svelte-chartjs')).Chart;
    });
  </script>

  {#if Chart}
    <Chart data={weeklyData} />
  {/if}
  ```

- **Debounce pour inputs**
  ```javascript
  import { debounce } from './utils';

  const saveMetric = debounce((value) => {
    saveToFirestore(value);
  }, 500);

  // usage in component
  <input oninput={(e) => saveMetric(e.target.value)} />
  ```

### Accessibilité (A11y)

- **Labels pour tous les inputs**
  ```svelte
  <label for="wake-up">Heure de levé</label>
  <input id="wake-up" type="time" />
  ```

- **ARIA attributes quand nécessaire**
  ```svelte
  <button aria-label="Incrémenter de 0.5 heure" onclick={increment}>
    +0.5h
  </button>
  ```

### Package Manager (pnpm)

- **Toujours utiliser pnpm** pour consistance
  ```bash
  # ✅ good
  pnpm install
  pnpm add firebase
  pnpm run dev

  # ❌ avoid
  npm install
  yarn add firebase
  ```

## 🚀 Quick Start

```bash
# clone repo
git clone <repo-url>
cd 3kpsy

# install dependencies with pnpm
pnpm install

# run dev server
pnpm run dev

# open http://localhost:5173
```

## 📱 Installation sur iPhone

1. Ouvrir l'app dans Safari
2. Appuyer sur "Partager" (icône carré avec flèche)
3. "Ajouter à l'écran d'accueil"
4. L'icône 3kpsy apparaît comme une app native

## 🔥 Firebase Setup

1. Créer projet "3kpsy" sur [Firebase Console](https://console.firebase.google.com)
2. Activer Firestore Database
3. Activer Authentication (Google provider)
4. Copier config dans `src/stores/firebase.js`
5. Déployer Firestore rules:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId}/{document=**} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
     }
   }
   ```

## 📊 Analyse des Données (Futur)

Toutes les données sont stockées dans `users/{userId}/daily/{date}` avec horodatage. Dans 1 an, on pourra:
- Analyser tendances long terme
- Identifier patterns de productivité
- Corréler sommeil ↔ deep work
- Visualiser progression objectifs
- Export CSV pour analyse externe

## 📄 License

Projet personnel - Usage libre

---

**Dernière mise à jour:** 2026-01-15
**Version:** 0.3.0 (PWA installable - production ready)
