<script>
  /**
   * projects metric component
   * tracks completed vs in-progress projects (X/Y format)
   * alerts if gap > 2
   * @component
   */

  import { projectsMetrics, saveProjectsMetrics } from '@stores/metrics';

  /**
   * @type {{ onChange?: () => void }}
   */
  let { onChange = () => {} } = $props();

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

<div class="metric-card" class:alert={hasGapAlert()}>
  <div class="metric-card__header">
    <h3 class="metric-card__title">Projets</h3>
    <span class="metric-card__icon">📊</span>
  </div>

  <div class="metric-card__value">
    <span class="value">
      {$projectsMetrics.completed} / {$projectsMetrics.inProgress}
    </span>
  </div>

  <div class="metric-card__controls">
    <div class="control-group">
      <label>Terminés</label>
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
      <label>En cours</label>
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

  {#if hasGapAlert()}
    <div class="metric-card__alert">
      ⚠️ Écart > 2 : Terminer des projets en cours
    </div>
  {/if}
</div>

<style lang="scss">
  .metric-card {
    background: rgba(var(--color-white-rgb), 0.05);
    border: var(--border-width-thin) solid var(--color-border);
    border-radius: var(--border-radius-large);
    padding: var(--space-24);
    transition: all var(--transition-normal) var(--easing-default);

    &:hover {
      background: rgba(var(--color-white-rgb), 0.08);
      border-color: var(--color-border-hover);
      transform: translateY(-2px);
      box-shadow: var(--shadow-medium);
    }

    &.alert {
      border-color: var(--color-warning);
      background: rgba(255, 152, 0, 0.1);
    }

    &__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-block-end: var(--space-16);
    }

    &__title {
      font-size: var(--font-size-s);
      font-weight: var(--font-weight-medium);
      margin: 0;
    }

    &__icon {
      font-size: 2.4rem;
    }

    &__value {
      display: flex;
      justify-content: center;
      margin-block-end: var(--space-20);

      .value {
        font-size: var(--font-size-xxxl);
        font-weight: var(--font-weight-bold);
        color: var(--color-text);
      }
    }

    &__controls {
      display: flex;
      flex-direction: column;
      gap: var(--space-12);
    }

    &__alert {
      margin-block-start: var(--space-16);
      padding: var(--space-12);
      background: rgba(255, 152, 0, 0.2);
      border: var(--border-width-thin) solid var(--color-warning);
      border-radius: var(--border-radius-medium);
      color: var(--color-warning);
      text-align: center;
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-medium);
    }
  }

  .control-group {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-12);

    label {
      font-size: var(--font-size-xs);
      color: rgba(var(--color-white-rgb), 0.8);
      font-weight: var(--font-weight-medium);
    }

    .buttons {
      display: flex;
      gap: var(--space-8);
    }
  }

  .btn {
    padding: var(--space-12) var(--space-16);
    background: rgba(var(--color-white-rgb), 0.1);
    color: var(--color-text);
    border: var(--border-width-thin) solid var(--color-border);
    border-radius: var(--border-radius-medium);
    font-size: var(--font-size-s);
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
      min-width: 4rem;
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
