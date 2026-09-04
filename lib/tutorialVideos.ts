export const tutorialVideos = [
  {
    id: "english",
    title: "English Video Tutorial",
    language: "English",
    description: "Watch the complete CleftCare tutorial in English.",
    duration: "4:48",
    asset: require("../assets/tutorials/videos/cleftcare-tutorial-en.mp4"),
  },
  {
    id: "kannada",
    title: "Kannada Video Tutorial",
    language: "Kannada",
    description: "Watch the complete CleftCare tutorial in Kannada.",
    duration: "9:53",
    asset: require("../assets/tutorials/videos/cleftcare-tutorial-kn.mp4"),
  },
] as const;

export const getTutorialVideo = (id?: string) =>
  tutorialVideos.find((tutorial) => tutorial.id === id);
