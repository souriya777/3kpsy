<script>
  /**
   * ts-barnum modal component
   * displays progress controls and roadmap management
   * @component
   */

  import { projectsMetrics, saveProjectsMetrics, roadmap, saveRoadmap } from '@stores/metrics';
  import Modal from '@components/Modal.svelte';

  let { isOpen = $bindable(false) } = $props();
  let newMilestone = $state('');

  // increment progress by 5%
  function incrementProgress() {
    projectsMetrics.update(m => {
      if (m.tsBarnum < 100) {
        m.tsBarnum = Math.min(100, m.tsBarnum + 5);
      }
      return m;
    });
    saveProjectsMetrics();
  }

  // decrement progress by 5%
  function decrementProgress() {
    projectsMetrics.update(m => {
      if (m.tsBarnum > 0) {
        m.tsBarnum = Math.max(0, m.tsBarnum - 5);
      }
      return m;
    });
    saveProjectsMetrics();
  }

  // roadmap functions
  function addMilestone() {
    if (!newMilestone.trim()) return;

    roadmap.update(items => {
      const newId = Date.now().toString();
      return [...items, {
        id: newId,
        milestone: newMilestone.trim(),
        done: false
      }];
    });

    newMilestone = '';
    saveRoadmap();
  }

  function toggleMilestone(id) {
    roadmap.update(items => {
      return items.map(item =>
        item.id === id ? { ...item, done: !item.done } : item
      );
    });
    saveRoadmap();
  }

  function removeMilestone(id) {
    roadmap.update(items => items.filter(item => item.id !== id));
    saveRoadmap();
  }

  function handleKeydown(e) {
    if (e.key === 'Enter') {
      addMilestone();
    }
  }
</script>

<Modal bind:isOpen title="ts-barnum">
  {#snippet children()}
    <div class="modal__progress">
      <div class="progress-value">{$projectsMetrics.tsBarnum}%</div>
      <div class="modal-actions">
        <button
          class="btn btn--decrement"
          onclick={decrementProgress}
          disabled={$projectsMetrics.tsBarnum <= 0}
          aria-label="decrease progress by 5%"
        >
          -5%
        </button>
        <button
          class="btn btn--increment"
          onclick={incrementProgress}
          disabled={$projectsMetrics.tsBarnum >= 100}
          aria-label="increase progress by 5%"
        >
          +5%
        </button>
      </div>
    </div>

    <div class="milestone-input">
      <input
        type="text"
        placeholder="Ajouter une étape..."
        bind:value={newMilestone}
        onkeydown={handleKeydown}
        aria-label="New milestone"
      />
      <button class="btn-add" onclick={addMilestone} aria-label="Add milestone">
        +
      </button>
    </div>

    <ul class="milestone-list">
      {#each $roadmap as item (item.id)}
        <li class="milestone-item" class:done={item.done}>
          <button
            class="milestone-checkbox"
            onclick={() => toggleMilestone(item.id)}
            aria-label="Toggle milestone completion"
          >
            {#if item.done}✓{/if}
          </button>
          <span class="milestone-text">{item.milestone}</span>
          <button
            class="btn-remove"
            onclick={() => removeMilestone(item.id)}
            aria-label="Remove milestone"
          >
            ✕
          </button>
        </li>
      {:else}
        <li class="milestone-empty">Aucune étape pour le moment. Ajoute-en une!</li>
      {/each}
    </ul>
  {/snippet}
</Modal>

<style lang="scss">
  .modal__progress {
    padding: var(--space-20);
    border-block-end: 1px solid var(--color-border);
    display: flex;
    flex-direction: column;
    gap: var(--space-16);
    align-items: center;
  }

  .progress-value {
    font-size: var(--font-size-xxl);
    font-weight: var(--font-weight-bold);
    color: var(--color-text);
  }

  .modal-actions {
    display: flex;
    gap: var(--space-12);
    justify-content: center;
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

    &--increment {
      background: rgba(var(--color-accent), 0.2);
      border-color: var(--color-accent);

      &:hover:not(:disabled) {
        background: rgba(var(--color-accent), 0.3);
      }
    }
  }

  .milestone-input {
    display: flex;
    gap: var(--space-8);
    margin-block-end: var(--space-20);

    input {
      flex: 1;
      padding: var(--space-12) var(--space-16);
      background: rgba(var(--color-white-rgb), 0.1);
      border: 1px solid var(--color-border);
      border-radius: var(--border-radius-medium);
      color: var(--color-text);
      font-size: var(--font-size-s);
      transition: all var(--transition-fast) var(--easing-default);

      &::placeholder {
        color: rgba(var(--color-white-rgb), 0.5);
      }

      &:focus {
        outline: none;
        border-color: var(--color-border-hover);
        background: rgba(var(--color-white-rgb), 0.15);
      }
    }
  }

  .btn-add {
    padding: var(--space-12) var(--space-20);
    background: var(--color-accent);
    border: none;
    border-radius: var(--border-radius-medium);
    color: var(--color-text);
    font-size: var(--font-size-l);
    font-weight: var(--font-weight-bold);
    cursor: pointer;
    transition: all var(--transition-fast) var(--easing-default);

    &:hover {
      background: var(--color-accent);
      opacity: 0.9;
    }
  }

  .milestone-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: var(--space-12);
  }

  .milestone-item {
    display: flex;
    align-items: center;
    gap: var(--space-12);
    padding: var(--space-12);
    background: rgba(var(--color-white-rgb), 0.05);
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius-medium);
    transition: all var(--transition-fast) var(--easing-default);

    &:hover {
      background: rgba(var(--color-white-rgb), 0.1);
      border-color: var(--color-border-hover);
    }

    &.done {
      opacity: 0.6;

      .milestone-text {
        text-decoration: line-through;
      }

      .milestone-checkbox {
        background: var(--color-success);
        border-color: var(--color-success);
      }
    }
  }

  .milestone-checkbox {
    width: 2.4rem;
    height: 2.4rem;
    border: 2px solid var(--color-border);
    border-radius: var(--border-radius-small);
    background: transparent;
    color: var(--color-text);
    font-size: var(--font-size-s);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: all var(--transition-fast) var(--easing-default);

    &:hover {
      border-color: var(--color-border-hover);
    }
  }

  .milestone-text {
    flex: 1;
    color: var(--color-text);
    font-size: var(--font-size-s);
  }

  .btn-remove {
    background: none;
    border: none;
    color: rgba(var(--color-white-rgb), 0.5);
    font-size: var(--font-size-m);
    cursor: pointer;
    padding: var(--space-4);
    line-height: 1;
    transition: all var(--transition-fast) var(--easing-default);
    flex-shrink: 0;

    &:hover {
      color: var(--color-error);
    }
  }

  .milestone-empty {
    text-align: center;
    padding: var(--space-32);
    color: rgba(var(--color-white-rgb), 0.5);
    font-size: var(--font-size-s);
  }
</style>
