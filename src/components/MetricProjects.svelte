<script>
  /**
   * projects metric component
   * tracks completed vs in-progress projects (X/Y format)
   * @component
   */

  import { projectsMetrics } from '@stores/metrics';
  import MetricCard from '@components/MetricCard.svelte';

  /**
   * @type {{ onOpenModal?: () => void }}
   */
  let { onOpenModal = () => {} } = $props();
</script>

<MetricCard
  title="projets"
  value="{$projectsMetrics.completed} / {$projectsMetrics.inProgress}"
  {onOpenModal}
/>
