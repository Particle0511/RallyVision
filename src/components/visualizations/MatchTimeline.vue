<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  match: Object
});

const hoveredPoint = ref(null);
const selectedPoint = ref(null);

const vizPoints = computed(() => {
  if (!props.match?.points) return [];

  const points = props.match.points;
  const maxRally = Math.max(...points.map(p => p.rallyLength));
  const svgWidth = 1300;
  const svgHeight = 300;

  return points.map((point, index) => {
    const isPlayer1_Winner = point.winner === props.match.player1;
    const color = isPlayer1_Winner ? '#3B82F6' : '#EF4444';
    const radius = 5;

    const x = (index / (points.length - 1)) * (svgWidth - 60) + 30;
    const y_base = svgHeight / 2;
    const rallyHeight = (point.rallyLength / maxRally) * (svgHeight / 2 - 20);
    const y = isPlayer1_Winner ? y_base - rallyHeight : y_base + rallyHeight;

    return { ...point, x, y, radius, color };
  });
});

function showTooltip(point) {
  hoveredPoint.value = point;
}

function hideTooltip() {
  hoveredPoint.value = null;
}

function selectPoint(point) {
  selectedPoint.value = point;
}

const pointToDisplay = computed(() => selectedPoint.value || hoveredPoint.value);
</script>

<template>
  <div class="timeline-wrapper">
    <div class="point-display" :class="{ active: pointToDisplay }">
      <div v-if="pointToDisplay">
        <strong>Score: {{ pointToDisplay.score }}</strong>
        <span>Winner: {{ pointToDisplay.winner }}</span>
        <span>Rally: {{ pointToDisplay.rallyLength }} shots</span>
        <span>Serving: {{ pointToDisplay.serving }}</span>
      </div>
      <div v-else class="placeholder">
        Hover for details, Click to pin a point
      </div>
    </div>
    <div class="visualizer-container">
      <svg :viewBox="`0 0 1300 300`" class="timeline-svg" preserveAspectRatio="xMidYMid meet">
        <line x1="0" y1="150" x2="1300" y2="150" stroke="var(--color-border)" stroke-dasharray="5"/>
        <circle 
          v-for="point in vizPoints"
          :key="point.pointId"
          :cx="point.x"
          :cy="point.y"
          :r="point.radius"
          :fill="point.color"
          @mouseover="showTooltip(point)"
          @mouseleave="hideTooltip()"
          @click="selectPoint(point)"
          class="point-circle"
          :class="{ selected: selectedPoint && selectedPoint.pointId === point.pointId }"
        />
      </svg>
    </div>
  </div>
</template>

<style scoped>
.timeline-wrapper {
  display: flex;
  flex-direction: column;
}
.point-display {
  background-color: var(--color-background-soft);
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  text-align: center;
  min-height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.3s;
}
.point-display.active {
  background-color: #374151;
}
.point-display > div {
  display: flex;
  gap: 2rem;
  align-items: center;
}
.placeholder {
  color: #6B7280;
}
.visualizer-container {
  background-color: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 20px;
}
.timeline-svg {
  width: 100%;
  height: auto;
}
.point-circle {
  transition: all 0.1s ease-out;
  cursor: pointer;
}
.point-circle:hover {
  transform: scale(2.5);
  stroke: #fff;
  stroke-width: 2px;
}
.point-circle.selected {
  transform: scale(3);
  stroke: var(--color-primary);
  stroke-width: 3px;
  fill: var(--color-primary);
}
</style>