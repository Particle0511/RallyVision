<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  match: Object
});

const currentPointIndex = ref(-1);
const animationFrame = ref(null);
const isPlaying = ref(false);
const rallyStep = ref(0);
const ballPosition = ref({ x: 500, y: 495 });

// Definitive, stateful scoreboard engine
const player1Sets = ref(0);
const player2Sets = ref(0);
const player1Games = ref(0);
const player2Games = ref(0);
const player1Points = ref('0');
const player2Points = ref('0');

const pointValues = ['0', '15', '30', '40', 'AD'];

const courtCorners = {
  p1_deuce: { x: 250, y: 400 },
  p1_ad: { x: 750, y: 400 },
  p2_deuce: { x: 750, y: 120 },
  p2_ad: { x: 250, y: 120 },
};

const currentPoint = computed(() => {
  return props.match.points?.[currentPointIndex.value] || null;
});

const rallyLength = computed(() => currentPoint.value?.rallyLength || 0);

function processPointWin(winner) {
  let p1Score = player1Points.value;
  let p2Score = player2Points.value;
  let p1GameCount = player1Games.value;
  let p2GameCount = player2Games.value;

  const playerWon = (player) => {
    if (player === 'player1') {
      const newScoreIndex = pointValues.indexOf(p1Score) + 1;
      p1Score = pointValues[newScoreIndex];
    } else {
      const newScoreIndex = pointValues.indexOf(p2Score) + 1;
      p2Score = pointValues[newScoreIndex];
    }
  };
  
  const checkGameWin = () => {
    if (p1Score === 'AD' || (p1Score === '40' && p2Score !== '40' && p2Score !== 'AD')) {
      p1GameCount++;
      p1Score = '0';
      p2Score = '0';
    } else if (p2Score === 'AD' || (p2Score === '40' && p1Score !== '40' && p1Score !== 'AD')) {
      p2GameCount++;
      p1Score = '0';
      p2Score = '0';
    }
  };

  const checkSetWin = () => {
    if (p1GameCount >= 6 && p1GameCount - p2GameCount >= 2) {
      player1Sets.value++;
      p1GameCount = 0;
      p2GameCount = 0;
    } else if (p2GameCount >= 6 && p2GameCount - p1GameCount >= 2) {
      player2Sets.value++;
      p1GameCount = 0;
      p2GameCount = 0;
    }
  };

  if (winner === 'player1') {
    if (p2Score === 'AD') {
      p2Score = '40';
    } else {
      playerWon('player1');
    }
  } else {
    if (p1Score === 'AD') {
      p1Score = '40';
    } else {
      playerWon('player2');
    }
  }

  checkGameWin();
  player1Points.value = p1Score;
  player2Points.value = p2Score;
  player1Games.value = p1GameCount;
  player2Games.value = p2GameCount;
  checkSetWin();
}

function play() {
  if (currentPointIndex.value === -1) {
    nextPoint();
  }
  isPlaying.value = true;
  animateRally();
}

function pause() {
  isPlaying.value = false;
  clearTimeout(animationFrame.value);
}

function nextPoint() {
  if (currentPointIndex.value < props.match.points.length - 1) {
    currentPointIndex.value++;
  } else {
    pause();
  }
}

function reset() {
  pause();
  currentPointIndex.value = -1;
}

function startRallyForCurrentPoint() {
  rallyStep.value = 0;
  if (!currentPoint.value) return;

  const serverIsPlayer1 = currentPoint.value.serving === props.match.player1;
  const isDeuceSide = player1Points.value === player2Points.value;

  let startPos;
  if (serverIsPlayer1) {
    startPos = isDeuceSide ? courtCorners.p1_deuce : courtCorners.p1_ad;
  } else {
    startPos = isDeuceSide ? courtCorners.p2_deuce : courtCorners.p2_ad;
  }
  ballPosition.value = startPos;
}

function animateRally() {
  if (!isPlaying.value || !currentPoint.value) return;

  if (rallyStep.value < rallyLength.value) {
    let nextPos;
    const currentPos = ballPosition.value;
    
    if (currentPos.y > 260) {
      nextPos = currentPos.x < 500 ? courtCorners.p2_deuce : courtCorners.p2_ad;
    } else {
      nextPos = currentPos.x < 500 ? courtCorners.p1_deuce : courtCorners.p1_ad;
    }
    
    ballPosition.value = nextPos;
    rallyStep.value++;
    
    animationFrame.value = setTimeout(animateRally, 900);
  } else {
    const winner = currentPoint.value.winner === props.match.player1 ? 'player1' : 'player2';
    processPointWin(winner);
    
    animationFrame.value = setTimeout(() => {
      if (isPlaying.value) nextPoint();
    }, 1500); 
  }
}

