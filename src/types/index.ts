export type VisualizationMode = 'particles' | 'geometric' | 'dream3d';

export type ColorTheme = 'cyberpunk' | 'neon' | 'pastel' | 'monochrome';

export interface AudioDataPoint {
  frequency: number;
  amplitude: number;
  time: number;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  thumbnailUrl: string;
  duration: number;
  mood?: {
    energetic: number;
    calm: number;
    dark: number;
    euphoric: number;
  };
}

export interface AudioData {
  waveform: number[];
  frequencyData: number[];
  volume: number;
  bpm: number | null;
}