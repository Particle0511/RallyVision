export const matchService = {
  async getAllMatches() {
    const modules = import.meta.glob('../data/matches/*.json');
    const matches = [];

    for (const path in modules) {
      try {
        const { default: matchData } = await modules[path]();
        if (matchData && matchData.matchId) {
          matches.push({
            matchId: matchData.matchId,
            player1: matchData.player1,
            player2: matchData.player2,
            tournament: matchData.tournament,
          });
        }
      } catch (e) {
        console.error(`Failed to load or parse match data from ${path}:`, e);
      }
    }
    return matches;
  },
  
  async getMatchById(matchId) {
    try {
      const fileName = matchId.replace('.json', '');
      const { default: matchData } = await import(`../data/matches/${fileName}.json`);
      return matchData;
    } catch (e) {
      console.error(`Could not load match data for ID: ${matchId}`, e);
      return null;
    }
  }
};