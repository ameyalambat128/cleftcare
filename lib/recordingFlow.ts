import { useDevSettingsStore } from "./store";

/**
 * Get the next prompt route based on the current prompt number and dev settings
 * @param currentPromptNumber - The current prompt number (1-25)
 * @param userId - The user ID for the route
 * @returns The next route path (e.g., "/record/{userId}/two")
 */
export function getNextPromptRoute(
  currentPromptNumber: number,
  userId: string
): string {
  const { shortRecordingFlowEnabled } = useDevSettingsStore.getState();

  if (shortRecordingFlowEnabled) {
    // Short flow: 1 -> 2 -> 25 -> home
    if (currentPromptNumber === 1) {
      return `/record/${userId}/two`;
    } else if (currentPromptNumber === 2) {
      return `/record/${userId}/twentyfive`;
    } else if (currentPromptNumber === 25) {
      return "/"; // Return to home
    }
  }

  // Full flow: normal sequence
  const promptRouteMap: Record<number, string> = {
    1: `/record/${userId}/two`,
    2: `/record/${userId}/three`,
    3: `/record/${userId}/four`,
    4: `/record/${userId}/five`,
    5: `/record/${userId}/six`,
    6: `/record/${userId}/seven`,
    7: `/record/${userId}/eight`,
    8: `/record/${userId}/nine`,
    9: `/record/${userId}/ten`,
    10: `/record/${userId}/eleven`,
    11: `/record/${userId}/twelve`,
    12: `/record/${userId}/thirteen`,
    13: `/record/${userId}/fourteen`,
    14: `/record/${userId}/fifteen`,
    15: `/record/${userId}/sixteen`,
    16: `/record/${userId}/seventeen`,
    17: `/record/${userId}/twentyfive`,
    25: "/", // Return to home after prompt 25
  };

  return promptRouteMap[currentPromptNumber] || "/";
}

