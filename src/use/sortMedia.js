export const useSortMedia = way => {
  if (way === '+')  return (a, b) => a.vote_average - b.vote_average
  if (way === '-')  return (a, b) => b.vote_average - a.vote_average
}
