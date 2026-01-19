<script>
  /**
   * drawer menu component
   * slide-in navigation drawer from left
   * @component
   */

  import { signOutUser, user } from '@stores/auth';
  import { seedTestData } from '@stores/metrics.test';

  let { isOpen = $bindable(false), currentView = $bindable('home') } = $props();
  let isSeeding = $state(false);

  function close() {
    isOpen = false;
  }

  function navigateTo(view) {
    currentView = view;
    close();
  }

  async function handleSeedTestData() {
    isSeeding = true;
    try {
      await seedTestData();
      console.log('✅ Test data seeded successfully!');
    } catch (error) {
      console.error('❌ Failed to seed test data:', error);
    } finally {
      isSeeding = false;
    }
  }

  async function handleSignOut() {
    await signOutUser();
    close();
  }
</script>

<!-- overlay -->
{#if isOpen}
  <div class="drawer-overlay" onclick={close} role="presentation"></div>
{/if}

<!-- drawer -->
<div class="drawer" class:open={isOpen} role="navigation" aria-label="main navigation">
  <div class="drawer__header">
    <h2>3kpsy</h2>
    <button class="btn-close" onclick={close} aria-label="close menu">
      ✕
    </button>
  </div>

  <nav class="drawer__nav">
    <button
      class="nav-item"
      class:active={currentView === 'home'}
      onclick={() => navigateTo('home')}
    >
      <span class="nav-label">metrics</span>
    </button>

    <button
      class="nav-item"
      class:active={currentView === 'stats'}
      onclick={() => navigateTo('stats')}
    >
      <span class="nav-label">stats</span>
    </button>

    <button
      class="nav-item"
      onclick={handleSeedTestData}
      disabled={isSeeding}
    >
      <span class="nav-label">{isSeeding ? 'seeding...' : 'seed test data'}</span>
    </button>
  </nav>

  <div class="drawer__footer">
    {#if $user}
      <button class="btn-signout" onclick={handleSignOut}>
        <span>Sign Out</span>
      </button>
    {/if}
  </div>
</div>

<style lang="scss">
  .drawer-overlay {
    position: fixed;
    inset: 0;
    background: rgba(var(--color-black-rgb), 0.5);
    z-index: var(--z-index-modal);
    animation: fadeIn var(--transition-fast) var(--easing-default);
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .drawer {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 28rem;
    max-width: 80vw;
    background: var(--color-primary);
    z-index: calc(var(--z-index-modal) + 1);
    display: flex;
    flex-direction: column;
    transform: translateX(-100%);
    transition: transform var(--transition-normal) var(--easing-smooth);

    &.open {
      transform: translateX(0);
    }

    &__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--space-16);
      border-bottom: 1px solid var(--color-border);

      h2 {
        margin: 0;
        font-size: var(--font-size-l);
        font-weight: var(--font-weight-bold);
      }
    }

    &__nav {
      flex: 1;
      padding-inline: var(--space-16);
      display: flex;
      flex-direction: column;
    }

    &__footer {
      padding: var(--space-16);
      border-top: 1px solid var(--color-border);
    }
  }

  .btn-close {
    background: none;
    border: none;
    color: var(--color-text);
    font-size: var(--font-size-l);
    cursor: pointer;
    padding: var(--space-8);
    line-height: 1;
    transition: opacity var(--transition-fast) var(--easing-default);

    &:hover {
      opacity: 0.8;
    }
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: var(--space-16);
    padding-inline: var(--space-16);
    padding-block-start: var(--space-16);
    background: transparent;
    border: 1px solid transparent;
    border-radius: var(--border-radius-medium);
    color: var(--color-text);
    font-size: var(--font-size-s);
    cursor: pointer;
    transition: all var(--transition-fast) var(--easing-default);
    text-align: left;

    &:hover:not(:disabled) {
      background: rgba(var(--color-white-rgb), 0.05);
      border-color: var(--color-border);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  .nav-icon {
    font-size: var(--font-size-l);
  }

  .nav-label {
    flex: 1;
    font-weight: var(--font-weight-medium);
  }

  .btn-signout {
    width: 100%;
    padding: var(--space-12);
    background: rgba(var(--color-white-rgb), 0.1);
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius-medium);
    color: var(--color-text);
    font-size: var(--font-size-s);
    font-weight: var(--font-weight-medium);
    cursor: pointer;
    transition: all var(--transition-fast) var(--easing-default);

    &:hover {
      background: rgba(var(--color-white-rgb), 0.15);
      border-color: var(--color-border-hover);
    }
  }
</style>
