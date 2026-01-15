<script>
  /**
   * sleep metric component
   * tracks wake-up time, bedtime, and nap status
   * displays goal progress for wake-up time
   * @component
   */

  import { dailyMetrics, saveDailyMetrics } from '@stores/metrics';

  /**
   * @type {{ onChange?: () => void }}
   */
  let { onChange = () => {} } = $props();

  // toggle nap status
  function toggleNap() {
    dailyMetrics.update(m => {
      m.nap = !m.nap;
      return m;
    });
    saveDailyMetrics();
    onChange();
  }

  // update wake-up time
  function updateWakeUp(event) {
    dailyMetrics.update(m => {
      m.wakeUp = event.target.value;
      return m;
    });
    saveDailyMetrics();
    onChange();
  }

  // update sleep time
  function updateSleep(event) {
    dailyMetrics.update(m => {
      m.sleep = event.target.value;
      return m;
    });
    saveDailyMetrics();
    onChange();
  }

  // check if wake-up goal is reached (earlier or equal to goal)
  const isWakeUpGoalReached = $derived(() => {
    if (!$dailyMetrics.wakeUp || !$dailyMetrics.wakeUpGoal) return false;
    return $dailyMetrics.wakeUp <= $dailyMetrics.wakeUpGoal;
  });
</script>

<div class="metric-card">
  <div class="metric-card__header">
    <h3 class="metric-card__title">Sommeil</h3>
    <span class="metric-card__icon">😴</span>
  </div>

  <div class="metric-card__fields">
    <div class="field">
      <label for="wakeup">
        Levé
        {#if isWakeUpGoalReached()}
          <span class="goal-badge">🎯</span>
        {/if}
      </label>
      <input
        id="wakeup"
        type="time"
        value={$dailyMetrics.wakeUp}
        oninput={updateWakeUp}
        class:goal-reached={isWakeUpGoalReached()}
      />
      <span class="goal-hint">Objectif: {$dailyMetrics.wakeUpGoal}</span>
    </div>

    <div class="field">
      <label for="sleep">Couché</label>
      <input
        id="sleep"
        type="time"
        value={$dailyMetrics.sleep}
        oninput={updateSleep}
      />
    </div>

    <div class="field field--nap">
      <label>Sieste</label>
      <button
        class="btn-toggle"
        class:active={$dailyMetrics.nap}
        onclick={toggleNap}
        aria-label="toggle nap status"
      >
        {$dailyMetrics.nap ? 'Oui' : 'Non'}
      </button>
    </div>
  </div>
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

    &__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-block-end: var(--space-20);
    }

    &__title {
      font-size: var(--font-size-s);
      font-weight: var(--font-weight-medium);
      margin: 0;
    }

    &__icon {
      font-size: 2.4rem;
    }

    &__fields {
      display: flex;
      flex-direction: column;
      gap: var(--space-16);
    }
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: var(--space-8);

    label {
      font-size: var(--font-size-xs);
      color: rgba(var(--color-white-rgb), 0.8);
      font-weight: var(--font-weight-medium);
      display: flex;
      align-items: center;
      gap: var(--space-8);
    }

    .goal-badge {
      font-size: var(--font-size-xs);
    }

    .goal-hint {
      font-size: var(--font-size-xs);
      color: rgba(var(--color-white-rgb), 0.5);
      font-style: italic;
    }

    input[type="time"] {
      padding: var(--space-12);
      background: rgba(var(--color-white-rgb), 0.1);
      color: var(--color-text);
      border: var(--border-width-thin) solid var(--color-border);
      border-radius: var(--border-radius-medium);
      font-size: var(--font-size-m);
      font-family: inherit;
      transition: all var(--transition-fast) var(--easing-default);

      &:focus {
        outline: none;
        border-color: var(--color-accent);
        background: rgba(var(--color-white-rgb), 0.15);
      }

      &.goal-reached {
        border-color: var(--color-success);
      }

      // style time input for webkit browsers
      &::-webkit-calendar-picker-indicator {
        filter: invert(1);
        cursor: pointer;
      }
    }

    &--nap {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
  }

  .btn-toggle {
    padding: var(--space-8) var(--space-20);
    background: rgba(var(--color-white-rgb), 0.1);
    color: var(--color-text);
    border: var(--border-width-thin) solid var(--color-border);
    border-radius: var(--border-radius-medium);
    font-size: var(--font-size-s);
    font-weight: var(--font-weight-medium);
    cursor: pointer;
    transition: all var(--transition-fast) var(--easing-default);
    min-width: 6rem;

    &:hover {
      background: rgba(var(--color-white-rgb), 0.15);
      border-color: var(--color-border-hover);
    }

    &:active {
      transform: scale(0.98);
    }

    &.active {
      background: rgba(var(--color-success-rgb), 0.2);
      border-color: var(--color-success);
      color: var(--color-success);
    }
  }
</style>
