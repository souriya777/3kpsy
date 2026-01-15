<script>
  /**
   * weekly chart component
   * displays last 7 days metrics with chart.js
   * @component
   */

  import { onMount } from 'svelte';
  import { Chart, registerables } from 'chart.js';
  import { getLast7DaysMetrics } from '@stores/metrics';

  let chartCanvas;
  let chart;
  let loading = $state(true);
  let weeklyData = $state([]);

  onMount(async () => {
    // register chart.js components
    Chart.register(...registerables);

    // load last 7 days metrics
    weeklyData = await getLast7DaysMetrics();
    loading = false;

    // create chart
    if (chartCanvas) {
      createChart();
    }

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
    const tsBarnamData = weeklyData.map(d => d.tsBarnum || 0);

    chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Deep Work (h)',
            data: deepWorkData,
            borderColor: '#ff6b9d',
            backgroundColor: 'rgba(255, 107, 157, 0.1)',
            tension: 0.3,
            fill: true,
            yAxisID: 'y'
          },
          {
            label: 'Levé (heure)',
            data: wakeUpData,
            borderColor: '#4caf50',
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
            tension: 0.3,
            fill: true,
            yAxisID: 'y1'
          },
          {
            label: 'ts-barnum (%)',
            data: tsBarnamData,
            borderColor: '#ca3c66',
            backgroundColor: 'rgba(202, 60, 102, 0.1)',
            tension: 0.3,
            fill: true,
            yAxisID: 'y2'
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
              color: '#ff6b9d'
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
              color: '#ff6b9d',
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
              color: '#4caf50'
            },
            grid: {
              drawOnChartArea: false
            },
            ticks: {
              color: '#4caf50',
              font: {
                size: 11
              },
              callback: function(value) {
                const hours = Math.floor(value);
                const minutes = Math.round((value - hours) * 60);
                return `${hours}h${minutes.toString().padStart(2, '0')}`;
              }
            },
            min: 4,
            max: 12
          },
          y2: {
            type: 'linear',
            display: false,
            min: 0,
            max: 100
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
        <span class="stat-label">Moyenne Deep Work</span>
        <span class="stat-value">
          {(weeklyData.reduce((sum, d) => sum + (d.deepWork || 0), 0) / weeklyData.length).toFixed(1)}h
        </span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Progression ts-barnum</span>
        <span class="stat-value">
          {weeklyData.length > 1
            ? `${((weeklyData[weeklyData.length - 1].tsBarnum || 0) - (weeklyData[0].tsBarnum || 0)).toFixed(0)}%`
            : '0%'}
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
    color: var(--color-accent);
  }
</style>
