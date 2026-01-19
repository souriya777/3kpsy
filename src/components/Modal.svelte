<script>
  /**
   * generic modal component
   * reusable modal with overlay and close button
   * @component
   */

  let { isOpen = $bindable(false), title = '', children } = $props();

  function close() {
    isOpen = false;
  }

  function handleKeydown(e) {
    if (e.key === 'Escape') {
      close();
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if isOpen}
  <div class="modal" role="dialog" aria-labelledby="modal-title" aria-modal="true">
    <header class="modal__header">
      <h2 id="modal-title">{title}</h2>
      <button class="btn-close" onclick={close} aria-label="Close modal">
        ✕
      </button>
    </header>

    <div class="modal__body">
      {@render children?.()}
    </div>
  </div>
{/if}

<style lang="scss">
  .modal {
    position: fixed;
    inset: 0;
    background: var(--color-primary);
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    z-index: var(--z-index-modal);
  }

  .modal__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-20);

    h2 {
      margin: 0;
      font-size: var(--font-size-l);
    }
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

  .modal__body {
    padding: var(--space-20);
    overflow-y: auto;
    flex: 1;
  }
</style>
