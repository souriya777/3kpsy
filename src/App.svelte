<script>
  // app entry point
  import { user, signInWithGoogle, signOutUser } from '@stores/auth';
  import { loadDailyMetrics, loadProjectsMetrics, loadRoadmap } from '@stores/metrics';
  import MetricDeepWork from '@components/MetricDeepWork.svelte';
  import MetricSleep from '@components/MetricSleep.svelte';
  import MetricProjects from '@components/MetricProjects.svelte';
  import MetricProgress from '@components/MetricProgress.svelte';
  import RoadmapModal from '@components/RoadmapModal.svelte';
  import WeeklyChart from '@components/WeeklyChart.svelte';
  import PullToRefresh from '@components/PullToRefresh.svelte';
  import Drawer from '@components/Drawer.svelte';

  let currentView = $state('home'); // 'home' or 'stats'
  let showRoadmap = $state(false);
  let drawerOpen = $state(false);

  // load metrics when user signs in
  $effect(() => {
    if ($user) {
      loadDailyMetrics();
      loadProjectsMetrics();
      loadRoadmap();
    }
  });

  function openRoadmap() {
    showRoadmap = true;
  }

  // refresh all metrics from firestore
  async function handleRefresh() {
    await Promise.all([
      loadDailyMetrics(),
      loadProjectsMetrics(),
      loadRoadmap()
    ]);
  }
</script>

<div class="app">
  <header class="app__header">
    <div class="header-content">
      {#if $user}
        <button class="btn-menu" onclick={() => drawerOpen = true} aria-label="open menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      {/if}
      <h1>3kpsy</h1>
    </div>
  </header>

  <main class="app__main">
    {#if !$user}
      <div class="signin-prompt">
        <button class="btn-signin" onclick={signInWithGoogle}>
          Sign In with Google
        </button>
      </div>
    {:else}
      <PullToRefresh onRefresh={handleRefresh}>
        {#if currentView === 'home'}
          <div class="home">
            <div class="metrics-grid">
              <MetricProgress />
              <MetricDeepWork />
              <MetricProjects />
              <MetricSleep />
            </div>
          </div>
        {:else}
          <div class="stats">
            <div class="stats__header">
              <h2>Statistiques hebdomadaires</h2>
              <p class="stats__subtitle">Visualise ta progression sur les 7 derniers jours</p>
            </div>
            <WeeklyChart />
          </div>
        {/if}
      </PullToRefresh>
    {/if}
  </main>
</div>

<Drawer bind:isOpen={drawerOpen} bind:currentView={currentView} onOpenRoadmap={openRoadmap} />
<RoadmapModal bind:isOpen={showRoadmap} />

<style lang="scss">
  .app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;

    &__header {
      padding: var(--space-16);
      border-bottom: var(--border-width-thin) solid var(--color-border);

      .header-content {
        display: flex;
        align-items: center;
        gap: var(--space-16);
        max-width: var(--max-width-container);
        margin-inline: auto;
      }

      h1 {
        margin: 0;
        font-size: var(--font-size-h2);
        flex: 1;
      }
    }

    &__main {
      flex: 1;
      padding: var(--space-16);
    }
  }

  .home {
    max-width: var(--max-width-container);
    margin-inline: auto;
  }

  .metrics-grid {
    display: grid;
    gap: var(--space-16);
    grid-template-columns: 1fr;

    @media (min-width: 768px) {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  .signin-prompt {
    max-width: 40rem;
    margin: var(--space-72) auto;
    text-align: center;

    h2 {
      margin-block-end: var(--space-16);
    }

    p {
      color: rgba(var(--color-white-rgb), 0.8);
      margin-block-end: var(--space-32);
    }
  }

  .btn-signin {
    padding: var(--space-16) var(--space-32);
    background: var(--color-accent);
    color: var(--color-text);
    border: none;
    border-radius: var(--border-radius-medium);
    font-size: var(--font-size-s);
    font-weight: var(--font-weight-medium);
    cursor: pointer;
    transition: all var(--transition-fast) var(--easing-default);

    &:hover {
      transform: scale(1.05);
      box-shadow: var(--shadow-medium);
    }

    &:active {
      transform: scale(0.98);
    }
  }

  .btn-menu {
    padding: var(--space-8);
    background: transparent;
    border: none;
    color: var(--color-text);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all var(--transition-fast) var(--easing-default);

    svg {
      display: block;
    }

    &:hover {
      transform: scale(1.1);
    }

    &:active {
      transform: scale(0.95);
    }
  }

  .stats {
    max-width: var(--max-width-container);
    margin-inline: auto;

    &__header {
      margin-block-end: var(--space-24);
      text-align: center;

      h2 {
        margin-block-end: var(--space-8);
      }
    }

    &__subtitle {
      color: rgba(var(--color-white-rgb), 0.7);
      font-size: var(--font-size-s);
      margin: 0;
    }
  }
</style>
