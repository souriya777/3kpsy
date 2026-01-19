<script>
  /**
   * sleep metric component
   * tracks wake-up time, bedtime, and nap status
   * displays goal progress for wake-up time
   * @component
   */

  import { dailyMetrics } from '@stores/metrics';
  import MetricCard from '@components/MetricCard.svelte';

  /**
   * @type {{ onOpenModal?: () => void }}
   */
  let { onOpenModal = () => {} } = $props();

  // check if wake-up goal is reached (earlier or equal to goal)
  const isWakeUpGoalReached = $derived(() => {
    if (!$dailyMetrics.wakeUp || !$dailyMetrics.wakeUpGoal) return false;
    return $dailyMetrics.wakeUp <= $dailyMetrics.wakeUpGoal;
  });

  const displayValue = $derived(() => {
    const badge = isWakeUpGoalReached() ? '<span class="goal-badge">🎯</span>' : '';
    return `${$dailyMetrics.wakeUp}${badge}`;
  });
</script>

<MetricCard
  title="sommeil ({$dailyMetrics.wakeUpGoal})"
  value={displayValue()}
  {onOpenModal}
  highlighted={isWakeUpGoalReached()}
/>
