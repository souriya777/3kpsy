<script>
  // app entry point
  import { user, signInWithGoogle, signOutUser } from '@stores/auth';
  import { loadDailyMetrics, loadProjectsMetrics, loadRoadmap } from '@stores/metrics';
  import MetricDeepWork from '@components/MetricDeepWork.svelte';
  import MetricSleep from '@components/MetricSleep.svelte';
  import MetricProjects from '@components/MetricProjects.svelte';
  import MetricProgress from '@components/MetricProgress.svelte';
  import WeeklyChart from '@components/WeeklyChart.svelte';
  import PullToRefresh from '@components/PullToRefresh.svelte';
  import Drawer from '@components/Drawer.svelte';
  import TsBarnumModal from '@components/TsBarnumModal.svelte';
  import DeepWorkModal from '@components/DeepWorkModal.svelte';
  import SleepModal from '@components/SleepModal.svelte';
  import ProjectsModal from '@components/ProjectsModal.svelte';

  let currentView = $state('home'); // 'home' or 'stats'
  let drawerOpen = $state(false);
  let tsBarnumModalOpen = $state(false);
  let deepWorkModalOpen = $state(false);
  let sleepModalOpen = $state(false);
  let projectsModalOpen = $state(false);

  // load metrics when user signs in
  $effect(() => {
    if ($user) {
      loadDailyMetrics();
      loadProjectsMetrics();
      loadRoadmap();
    }
  });

  // refresh all metrics from firestore
  async function handleRefresh() {
    await Promise.all([
      loadDailyMetrics(),
      loadProjectsMetrics(),
      loadRoadmap()
    ]);
  }

  function openTsBarnumModal() {
    tsBarnumModalOpen = true;
  }

  function openDeepWorkModal() {
    deepWorkModalOpen = true;
  }

  function openSleepModal() {
    sleepModalOpen = true;
  }

  function openProjectsModal() {
    projectsModalOpen = true;
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
              <MetricProgress onOpenModal={openTsBarnumModal} />
              <MetricDeepWork onOpenModal={openDeepWorkModal} />
              <MetricProjects onOpenModal={openProjectsModal} />
              <MetricSleep onOpenModal={openSleepModal} />
            </div>
          </div>
        {:else}
          <div class="stats">
            <div class="stats__header">
              <h2>Stats 7 derniers jours</h2>
            </div>
            <WeeklyChart />
          </div>
        {/if}
      </PullToRefresh>
    {/if}
  </main>
</div>

<Drawer bind:isOpen={drawerOpen} bind:currentView={currentView} />
<TsBarnumModal bind:isOpen={tsBarnumModalOpen} />
<DeepWorkModal bind:isOpen={deepWorkModalOpen} />
<SleepModal bind:isOpen={sleepModalOpen} />
<ProjectsModal bind:isOpen={projectsModalOpen} />

<style lang="scss">
  .app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;

    &__header {
      padding: var(--space-16);
      border-bottom: var(--border-width-thin) solid var(--color-border);

      .header-content {
        display: grid;
        grid-template-columns: 1fr auto 1fr;
        align-items: center;
        max-width: var(--max-width-container);
        margin-inline: auto;
      }

      h1 {
        margin: 0;
        font-size: var(--font-size-h2);
        text-align: center;
        grid-column: 2;
      }
    }

    &__main {
      flex: 1;
      padding: var(--space-16);
      padding-block-start: unset;
    }
  }

  .home {
    max-width: var(--max-width-container);
    margin-inline: auto;
    min-height: calc(100vh - var(--space-16) * 2 - 5.6rem); // 100vh - padding - header height
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .metrics-grid {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .signin-prompt {
    max-width: 40rem;
    margin: var(--space-72) auto;
    text-align: center;

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
      opacity: 0.9;
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
    justify-content: flex-start;
    transition: all var(--transition-fast) var(--easing-default);

    svg {
      display: block;
    }

    &:hover {
      opacity: 0.8;
    }
  }

  .stats {
    max-width: var(--max-width-container);
    margin-inline: auto;

    &__header {
      margin-block-end: var(--space-24);
      text-align: center;
    }
  }
</style>
