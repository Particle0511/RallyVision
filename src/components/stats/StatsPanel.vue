<script setup>
import { computed } from 'vue';

const props = defineProps({
  match: Object
});

const player1 = computed(() => props.match.player1);
const player2 = computed(() => props.match.player2);

const stats = computed(() => {
  if (!props.match?.points) {
    return {
      p1: { totalPoints: 0, longestRally: 0 },
      p2: { totalPoints: 0, longestRally: 0 }
    };
  }

  let p1Total = 0;
  let p2Total = 0;
  let p1LongestRally = 0;
  let p2LongestRally = 0;

  props.match.points.forEach(point => {
    if (point.winner === player1.value) {
      p1Total++;
      if (point.rallyLength > p1LongestRally) {
        p1LongestRally = point.rallyLength;
      }
    } else {
      p2Total++;
      if (point.rallyLength > p2LongestRally) {
        p2LongestRally = point.rallyLength;
      }
    }
  });

  return {
    p1: { totalPoints: p1Total, longestRally: p1LongestRally },
    p2: { totalPoints: p2Total, longestRally: p2LongestRally }
  };
});
</script>

<template>
  <div class="stats-panel-wrapper">
    <h3>Match Statistics</h3>
    <div class="stats-container">
      <div class="player-name">{{ player1 }}</div>
      <div class="stat-bars">
        <div class="stat-row">
          <div class="stat-value">{{ stats.p1.totalPoints }}</div>
          <div class="stat-label">Total Points Won</div>
          <div class="stat-value">{{ stats.p2.totalPoints }}</div>
        </div>
         <div class="stat-row">
          <div class="stat-value">{{ stats.p1.longestRally }}</div>
          <div class="stat-label">Longest Rally</div>
          <div class="stat-value">{{ stats.p2.longestRally }}</div>
        </div>
      </div>
      <div class="player-name">{{ player2 }}</div>
    </div>
  </div>
</template>

<style scoped>
.stats-panel-wrapper {
  margin-top: 2rem;
  background-color: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 1.5rem;
}
h3 {
  text-align: center;
  font-size: 1.8rem;
  margin-bottom: 2rem;
}
.stats-container {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 2rem;
  font-family: var(--font-family-body);
}
.player-name {
  font-family: var(--font-family-heading);
  font-size: 1.2rem;
  font-weight: 700;
}
.player-name:first-of-type {
  text-align: right;
}
.stat-bars {
  width: 100%;
}
.stat-row {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  text-align: center;
  margin-bottom: 1rem;
}
.stat-label {
  font-weight: 600;
  color: var(--color-text-body);
  padding: 0 1rem;
}
.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text-heading);
  background-color: var(--color-surface);
  padding: 0.5rem;
  border-radius: 6px;
}
</style>