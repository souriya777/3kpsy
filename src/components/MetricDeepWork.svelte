<script>
  /**
   * deep work metric component
   * tracks hours of deep work with +/- 0.5h increments
   * @component
   */

  import { dailyMetrics, saveDailyMetrics } from '@stores/metrics';

  /**
   * @type {{ onChange?: () => void }}
   */
  let { onChange = () => {} } = $props();

  // increment deep work by 0.5h
  function increment() {
    dailyMetrics.update(m => {
      if (m.deepWork < 24) {
        m.deepWork += 0.5;
      }
      return m;
    });
    saveDailyMetrics();
    onChange();
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
    onChange();
  }

  // computed: check if goal is reached
  let isGoalReached = $derived($dailyMetrics.deepWork >= $dailyMetrics.deepWorkGoal);
</script>

<div class="metric" class:goal-reached={isGoalReached}>
  <div class="metric__row">
    <h3 class="metric__title">🧠 DW</h3>
    <div class="metric__value">
      <span class="value" class:goal-reached={isGoalReached}>{$dailyMetrics.deepWork.toFixed(1)}h</span>
      <span class="goal">/ {$dailyMetrics.deepWorkGoal}h</span>
    </div>
  </div>

  <div class="metric__actions">
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
</div>

<style lang="scss">
  .metric {
    padding: var(--space-16);
    border-bottom: 1px solid rgba(var(--color-white-rgb), 0.1);

    &.goal-reached {
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
      color: rgba(var(--color-white-rgb), 0.7);
    }

    &__value {
      display: flex;
      align-items: baseline;
      gap: var(--space-4);

      .value {
        font-size: var(--font-size-xl);
        font-weight: var(--font-weight-bold);
        line-height: 1;
        transition: color var(--transition-fast) var(--easing-default);

        &.goal-reached {
          color: var(--color-success);
        }
      }

      .goal {
        font-size: var(--font-size-xs);
        color: rgba(var(--color-white-rgb), 0.5);
      }
    }

    &__actions {
      display: flex;
      gap: var(--space-8);
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
</style>
