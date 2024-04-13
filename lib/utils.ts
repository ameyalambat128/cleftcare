export const formatDuration = (durationMillis: number): string => {
  let totalSeconds = Math.round(durationMillis / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  // Ensuring that the seconds are represented as a single digit with one decimal place
  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds.toString();

  return `${minutes}:${formattedSeconds}`;
};
