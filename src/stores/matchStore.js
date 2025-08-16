import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { matchService } from '@/services/matchService';

export const useMatchStore = defineStore('match', () => {
  const allMatches = ref([]);
  const currentMatch = ref(null);
  const isLoading = ref(false);
  const searchTerm = ref('');
  const selectedPlayer1 = ref(null);
  const selectedPlayer2 = ref(null);

  async function fetchAllMatches() {
    isLoading.value = true;
    try {
      allMatches.value = await matchService.getAllMatches();
    } catch (error) {
      console.error("Failed to fetch matches:", error);
      allMatches.value = [];
    } finally {
      isLoading.value = false;
    }
  }

  const uniquePlayers = computed(() => {
    const players = new Set();
    allMatches.value.forEach(match => {
      players.add(match.player1);
      players.add(match.player2);
    });
    return Array.from(players).sort();
  });

  const filteredMatches = computed(() => {
    let matches = allMatches.value;

    if (selectedPlayer1.value) {
      matches = matches.filter(m => m.player1 === selectedPlayer1.value || m.player2 === selectedPlayer1.value);
    }
    if (selectedPlayer2.value) {
      matches = matches.filter(m => m.player1 === selectedPlayer2.value || m.player2 === selectedPlayer2.value);
    }

    if (searchTerm.value.length > 2) {
      const lowerCaseSearch = searchTerm.value.toLowerCase();
      matches = matches.filter(m =>
        m.player1.toLowerCase().includes(lowerCaseSearch) ||
        m.player2.toLowerCase().includes(lowerCaseSearch) ||
        m.tournament.toLowerCase().includes(lowerCaseSearch)
      );
    }
    return matches;
  });

  async function loadMatch(matchId) {
    isLoading.value = true;
    currentMatch.value = null;
    try {
        const matchInfo = allMatches.value.find(m => m.matchId === matchId);
        if (matchInfo) {
          const fileName = `${matchInfo.player1}-${matchInfo.player2}-${matchInfo.tournament}`
            .toLowerCase().replace(/\s/g, '_').replace(/[^a-z0-9_-]/g, '');
          currentMatch.value = await matchService.getMatchById(fileName);
        }
    } catch(error) {
        console.error("Failed to load match:", error);
    } finally {
        isLoading.value = false;
    }
  }
  
  function resetFilters() {
    selectedPlayer1.value = null;
    selectedPlayer2.value = null;
    searchTerm.value = '';
  }

  return { 
    allMatches, 
    currentMatch, 
    isLoading, 
    searchTerm,
    selectedPlayer1,
    selectedPlayer2,
    uniquePlayers,
    filteredMatches,
    fetchAllMatches, 
    loadMatch,
    resetFilters
  };
});