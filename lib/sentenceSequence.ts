// The ordered list of prompt numbers in the recording flow.
// To add more sentences, just append to this array.
const FULL_SENTENCE_SEQUENCE = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
];

const demoRecordingFlowEnabled =
  process.env.EXPO_PUBLIC_DEMO_RECORDING_FLOW === "true";
const DEMO_SENTENCE_SEQUENCE = [1, 17];

export const SENTENCE_SEQUENCE = demoRecordingFlowEnabled
  ? DEMO_SENTENCE_SEQUENCE
  : FULL_SENTENCE_SEQUENCE;
