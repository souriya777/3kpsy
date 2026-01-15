<script>
  /**
   * pull to refresh component
   * native-like pull-to-refresh for mobile
   * @component
   */

  import { onMount } from 'svelte';

  let { onRefresh = async () => {}, children } = $props();

  let startY = $state(0);
  let currentY = $state(0);
  let isDragging = $state(false);
  let isRefreshing = $state(false);
  let pullDistance = $state(0);
  let container;

  const PULL_THRESHOLD = 80; // minimum pull distance to trigger refresh
  const MAX_PULL = 120; // maximum visual pull distance

  onMount(() => {
    // prevent default pull-to-refresh on some browsers
    document.body.style.overscrollBehavior = 'contain';

    return () => {
      document.body.style.overscrollBehavior = '';
    };
  });

  function handleTouchStart(e) {
    // check if at top of page
    const scrollContainer = container?.parentElement || window;
    const scrollTop = scrollContainer.scrollTop || window.scrollY || document.documentElement.scrollTop;

    // only trigger if scrolled to top
    if (scrollTop <= 0 && !isRefreshing) {
      startY = e.touches[0].clientY;
      isDragging = true;
    }
  }

  function handleTouchMove(e) {
    if (!isDragging || isRefreshing) return;

    currentY = e.touches[0].clientY;
    const diff = currentY - startY;

    // only pull down (positive diff)
    if (diff > 0) {
      // prevent default scroll
      e.preventDefault();

      // apply easing to pull distance (diminishing returns)
      pullDistance = Math.min(diff * 0.5, MAX_PULL);
    }
  }

  async function handleTouchEnd() {
    if (!isDragging) return;

    isDragging = false;

    // trigger refresh if pulled enough
    if (pullDistance >= PULL_THRESHOLD) {
      isRefreshing = true;
      pullDistance = PULL_THRESHOLD; // keep icon visible during refresh

      try {
        await onRefresh();
      } catch (error) {
        console.error('refresh failed:', error);
      } finally {
        // smooth collapse animation
        setTimeout(() => {
          isRefreshing = false;
          pullDistance = 0;
        }, 500);
      }
    } else {
      // snap back if not pulled enough
      pullDistance = 0;
    }
  }

  // calculate rotation for spinner
  let rotation = $derived(pullDistance / PULL_THRESHOLD * 360);
  let opacity = $derived(Math.min(pullDistance / PULL_THRESHOLD, 1));
</script>

<svelte:window
  ontouchstart={handleTouchStart}
  ontouchmove={handleTouchMove}
  ontouchend={handleTouchEnd}
/>

<div
  bind:this={container}
  class="pull-to-refresh"
  style="transform: translateY({pullDistance}px); transition: {isDragging ? 'none' : 'transform 0.3s ease-out'}"
>
  <div
    class="refresh-indicator"
    style="opacity: {opacity}; transform: rotate({isRefreshing ? 0 : rotation}deg)"
    class:spinning={isRefreshing}
  >
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
    </svg>
  </div>

  {@render children?.()}
</div>

<style lang="scss">
  .pull-to-refresh {
    position: relative;
    min-height: 100vh;
  }

  .refresh-indicator {
    position: absolute;
    top: -6rem;
    left: 50%;
    transform: translateX(-50%);
    width: 4rem;
    height: 4rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(var(--color-white-rgb), 0.1);
    border-radius: var(--border-radius-circle);
    backdrop-filter: blur(10px);
    color: var(--color-text);
    transition: opacity var(--transition-fast) var(--easing-default);

    svg {
      width: 3.2rem;
      height: 3.2rem;
    }

    &.spinning {
      animation: spin 1s linear infinite;

      svg {
        stroke-width: 3;
      }
    }
  }

  @keyframes spin {
    from {
      transform: translateX(-50%) rotate(0deg);
    }
    to {
      transform: translateX(-50%) rotate(360deg);
    }
  }
</style>
