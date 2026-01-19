<script>
  /**
   * weekly chart component
   * displays last 7 days metrics with chart.js
   * @component
   */

  import { onMount } from 'svelte';
  import { Chart, registerables } from 'chart.js';
  import { getLast7DaysMetrics, projectsMetrics } from '@stores/metrics';

  let chartCanvas = $state(null);
  let chart;
  let loading = $state(true);
  let weeklyData = $state([]);

  onMount(() => {
    // register chart.js components
    Chart.register(...registerables);

    // load data and create chart
    (async () => {
      weeklyData = await getLast7DaysMetrics();
      loading = false;

      // wait for next tick to ensure canvas is rendered
      await new Promise(resolve => setTimeout(resolve, 0));

      // create chart
      if (chartCanvas) {
        createChart();
      }
    })();

    // cleanup on unmount
    return () => {
      if (chart) {
        chart.destroy();
      }
    };
  });

  function createChart() {
    if (!chartCanvas) return;

    const ctx = chartCanvas.getContext('2d');
    const labels = weeklyData.map(d => {
      const date = new Date(d.id);
      return date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' });
    });

    const deepWorkData = weeklyData.map(d => d.deepWork || 0);
    const wakeUpData = weeklyData.map(d => {
      if (!d.wakeUp) return null;
      const [hours, minutes] = d.wakeUp.split(':');
      return parseInt(hours) + parseInt(minutes) / 60;
    });

    chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Deep Work (h)',
            data: deepWorkData,
            borderColor: '#3ccaa0',
            backgroundColor: 'rgba(60, 202, 160, 0.15)',
            tension: 0.3,
            fill: true,
            yAxisID: 'y',
            borderWidth: 2
          },
          {
            label: 'Levé (heure)',
            data: wakeUpData,
            borderColor: '#ffd93d',
            backgroundColor: 'rgba(255, 217, 61, 0.15)',
            tension: 0.3,
            fill: true,
            yAxisID: 'y1',
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          legend: {
            labels: {
              color: '#ffffff',
              font: {
                size: 12,
                family: 'system-ui'
              }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(202, 60, 102, 0.9)',
            titleColor: '#ffffff',
            bodyColor: '#ffffff',
            padding: 12,
            borderColor: '#ffffff',
            borderWidth: 1
          }
        },
        scales: {
          x: {
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
              color: '#ffffff',
              font: {
                size: 11
              }
            }
          },
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            title: {
              display: true,
              text: 'Deep Work (h)',
              color: '#3ccaa0'
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
              color: '#3ccaa0',
              font: {
                size: 11
              }
            }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            title: {
              display: true,
              text: 'Heure levé',
              color: '#ffd93d'
            },
            grid: {
              drawOnChartArea: false
            },
            ticks: {
              color: '#ffd93d',
              font: {
                size: 11
              },
              callback: function(value) {
                const numValue = Number(value);
                const hours = Math.floor(numValue);
                const minutes = Math.round((numValue - hours) * 60);
                return `${hours}h${minutes.toString().padStart(2, '0')}`;
              }
            },
            min: 4,
            max: 12
          }
        }
      }
    });
  }
</script>

<div class="weekly-chart">
  {#if loading}
    <div class="loading">
      <p>Chargement des données...</p>
    </div>
  {:else if weeklyData.length === 0}
    <div class="empty">
      <p>Pas encore de données. Commence à tracker tes métriques!</p>
    </div>
  {:else}
    <div class="chart-container">
      <canvas bind:this={chartCanvas}></canvas>
    </div>
    <div class="stats-summary">
      <div class="stat-item">
        <span class="stat-label">Moyenne DW / jour</span>
        <span class="stat-value">
          {(weeklyData.reduce((sum, d) => sum + (d.deepWork || 0), 0) / weeklyData.length).toFixed(1)}h
        </span>
      </div>
      <div class="stat-item">
        <span class="stat-label">ts-barnum</span>
        <span class="stat-value">
          {$projectsMetrics.tsBarnum}%
        </span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Projets</span>
        <span class="stat-value">
          {$projectsMetrics.completed} / {$projectsMetrics.inProgress}
        </span>
      </div>
    </div>
  {/if}
</div>

<style lang="scss">
  .weekly-chart {
    background: rgba(var(--color-white-rgb), 0.05);
    border: var(--border-width-thin) solid var(--color-border);
    border-radius: var(--border-radius-large);
    padding: var(--space-24);
  }

  .loading,
  .empty {
    text-align: center;
    padding: var(--space-48);
    color: rgba(var(--color-white-rgb), 0.6);
    font-size: var(--font-size-s);
  }

  .chart-container {
    position: relative;
    height: 30rem;
    margin-block-end: var(--space-24);

    canvas {
      max-width: 100%;
    }
  }

  .stats-summary {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
    gap: var(--space-16);
    padding-block-start: var(--space-16);
    border-top: 1px solid var(--color-border);
  }

  .stat-item {
    display: flex;
    flex-direction: column;
    gap: var(--space-8);
    padding: var(--space-12);
    background: rgba(var(--color-white-rgb), 0.05);
    border-radius: var(--border-radius-medium);
  }

  .stat-label {
    font-size: var(--font-size-xs);
    color: rgba(var(--color-white-rgb), 0.7);
  }

  .stat-value {
    font-size: var(--font-size-l);
    font-weight: var(--font-weight-bold);
    text-align: center;
  }
</style>
