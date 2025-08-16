import { ref } from 'vue';

export function useMatchData() {
  const match = ref(null);
  return { match };
}