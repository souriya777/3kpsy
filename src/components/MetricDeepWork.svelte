<script>
  /**
   * deep work metric component
   * tracks hours of deep work with +/- 0.5h increments
   * @component
   */

  import { dailyMetrics } from '@stores/metrics';
  import MetricCard from '@components/MetricCard.svelte';

  /**
   * @type {{ onOpenModal?: () => void }}
   */
  let { onOpenModal = () => {} } = $props();

  // computed: check if goal is reached
  let isGoalReached = $derived($dailyMetrics.deepWork >= $dailyMetrics.deepWorkGoal);
</script>

<MetricCard
  title="DW ({$dailyMetrics.deepWorkGoal}h)"
  value="{$dailyMetrics.deepWork.toFixed(1)}h"
  {onOpenModal}
  highlighted={isGoalReached}
/>