watch(currentPointIndex, (newIndex, oldIndex) => {
  if(newIndex === -1) {
    player1Sets.value = 0; player2Sets.value = 0;
    player1Games.value = 0; player2Games.value = 0;
    player1Points.value = '0'; player2Points.value = '0';
    ballPosition.value = { x: 500, y: 495 };
    return;
  }
  
  if (newIndex === 0) {
    const firstPoint = props.match.points[0];
    player1Games.value = firstPoint.Gm1;
    player2Games.value = firstPoint.Gm2;
    player1Sets.value = firstPoint.Set1;
    player2Sets.value = firstPoint.Set2;
  }

  if (currentPoint.value) {
    const score = currentPoint.value.score || currentPoint.value.Pts;
    if (score.includes('AD')) {
      player1Points.value = score.startsWith('AD') ? 'AD' : '40';
      player2Points.value = score.endsWith('AD') ? 'AD' : '40';
    } else {
      const parts = score.split('-');
      player1Points.value = parts[0] || '0';
      player2Points.value = parts[1] || parts[0] || '0';
    }
    startRallyForCurrentPoint();
    if (isPlaying.value) {
      clearTimeout(animationFrame.value);
      animateRally();
    }
  }
});
</script>

<template>
  <div class="simulator-wrapper">
    <div class="scoreboard">
      <div class="player-row">
        <div class="player-name" :class="{ 'serving': currentPoint?.serving === match.player1 }">
          {{ match.player1.split(' ').pop() }}
        </div>
        <div class="score-box">{{ player1Sets }}</div>
        <div class="score-box">{{ player1Games }}</div>
        <div class="score-box points">{{ player1Points }}</div>
      </div>
      <div class="player-row">
        <div class="player-name" :class="{ 'serving': currentPoint?.serving === match.player2 }">
          {{ match.player2.split(' ').pop() }}
        </div>
        <div class="score-box">{{ player2Sets }}</div>
        <div class="score-box">{{ player2Games }}</div>
        <div class="score-box points">{{ player2Points }}</div>
      </div>
    </div>

    <div class="simulator-container">
      <svg viewBox="0 0 1000 520" class="court-svg">
        <rect width="1000" height="520" fill="#3A5A40" /> 
        <rect x="50" y="50" width="900" height="420" fill="#588157" />
        <g stroke="#DAD7CD" stroke-width="3" opacity="0.6">
          <rect x="110" y="50" width="780" height="420" fill="none" />
          <line x1="500" y1="50" x2="500" y2="470" />
          <rect x="110" y="92" width="780" height="336" fill="none" />
          <line x1="500" y1="92" x2="500" y2="428" />
          <line x1="110" y1="260" x2="890" y2="260" />
        </g>
        
        <circle :cx="ballPosition.x" :cy="ballPosition.y" r="10" fill="var(--color-primary)" class="ball" />
      </svg>
    </div>
     <div class="controls">
        <button @click="isPlaying ? pause() : play()">{{ isPlaying ? 'Pause' : 'Play' }}</button>
        <button @click="nextPoint">Next Point</button>
        <button @click="reset">Reset</button>
      </div>
  </div>
</template>

<style scoped>
.simulator-wrapper {
  background-color: var(--color-background);
}
.scoreboard {
  background-color: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 1.5rem;
  font-family: 'Inter', sans-serif;
}
.player-row {
  display: flex;
  color: var(--color-text-heading);
}
.player-row:first-child {
  border-bottom: 1px solid var(--color-border);
}
.player-name {
  flex-grow: 1;
  padding: 0.75rem 1rem;
  font-weight: 700;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  opacity: 0.7;
}
.player-name.serving {
  opacity: 1;
  color: var(--color-primary);
}
.player-name.serving::before {
  content: '';
  width: 8px;
  height: 8px;
  background-color: var(--color-primary);
  border-radius: 50%;
  margin-right: 10px;
}
.score-box {
  width: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.4rem;
  font-weight: 700;
  border-left: 1px solid var(--color-border);
}
.score-box.points {
  color: var(--color-primary);
  background-color: rgba(0,0,0,0.2);
}
.controls {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1.5rem;
}
.controls button {
  background-color: var(--color-background-soft);
  color: var(--color-text-heading);
  border: 1px solid var(--color-border);
  padding: 0.75rem 2rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-family: var(--font-family-body);
  transition: all 0.2s;
}
.controls button:hover {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
  color: #000;
}
.court-svg {
  width: 100%;
  height: auto;
  border-radius: 8px;
}
.ball {
  transition: all 0.8s cubic-bezier(0.25, 1, 0.5, 1);
  filter: drop-shadow(0 0 8px #F2E8CF);
}
</style>