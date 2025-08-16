<script setup>
import { onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useMatchStore } from '@/stores/matchStore';
import MatchSimulator from '@/components/visualizations/MatchSimulator.vue';
import MomentumMeter from '@/components/visualizations/MomentumMeter.vue';
import StatsPanel from '@/components/stats/StatsPanel.vue';

const route = useRoute();
const store = useMatchStore();
const matchId = route.params.matchId;

onMounted(() => {
  if (store.allMatches.length === 0) {
    store.fetchAllMatches().then(() => {
        store.loadMatch(matchId);
    });
  } else {
    store.loadMatch(matchId);
  }
});

const matchTitle = computed(() => {
    if (!store.currentMatch) return 'Loading Match...';
    return `${store.currentMatch.player1} vs ${store.currentMatch.player2}`;
});

const matchSubtitle = computed(() => {
    if (!store.currentMatch) return '';
    return store.currentMatch.tournament;
});
</script>

<template>
  <div class="match-view">
    <div class="match-header">
        <h2>{{ matchTitle }}</h2>
        <p>{{ matchSubtitle }}</p>
    </div>
    <div v-if="store.isLoading || !store.currentMatch" class="loader">Loading Match Data...</div>
    <div v-else>
      <MatchSimulator :match="store.currentMatch" />
      <StatsPanel :match="store.currentMatch" />
      <MomentumMeter :match="store.currentMatch" />
    </div>
  </div>
</template>

<style scoped>
.match-header {
    text-align: center;
    margin-bottom: 2rem;
}
.match-header h2 {
    font-size: 2.5rem;
}
.match-header p {
    font-size: 1.5rem;
    color: var(--color-text-body);
}
.loader {
    text-align: center;
    padding: 4rem;
    font-size: 1.5rem;
}
</style>