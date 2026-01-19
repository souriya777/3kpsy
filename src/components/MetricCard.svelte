<script>
  /**
   * generic metric card component
   * reusable card for displaying metrics with consistent styling
   * @component
   */

  /**
   * @type {{
   *   title: string,
   *   value: string,
   *   onOpenModal?: () => void,
   *   highlighted?: boolean,
   *   badge?: string
   * }}
   */
  let { title, value, onOpenModal = () => {}, highlighted = false, badge = '' } = $props();
</script>

<div class="metric" class:highlighted={highlighted}>
  <button class="metric__row" onclick={onOpenModal}>
    <div class="metric__value">
      <span class="value" class:highlighted={highlighted}>{@html value}</span>
    </div>
    <h3 class="metric__title">{title}</h3>
  </button>

  {#if badge}
    <div class="metric__badge">
      {badge}
    </div>
  {/if}
</div>

<style lang="scss">
  .metric {
    padding: var(--space-16);
    min-height: 9.6rem;
    display: flex;
    flex-direction: column;
    justify-content: center;

    &.highlighted {
      background: rgba(76, 175, 80, 0.05);
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
        display: flex;
        align-items: center;
        gap: var(--space-4);
        transition: color var(--transition-fast) var(--easing-default);

        &.highlighted {
          color: var(--color-success);
        }

        :global(.goal-badge) {
          font-size: var(--font-size-s);
        }
      }
    }

    &__badge {
      margin-block-start: var(--space-12);
      padding: var(--space-8) var(--space-12);
      background: var(--color-success);
      border-radius: var(--border-radius-pill);
      text-align: center;
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-medium);
    }
  }
</style>
