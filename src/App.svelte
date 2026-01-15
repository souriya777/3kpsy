<script>
  // app entry point
  import { user, signInWithGoogle, signOutUser } from '@stores/auth';
  import MetricDeepWork from '@components/MetricDeepWork.svelte';
  import MetricSleep from '@components/MetricSleep.svelte';
  import MetricProjects from '@components/MetricProjects.svelte';
  import MetricProgress from '@components/MetricProgress.svelte';

  let currentView = $state('home'); // 'home' or 'stats'
  let showRoadmap = $state(false);

  function openRoadmap() {
    showRoadmap = true;
  }

  function closeRoadmap() {
    showRoadmap = false;
  }
</script>

<div class="app">
  <header class="app__header">
    <div class="header-content">
      <h1>3kpsy</h1>
      {#if $user}
        <button class="btn-signout" onclick={signOutUser}>
          Sign Out
        </button>
      {/if}
    </div>
  </header>

  <main class="app__main">
    {#if !$user}
      <div class="signin-prompt">
        <h2>Welcome to 3kpsy</h2>
        <p>Sign in to track your metrics</p>
        <button class="btn-signin" onclick={signInWithGoogle}>
          Sign In with Google
        </button>
      </div>
    {:else if currentView === 'home'}
      <div class="home">
        <div class="metrics-grid">
          <MetricDeepWork />
          <MetricSleep />
          <MetricProjects />
          <MetricProgress onOpenRoadmap={openRoadmap} />
        </div>
      </div>
    {:else}
      <div class="stats">
        <p>Stats view coming soon...</p>
      </div>
    {/if}
  </main>

  {#if $user}
    <nav class="app__nav">
      <button
        class:active={currentView === 'home'}
        onclick={() => currentView = 'home'}
      >
        Home
      </button>
      <button
        class:active={currentView === 'stats'}
        onclick={() => currentView = 'stats'}
      >
        Stats
      </button>
    </nav>
  {/if}
</div>

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
        justify-content: space-between;
        align-items: center;
        max-width: var(--max-width-container);
        margin-inline: auto;
      }

      h1 {
        margin: 0;
        font-size: var(--font-size-h2);
      }
    }

    &__main {
      flex: 1;
      padding: var(--space-16);
    }

    &__nav {
      display: flex;
      gap: var(--space-8);
      padding: var(--space-16);
      border-top: var(--border-width-thin) solid var(--color-border);

      button {
        flex: 1;
        padding: var(--space-12);
        background: transparent;
        color: var(--color-text);
        border: var(--border-width-thin) solid var(--color-border);
        border-radius: var(--border-radius-medium);
        cursor: pointer;
        transition: all var(--transition-normal) var(--easing-default);

        &.active {
          background: var(--color-accent);
          border-color: var(--color-accent);
        }

        &:hover:not(.active) {
          background: var(--color-hover-bg);
          border-color: var(--color-border-hover);
        }

        &:active {
          transform: scale(0.98);
        }
      }
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

  .btn-signout {
    padding: var(--space-8) var(--space-16);
    background: transparent;
    color: var(--color-text);
    border: var(--border-width-thin) solid var(--color-border);
    border-radius: var(--border-radius-medium);
    font-size: var(--font-size-xs);
    cursor: pointer;
    transition: all var(--transition-fast) var(--easing-default);

    &:hover {
      background: var(--color-hover-bg);
      border-color: var(--color-border-hover);
    }

    &:active {
      transform: scale(0.98);
    }
  }
</style>
