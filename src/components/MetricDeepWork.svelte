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
    if (dailyMetrics.deepWork < 24) {
      dailyMetrics.deepWork += 0.5;
      saveDailyMetrics();
      onChange();
    }
  }

  // decrement deep work by 0.5h
  function decrement() {
    if (dailyMetrics.deepWork > 0) {
      dailyMetrics.deepWork -= 0.5;
      saveDailyMetrics();
      onChange();
    }
  }

  // computed: check if goal is reached
  let isGoalReached = $derived(dailyMetrics.deepWork >= dailyMetrics.deepWorkGoal);
</script>

<div class="metric-card" class:goal-reached={isGoalReached}>
  <div class="metric-card__header">
    <h3 class="metric-card__title">Deep Work</h3>
    <span class="metric-card__icon">🧠</span>
  </div>

  <div class="metric-card__value">
    <span class="value">{dailyMetrics.deepWork.toFixed(1)}h</span>
    <span class="goal">/ {dailyMetrics.deepWorkGoal}h</span>
  </div>

  <div class="metric-card__actions">
    <button
      class="btn btn--decrement"
      onclick={decrement}
      disabled={dailyMetrics.deepWork <= 0}
      aria-label="Décrémenter de 0.5 heure"
    >
      -0.5h
    </button>
    <button
      class="btn btn--increment"
      onclick={increment}
      disabled={dailyMetrics.deepWork >= 24}
      aria-label="Incrémenter de 0.5 heure"
    >
      +0.5h
    </button>
  </div>

  {#if isGoalReached}
    <div class="metric-card__badge">
      ✨ Objectif atteint !
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

    &.goal-reached {
      border-color: var(--color-success);
      background: rgba(76, 175, 80, 0.1);
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
      align-items: baseline;
      gap: var(--space-8);
      margin-block-end: var(--space-20);

      .value {
        font-size: 4.8rem;
        font-weight: var(--font-weight-bold);
        line-height: 1;
      }

      .goal {
        font-size: var(--font-size-s);
        color: rgba(var(--color-white-rgb), 0.6);
      }
    }

    &__actions {
      display: flex;
      gap: var(--space-12);
    }

    &__badge {
      margin-block-start: var(--space-16);
      padding: var(--space-8) var(--space-16);
      background: var(--color-success);
      border-radius: var(--border-radius-pill);
      text-align: center;
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-medium);
      animation: fadeIn var(--transition-normal) var(--easing-default);
    }
  }

  .btn {
    flex: 1;
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
