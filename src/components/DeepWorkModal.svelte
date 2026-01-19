<script>
  /**
   * deep work modal component
   * full-screen modal for deep work controls
   * @component
   */

  import { dailyMetrics, saveDailyMetrics } from '@stores/metrics';
  import Modal from '@components/Modal.svelte';

  let { isOpen = $bindable(false) } = $props();

  // increment deep work by 0.5h
  function increment() {
    dailyMetrics.update(m => {
      if (m.deepWork < 24) {
        m.deepWork += 0.5;
      }
      return m;
    });
    saveDailyMetrics();
  }

  // decrement deep work by 0.5h
  function decrement() {
    dailyMetrics.update(m => {
      if (m.deepWork > 0) {
        m.deepWork -= 0.5;
      }
      return m;
    });
    saveDailyMetrics();
  }
</script>

<Modal bind:isOpen title="Deep Work">
  {#snippet children()}
    <div class="modal-actions">
      <button
        class="btn btn--decrement"
        onclick={decrement}
        disabled={$dailyMetrics.deepWork <= 0}
        aria-label="decrease by 0.5 hours"
      >
        -0.5h
      </button>
      <button
        class="btn btn--increment"
        onclick={increment}
        disabled={$dailyMetrics.deepWork >= 24}
        aria-label="increase by 0.5 hours"
      >
        +0.5h
      </button>
    </div>
  {/snippet}
</Modal>

<style lang="scss">
  .modal-actions {
    display: flex;
    gap: var(--space-12);
    justify-content: center;
  }

  .btn {
    padding: var(--space-8) var(--space-12);
    background: rgba(var(--color-white-rgb), 0.1);
    color: var(--color-text);
    border: var(--border-width-thin) solid var(--color-border);
    border-radius: var(--border-radius-medium);
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-medium);
    cursor: pointer;
    transition: all var(--transition-fast) var(--easing-default);

    &:hover:not(:disabled) {
      background: rgba(var(--color-white-rgb), 0.15);
      border-color: var(--color-border-hover);
    }

    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    &--increment {
      background: rgba(var(--color-accent), 0.2);
      border-color: var(--color-accent);

      &:hover:not(:disabled) {
        background: rgba(var(--color-accent), 0.3);
      }
    }
  }
</style>
