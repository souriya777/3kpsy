<script>
  /**
   * sleep metric component
   * tracks wake-up time, bedtime, and nap status
   * displays goal progress for wake-up time
   * @component
   */

  import { dailyMetrics, saveDailyMetrics } from '@stores/metrics';
  import Modal from '@components/Modal.svelte';

  /**
   * @type {{ onChange?: () => void }}
   */
  let { onChange = () => {} } = $props();
  let showModal = $state(false);

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

<div class="metric">
  <button class="metric__row" onclick={() => showModal = true}>
    <div class="metric__value">
      <span class="value" class:goal-reached={isWakeUpGoalReached()}>
        {$dailyMetrics.wakeUp}
        {#if isWakeUpGoalReached()}
          <span class="goal-badge">🎯</span>
        {/if}
      </span>
    </div>
    <h3 class="metric__title">sommeil ({$dailyMetrics.wakeUpGoal})</h3>
  </button>
</div>

<Modal bind:isOpen={showModal} title="Sleep">
  <div class="metric__fields">
    <div class="field-row">
      <div class="field field--time">
        <label for="wakeup">Levé</label>
        <input
          id="wakeup"
          type="time"
          value={$dailyMetrics.wakeUp}
          oninput={updateWakeUp}
          class:goal-reached={isWakeUpGoalReached()}
        />
      </div>

      <div class="field field--time">
        <label for="sleep">Couché</label>
        <input
          id="sleep"
          type="time"
          value={$dailyMetrics.sleep}
          oninput={updateSleep}
        />
      </div>
    </div>

    <div class="field field--nap">
      <label for="nap" class="checkbox-label">
        <input
          id="nap"
          type="checkbox"
          checked={$dailyMetrics.nap}
          onchange={toggleNap}
        />
        <span>Sieste</span>
      </label>
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
        line-height: 1;
        color: var(--color-text);
        display: flex;
        align-items: center;
        gap: var(--space-4);
        transition: color var(--transition-fast) var(--easing-default);

        &.goal-reached {
          color: var(--color-success);
        }
      }
    }
  }

  .metric__fields {
    display: flex;
    flex-direction: column;
    gap: var(--space-12);
  }

  .field-row {
    display: flex;
    gap: var(--space-12);
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: var(--space-8);

    &--time {
      flex: 1;
    }

    label {
      font-size: var(--font-size-xs);
      color: rgba(var(--color-white-rgb), 0.8);
      font-weight: var(--font-weight-medium);
      display: flex;
      align-items: center;
      gap: var(--space-8);
    }

    .goal-badge {
      font-size: var(--font-size-s);
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
      margin: 0;
    }
  }

  .checkbox-label {
    display: flex;
    align-items: center;
    gap: var(--space-8);
    cursor: pointer;
    font-size: var(--font-size-s);
    color: rgba(var(--color-white-rgb), 0.8);
    font-weight: var(--font-weight-medium);

    input[type="checkbox"] {
      appearance: none;
      -webkit-appearance: none;
      width: 2rem;
      height: 2rem;
      cursor: pointer;
      background: rgba(var(--color-white-rgb), 0.1);
      border: var(--border-width-thin) solid var(--color-border);
      border-radius: var(--border-radius-small);
      position: relative;
      transition: all var(--transition-fast) var(--easing-default);

      &:checked {
        background: rgba(var(--color-accent), 0.2);
        border-color: var(--color-accent);
      }

      &:checked::after {
        content: '✓';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: var(--color-text);
        font-size: 1.4rem;
        font-weight: var(--font-weight-bold);
      }
    }

    span {
      user-select: none;
    }
  }
</style>
