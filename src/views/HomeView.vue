<script setup>
import { onMounted } from 'vue';
import { useMatchStore } from '@/stores/matchStore';
import { storeToRefs } from 'pinia';

const store = useMatchStore();
const { 
  isLoading, 
  searchTerm, 
  selectedPlayer1, 
  selectedPlayer2, 
  uniquePlayers, 
  filteredMatches 
} = storeToRefs(store);

onMounted(() => {
  if (store.allMatches.length === 0) {
    store.fetchAllMatches();
  }
  store.resetFilters();
});
</script>

<template>
  <div class="home-view">
    <div class="title-container">
      <h2>Classic Encounters</h2>
      <p>Select players or search to find a match</p>
    </div>

    <div class="filters">
      <div class="filter-group">
        <label>Player 1</label>
        <select v-model="selectedPlayer1">
          <option :value="null">Any Player</option>
          <option v-for="player in uniquePlayers" :key="player" :value="player">{{ player }}</option>
        </select>
      </div>
      
      <div class="vs">vs</div>

      <div class="filter-group">
        <label>Player 2</label>
        <select v-model="selectedPlayer2">
          <option :value="null">Any Player</option>
          <option v-for="player in uniquePlayers" :key="player" :value="player">{{ player }}</option>
        </select>
      </div>
      
      <div class="filter-group">
        <label>Or Search Tournament</label>
        <input type="text" v-model="searchTerm" placeholder="e.g. Wimbledon..." />
      </div>
    </div>

    <div v-if="isLoading" class="loader">Loading Match Archive...</div>
    <div v-else>
      <p class="results-count">{{ filteredMatches.length }} matches found</p>
      <div class="match-grid">
        <router-link 
          v-for="match in filteredMatches" 
          :key="match.matchId"
          :to="`/match/${match.matchId}`"
          class="match-card"
        >
          <div class="players">
            <span>{{ match.player1.split(' ').pop() }}</span>
            <span class="vs-card">vs</span>
            <span>{{ match.player2.split(' ').pop() }}</span>
          </div>
          <div class="tournament">{{ match.tournament }}</div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.title-container {
  text-align: center;
  margin-bottom: 2rem;
}
.title-container h2 {
  font-size: 3rem;
}
.title-container p {
  font-size: 1.2rem;
  color: var(--color-text-body);
}

.filters {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 1.5rem;
  padding: 2rem;
  background-color: var(--color-background-soft);
  border-radius: 12px;
  margin-bottom: 3rem;
  border: 1px solid var(--color-border);
  flex-wrap: wrap;
}
.filter-group {
  display: flex;
  flex-direction: column;
}
.filter-group label {
  font-size: 0.9rem;
  color: var(--color-text-body);
  margin-bottom: 0.5rem;
}
select, input {
  background-color: var(--color-background);
  color: var(--color-text-heading);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  padding: 0.75rem;
  font-size: 1rem;
  font-family: var(--font-family-body);
  min-width: 250px;
}
.vs {
  font-family: var(--font-family-heading);
  font-size: 1.5rem;
  color: var(--color-text-body);
  padding-bottom: 0.5rem;
}

.results-count {
  text-align: center;
  color: var(--color-text-body);
  margin-bottom: 1.5rem;
}
.loader {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
  font-family: var(--font-family-heading);
}

.match-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}
.match-card {
  background-color: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  transition: all 0.2s ease-in-out;
  color: var(--color-text-heading);
}
.match-card:hover {
  border-color: var(--color-primary);
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.3);
}
.players {
  font-family: var(--font-family-heading);
  font-size: 1.8rem;
  font-weight: 700;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}
.vs-card {
  font-size: 1rem;
  color: var(--color-primary);
}
.tournament {
  font-family: var(--font-family-body);
  font-size: 1rem;
  color: var(--color-text-body);
}
</style>