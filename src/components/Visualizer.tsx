import React, { useRef, useEffect } from 'react';
import ParticleVisualizer from './visualizers/ParticleVisualizer';
import GeometricVisualizer from './visualizers/GeometricVisualizer';
import Dream3DVisualizer from './visualizers/Dream3DVisualizer';
import { VisualizationMode } from '../types';

interface VisualizerProps {
  mode: VisualizationMode;
  colorTheme: string;
  audioData: {
    waveform: number[];
    frequencyData: number[];
    volume: number;
    bpm: number | null;
  };
  isPlaying: boolean;
}

const Visualizer: React.FC<VisualizerProps> = ({ 
  mode, 
  colorTheme, 
  audioData, 
  isPlaying 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Render the appropriate visualizer based on the mode
  const renderVisualizer = () => {
    switch (mode) {
      case 'particles':
        return (
          <ParticleVisualizer 
            audioData={audioData} 
            colorTheme={colorTheme} 
            isPlaying={isPlaying} 
          />
        );
      case 'geometric':
        return (
          <GeometricVisualizer 
            audioData={audioData} 
            colorTheme={colorTheme} 
            isPlaying={isPlaying} 
          />
        );
      case 'dream3d':
        return (
          <Dream3DVisualizer 
            audioData={audioData} 
            colorTheme={colorTheme} 
            isPlaying={isPlaying} 
          />
        );
      default:
        return (
          <ParticleVisualizer 
            audioData={audioData} 
            colorTheme={colorTheme} 
            isPlaying={isPlaying} 
          />
        );
    }
  };

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full bg-black relative overflow-hidden"
    >
      {/* Grid Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      
      {/* Visualizer Content */}
      {renderVisualizer()}
      
      {/* Info Overlay */}
      <div className="absolute bottom-4 left-4 text-xs text-white/50 pointer-events-none">
        <div>Mode: {mode}</div>
        {audioData.bpm && <div>BPM: {audioData.bpm}</div>}
      </div>
      
      {/* Capture Button */}
      <button
        className="absolute top-4 right-4 bg-purple-500/50 hover:bg-purple-500/80 px-3 py-1 rounded text-sm backdrop-blur-sm transition-all"
        onClick={() => {
          // Capture snapshot logic would go here
          alert("Snapshot captured! (This would save an image in a real app)");
        }}
      >
        Capture
      </button>
    </div>
  );
};

export default Visualizer;