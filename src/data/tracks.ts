import { Track } from '../types';

// These URLs would point to actual audio files in a real implementation
// For a demo, these could be replaced with actual royalty-free music URLs
export const preloadedTracks: Track[] = [
  {
    id: 'track1',
    title: 'Electric Dreams',
    artist: 'Neural Pulse',
    url: 'https://samplelib.com/lib/preview/mp3/sample-15s.mp3',
    thumbnailUrl: 'https://example.com/track1.jpg',
    duration: 185,
    mood: {
      energetic: 0.7,
      calm: 0.2,
      dark: 0.3,
      euphoric: 0.8
    }
  },
  {
    id: 'track2',
    title: 'Ambient Flow',
    artist: 'Synth Collective',
    url: 'https://samplelib.com/lib/preview/mp3/sample-12s.mp3',
    thumbnailUrl: 'https://example.com/track2.jpg',
    duration: 243,
    mood: {
      energetic: 0.3,
      calm: 0.8,
      dark: 0.2,
      euphoric: 0.6
    }
  },
  {
    id: 'track3',
    title: 'Deep Bass Journey',
    artist: 'Frequency',
    url: 'https://samplelib.com/lib/preview/mp3/sample-9s.mp3',
    thumbnailUrl: 'https://example.com/track3.jpg',
    duration: 197,
    mood: {
      energetic: 0.8,
      calm: 0.1,
      dark: 0.7,
      euphoric: 0.5
    }
  },
  {
    id: 'track4',
    title: 'Neon Lights',
    artist: 'Digital Wave',
    url: 'https://samplelib.com/lib/preview/mp3/sample-6s.mp3',
    thumbnailUrl: 'https://example.com/track4.jpg',
    duration: 215,
    mood: {
      energetic: 0.6,
      calm: 0.3,
      dark: 0.4,
      euphoric: 0.7
    }
  },
  {
    id: 'track5',
    title: 'Quantum Field',
    artist: 'Binary Sunset',
    url: 'https://samplelib.com/lib/preview/mp3/sample-3s.mp3',
    thumbnailUrl: 'https://example.com/track5.jpg',
    duration: 227,
    mood: {
      energetic: 0.4,
      calm: 0.6,
      dark: 0.5,
      euphoric: 0.4
    }
  }
];