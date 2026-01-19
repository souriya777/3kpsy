<script>
  /**
   * progress metric component for ts-barnum
   * displays percentage progress with visual progress bar
   * includes button to open roadmap modal
   * @component
   */

  import { dailyMetrics, saveDailyMetrics } from '@stores/metrics';

  /**
   * @type {{ onChange?: () => void }}
   */
  let { onChange = () => {} } = $props();

  // increment progress by 5%
  function incrementProgress() {
    dailyMetrics.update(m => {
      if (m.tsBarnum < 100) {
        m.tsBarnum = Math.min(100, m.tsBarnum + 5);
      }
      return m;
    });
    saveDailyMetrics();
    onChange();
  }

  // decrement progress by 5%
  function decrementProgress() {
    dailyMetrics.update(m => {
      if (m.tsBarnum > 0) {
        m.tsBarnum = Math.max(0, m.tsBarnum - 5);
      }
      return m;
    });
    saveDailyMetrics();
    onChange();
  }

  // check if project is completed
  const isCompleted = $derived($dailyMetrics.tsBarnum >= 100);
</script>

<div class="metric" class:completed={isCompleted}>
  <div class="metric__row">
    <h3 class="metric__title">ts-barnum</h3>
    <div class="metric__value">
      <span class="value">{$dailyMetrics.tsBarnum}%</span>
    </div>
  </div>

  <div class="metric__controls">
    <button
      class="btn btn--decrement"
      onclick={decrementProgress}
      disabled={$dailyMetrics.tsBarnum <= 0}
      aria-label="decrease progress by 5%"
    >
      -5%
    </button>
    <button
      class="btn btn--increment"
      onclick={incrementProgress}
      disabled={$dailyMetrics.tsBarnum >= 100}
      aria-label="increase progress by 5%"
    >
      +5%
    </button>
  </div>

  {#if isCompleted}
    <div class="metric__badge">
      🎉 Projet terminé !
    </div>
  {/if}
</div>

<style lang="scss">
  .metric {
    padding: var(--space-16);
    border-bottom: 1px solid rgba(var(--color-white-rgb), 0.1);

    &.completed {
      background: rgba(76, 175, 80, 0.05);
    }

    &__row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-block-end: var(--space-12);
    }

    &__title {
      font-size: var(--font-size-s);
      font-weight: var(--font-weight-medium);
      margin: 0;
      font-family: monospace;
      color: rgba(var(--color-white-rgb), 0.7);
    }

    &__value {
      .value {
        font-size: var(--font-size-xl);
        font-weight: var(--font-weight-bold);
        color: var(--color-accent);
      }
    }

    &__controls {
      display: flex;
      gap: var(--space-8);
    }

    &__badge {
      margin-block-start: var(--space-12);
      padding: var(--space-8) var(--space-12);
      background: var(--color-success);
      border-radius: var(--border-radius-pill);
      text-align: center;
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-medium);
      animation: fadeIn var(--transition-normal) var(--easing-default);
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

    &--increment {
      background: rgba(var(--color-accent), 0.2);
      border-color: var(--color-accent);

      &:hover:not(:disabled) {
        background: rgba(var(--color-accent), 0.3);
      }
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-1rem);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
