<script>
  /**
   * projects modal component
   * full-screen modal for projects controls
   * @component
   */

  import { projectsMetrics, saveProjectsMetrics } from '@stores/metrics';
  import Modal from '@components/Modal.svelte';

  let { isOpen = $bindable(false) } = $props();

  // increment completed projects
  function incrementCompleted() {
    projectsMetrics.update(m => {
      m.completed++;
      return m;
    });
    saveProjectsMetrics();
  }

  // decrement completed projects
  function decrementCompleted() {
    projectsMetrics.update(m => {
      if (m.completed > 0) {
        m.completed--;
      }
      return m;
    });
    saveProjectsMetrics();
  }

  // increment in-progress projects
  function incrementInProgress() {
    projectsMetrics.update(m => {
      m.inProgress++;
      return m;
    });
    saveProjectsMetrics();
  }

  // decrement in-progress projects
  function decrementInProgress() {
    projectsMetrics.update(m => {
      if (m.inProgress > 0) {
        m.inProgress--;
      }
      return m;
    });
    saveProjectsMetrics();
  }
</script>

<Modal bind:isOpen title="Projets">
  {#snippet children()}
    <div class="modal-controls">
      <div class="control-group">
        <label>terminés</label>
        <div class="buttons">
          <button
            class="btn btn--small"
            onclick={decrementCompleted}
            disabled={$projectsMetrics.completed <= 0}
            aria-label="decrease completed projects"
          >
            -
          </button>
          <button
            class="btn btn--small btn--increment"
            onclick={incrementCompleted}
            aria-label="increase completed projects"
          >
            +
          </button>
        </div>
      </div>

      <div class="control-group">
        <label>en cours</label>
        <div class="buttons">
          <button
            class="btn btn--small"
            onclick={decrementInProgress}
            disabled={$projectsMetrics.inProgress <= 0}
            aria-label="decrease in-progress projects"
          >
            -
          </button>
          <button
            class="btn btn--small btn--increment"
            onclick={incrementInProgress}
            aria-label="increase in-progress projects"
          >
            +
          </button>
        </div>
      </div>
    </div>
  {/snippet}
</Modal>

<style lang="scss">
  .modal-controls {
    display: flex;
    flex-direction: row;
    gap: var(--space-20);
    justify-content: center;
  }

  .control-group {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-8);
    flex: 1;

    label {
      font-size: var(--font-size-xs);
      color: rgba(var(--color-white-rgb), 0.8);
      font-weight: var(--font-weight-medium);
    }

    .buttons {
      display: flex;
      gap: var(--space-4);
      width: 100%;
    }
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

    &--small {
      min-width: 3.2rem;
      width: 3.2rem;
      height: 3.2rem;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
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
