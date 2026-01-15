<script>
  import { roadmap, saveRoadmap } from '@stores/metrics';

  let { isOpen = $bindable(false) } = $props();
  let newMilestone = $state('');

  function close() {
    isOpen = false;
  }

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
    } else if (e.key === 'Escape') {
      close();
    }
  }

  // calculate progress percentage
  let progress = $derived(() => {
    const total = $roadmap.length;
    if (total === 0) return 0;
    const completed = $roadmap.filter(item => item.done).length;
    return Math.round((completed / total) * 100);
  });
</script>

{#if isOpen}
  <div class="modal-overlay" onclick={close} role="presentation">
    <div class="modal" onclick={(e) => e.stopPropagation()} role="dialog" aria-labelledby="modal-title" aria-modal="true">
      <header class="modal__header">
        <h2 id="modal-title">Roadmap ts-barnum</h2>
        <button class="btn-close" onclick={close} aria-label="Close roadmap">
          ✕
        </button>
      </header>

      <div class="modal__progress">
        <div class="progress-bar">
          <div class="progress-bar__fill" style="width: {progress()}%"></div>
        </div>
        <p class="progress-text">{progress()}% complété</p>
      </div>

      <div class="modal__body">
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
      </div>
    </div>
  </div>
{/if}

<style lang="scss">
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: var(--color-overlay);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-16);
    z-index: var(--z-index-modal);
    animation: fadeIn var(--transition-fast) var(--easing-default);
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .modal {
    background: var(--color-primary);
    border: 2px solid var(--color-border);
    border-radius: var(--border-radius-large);
    max-width: 50rem;
    width: 100%;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
    box-shadow: var(--shadow-large);
    animation: slideUp var(--transition-normal) var(--easing-default);
  }

  @keyframes slideUp {
    from {
      transform: translateY(2rem);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .modal__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-20);
    border-bottom: 1px solid var(--color-border);
  }

  .btn-close {
    background: none;
    border: none;
    color: var(--color-text);
    font-size: var(--font-size-l);
    cursor: pointer;
    padding: var(--space-8);
    line-height: 1;
    transition: transform var(--transition-fast) var(--easing-default);

    &:hover {
      transform: scale(1.2);
    }

    &:active {
      transform: scale(0.9);
    }
  }

  .modal__progress {
    padding: var(--space-20);
    border-bottom: 1px solid var(--color-border);
  }

  .progress-bar {
    width: 100%;
    height: 0.8rem;
    background: var(--color-border);
    border-radius: var(--border-radius-pill);
    overflow: hidden;
  }

  .progress-bar__fill {
    height: 100%;
    background: var(--color-accent);
    transition: width var(--transition-normal) var(--easing-default);
  }

  .progress-text {
    margin-top: var(--space-8);
    text-align: center;
    font-size: var(--font-size-s);
    color: var(--color-text);
    font-weight: var(--font-weight-medium);
  }

  .modal__body {
    padding: var(--space-20);
    overflow-y: auto;
    flex: 1;
  }

  .milestone-input {
    display: flex;
    gap: var(--space-8);
    margin-bottom: var(--space-20);

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
      transform: translateY(-2px);
      box-shadow: var(--shadow-medium);
    }

    &:active {
      transform: translateY(0);
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
      transform: scale(1.1);
    }

    &:active {
      transform: scale(0.95);
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
      transform: scale(1.2);
    }

    &:active {
      transform: scale(0.9);
    }
  }

  .milestone-empty {
    text-align: center;
    padding: var(--space-32);
    color: rgba(var(--color-white-rgb), 0.5);
    font-size: var(--font-size-s);
  }
</style>
