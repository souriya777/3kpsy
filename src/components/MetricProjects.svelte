<script>
  /**
   * projects metric component
   * tracks completed vs in-progress projects (X/Y format)
   * alerts if gap > 2
   * @component
   */

  import { projectsMetrics, saveProjectsMetrics } from '@stores/metrics';
  import Modal from '@components/Modal.svelte';

  /**
   * @type {{ onChange?: () => void }}
   */
  let { onChange = () => {} } = $props();
  let showModal = $state(false);

  // increment completed projects
  function incrementCompleted() {
    projectsMetrics.update(m => {
      m.completed++;
      return m;
    });
    saveProjectsMetrics();
    onChange();
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
    onChange();
  }

  // increment in-progress projects
  function incrementInProgress() {
    projectsMetrics.update(m => {
      m.inProgress++;
      return m;
    });
    saveProjectsMetrics();
    onChange();
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
    onChange();
  }

  // check if gap between in-progress and completed is > 2
  const hasGapAlert = $derived(() => {
    const gap = $projectsMetrics.inProgress - $projectsMetrics.completed;
    return gap > 2;
  });
</script>

<div class="metric">
  <button class="metric__row" onclick={() => showModal = true}>
    <div class="metric__value">
      <span class="value">
        {$projectsMetrics.completed} / {$projectsMetrics.inProgress}
      </span>
    </div>
    <h3 class="metric__title">projets</h3>
  </button>
</div>

<Modal bind:isOpen={showModal} title="Projets">
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
</Modal>

<style lang="scss">
  .metric {
    padding: var(--space-16);
    min-height: 9.6rem;
    display: flex;
    flex-direction: column;
    justify-content: center;

    &.alert {
      background: rgba(var(--color-accent-rgb), 0.05);
    }

    &__row {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-8);
      width: 100%;
      background: none;
      border: none;
      padding: 0;
      cursor: pointer;
    }

    &__title {
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-medium);
      margin: 0;
      color: rgba(var(--color-white-rgb), 0.5);
    }

    &__value {
      min-height: 4rem;
      display: flex;
      align-items: center;
      justify-content: center;

      .value {
        font-size: var(--font-size-xxl);
        font-weight: var(--font-weight-bold);
        color: var(--color-text);
        line-height: 1;
        transition: color var(--transition-fast) var(--easing-default);

        &.alert {
          color: var(--color-accent);
        }
      }
    }
  }

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
      transform: scale(1.02);
    }

    &:active:not(:disabled) {
      transform: scale(0.98);
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
