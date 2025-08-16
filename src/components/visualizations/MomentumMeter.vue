<script setup>
import { computed } from 'vue';

const props = defineProps({
  match: Object
});

const momentumData = computed(() => {
  if (!props.match?.points) return [];

  let runningTotal = 0;
  const points = props.match.points;
  const dataPoints = [{ x: 0, y: 0 }];

  points.forEach((point, index) => {
    let pointValue = 1;
    if (point.isBreakPoint) pointValue = 3;
    if (point.rallyLength > 10) pointValue += 1;

    if (point.winner === props.match.player1) {
      runningTotal += pointValue;
    } else {
      runningTotal -= pointValue;
    }
    dataPoints.push({ x: index + 1, y: runningTotal });
  });
  return dataPoints;
});

const svgPath = computed(() => {
  const points = momentumData.value;
  if (points.length < 2) return '';

  const width = 1000;
  const height = 150;
  const maxAbsY = Math.max(...points.map(p => Math.abs(p.y)), 1);
  
  const pathParts = points.map((point, index) => {
    const x = (point.x / (points.length - 1)) * width;
    const y = (height / 2) - (point.y / maxAbsY) * (height / 2 - 10);
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
  });

  return pathParts.join(' ');
});

const player1Color = '#3B82F6';
const player2Color = '#EF4444';
</script>

<template>
  <div class="momentum-wrapper">
    <h3>Momentum</h3>
    <div class="chart-container">
      <div class="player-label top">{{ match.player1 }}</div>
      <svg viewBox="0 0 1000 150" class="chart-svg">
        <line x1="0" y1="75" x2="1000" y2="75" stroke="var(--color-border)" stroke-width="2" stroke-dasharray="4" />
        <path :d="svgPath" fill="none" :stroke="player1Color" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      <div class="player-label bottom">{{ match.player2 }}</div>
    </div>
  </div>
</template>

<style scoped>
.momentum-wrapper {
  margin-top: 2rem;
  background-color: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 1.5rem;
}
h3 {
  text-align: center;
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
}
.chart-container {
  position: relative;
  display: grid;
  grid-template-rows: auto 1fr auto;
  align-items: center;
  padding: 0 1rem;
}
.player-label {
  font-family: var(--font-family-body);
  font-weight: 600;
  font-size: 1rem;
  color: var(--color-text-heading);
}
.player-label.top {
  color: v-bind(player1Color);
  padding-bottom: 0.5rem;
}
.player-label.bottom {
  color: v-bind(player2Color);
  padding-top: 0.5rem;
}
.chart-svg {
  width: 100%;
  height: 150px;
}
</style>