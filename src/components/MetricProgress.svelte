<script>
  /**
   * progress metric component for ts-barnum
   * displays percentage progress with visual progress bar
   * includes button to open roadmap modal
   * @component
   */

  import { dailyMetrics, saveDailyMetrics } from '@stores/metrics';

  /**
   * @type {{ onOpenRoadmap?: () => void, onChange?: () => void }}
   */
  let { onOpenRoadmap = () => {}, onChange = () => {} } = $props();

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

<div class="metric-card" class:completed={isCompleted}>
  <div class="metric-card__header">
    <h3 class="metric-card__title">ts-barnum</h3>
    <button
      class="btn-roadmap"
      onclick={onOpenRoadmap}
      aria-label="open project roadmap"
    >
      🗺️
    </button>
  </div>

  <div class="metric-card__value">
    <span class="value">{$dailyMetrics.tsBarnum}%</span>
  </div>

  <div class="progress-bar">
    <div class="progress-bar__fill" style="width: {$dailyMetrics.tsBarnum}%"></div>
  </div>

  <div class="metric-card__controls">
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
    <div class="metric-card__badge">
      🎉 Projet terminé !
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

    &.completed {
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
      font-family: monospace;
    }

    &__value {
      display: flex;
      justify-content: center;
      margin-block-end: var(--space-16);

      .value {
        font-size: var(--font-size-xxxl);
        font-weight: var(--font-weight-bold);
        color: var(--color-accent);
      }
    }

    &__controls {
      display: flex;
      gap: var(--space-12);
      margin-block-start: var(--space-16);
    }

    &__badge {
      margin-block-start: var(--space-16);
      padding: var(--space-12);
      background: var(--color-success);
      border-radius: var(--border-radius-pill);
      text-align: center;
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-medium);
      animation: fadeIn var(--transition-normal) var(--easing-default);
    }
  }

  .btn-roadmap {
    padding: var(--space-8);
    background: rgba(var(--color-white-rgb), 0.1);
    border: var(--border-width-thin) solid var(--color-border);
    border-radius: var(--border-radius-medium);
    font-size: 2rem;
    cursor: pointer;
    transition: all var(--transition-fast) var(--easing-default);
    line-height: 1;

    &:hover {
      background: rgba(var(--color-white-rgb), 0.15);
      border-color: var(--color-border-hover);
      transform: scale(1.1);
    }

    &:active {
      transform: scale(0.95);
    }
  }

  .progress-bar {
    width: 100%;
    height: 1.2rem;
    background: rgba(var(--color-white-rgb), 0.1);
    border-radius: var(--border-radius-pill);
    overflow: hidden;
    position: relative;

    &__fill {
      height: 100%;
      background: linear-gradient(90deg, var(--color-accent), var(--color-success));
      border-radius: var(--border-radius-pill);
      transition: width var(--transition-normal) var(--easing-default);
      position: relative;

      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(
          90deg,
          rgba(255, 255, 255, 0) 0%,
          rgba(255, 255, 255, 0.3) 50%,
          rgba(255, 255, 255, 0) 100%
        );
        animation: shimmer 2s infinite;
      }
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

  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
</style>
