<script>
  // app entry point
  let currentView = $state('home'); // 'home' or 'stats'
</script>

<div class="app">
  <header class="app__header">
    <h1>3kpsy</h1>
  </header>

  <main class="app__main">
    {#if currentView === 'home'}
      <div class="home">
        <p>Home view - Metrics coming soon...</p>
      </div>
    {:else}
      <div class="stats">
        <p>Stats view coming soon...</p>
      </div>
    {/if}
  </main>

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
</div>

<style lang="scss">
  .app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;

    &__header {
      padding: var(--space-16);
      text-align: center;
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
</style>
