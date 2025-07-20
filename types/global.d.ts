declare global {
  interface Window {
    Tally?: {
      loadEmbeds: () => void;
      // Add other Tally methods if you use them
    };
  }
}

export {};
