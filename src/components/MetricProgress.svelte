<script>
  /**
   * progress metric component for ts-barnum
   * displays percentage progress with visual progress bar
   * @component
   */

  import { projectsMetrics } from '@stores/metrics';
  import MetricCard from '@components/MetricCard.svelte';

  /**
   * @type {{ onOpenModal?: () => void }}
   */
  let { onOpenModal = () => {} } = $props();

  // check if project is completed
  const isCompleted = $derived($projectsMetrics.tsBarnum >= 100);
  const badgeText = $derived(isCompleted ? '🎉 Projet terminé !' : '');
</script>

<MetricCard
  title="ts-barnum"
  value="{$projectsMetrics.tsBarnum}%"
  {onOpenModal}
  highlighted={isCompleted}
  badge={badgeText}
/>
