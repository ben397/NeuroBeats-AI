import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown, Volume2 } from 'lucide-react';
import Visualizer from './components/Visualizer';
import AudioControls from './components/AudioControls';
import VisualizerControls from './components/VisualizerControls';
import PreloadedTracks from './components/PreloadedTracks';
import AIInsights from './components/AIInsights';
import { useAudioContext } from './contexts/AudioContext';
import { VisualizationMode } from './types';

function App() {
  const [controlsExpanded, setControlsExpanded] = useState(true);
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [visualizationMode, setVisualizationMode] = useState<VisualizationMode>('particles');
  const [colorTheme, setColorTheme] = useState('cyberpunk');
  const { audioData, isPlaying, togglePlayback } = useAudioContext();

  // Simulate loading state when track changes
  useEffect(() => {
    if (currentTrack) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentTrack]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-md p-4 border-b border-purple-500/20">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Volume2 className="text-purple-400 h-6 w-6" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              NeuroBeats AI
            </h1>
          </div>
          <div className="text-sm text-gray-400">
            Audio Visualization Portfolio
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Visualizer */}
        <div className="flex-1 relative">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-t-purple-500 border-r-cyan-400 border-b-blue-500 border-l-pink-500 rounded-full animate-spin mb-4"></div>
                <p className="text-lg text-purple-300">AI is analyzing your music...</p>
              </div>
            </div>
          ) : (
            <Visualizer 
              mode={visualizationMode} 
              colorTheme={colorTheme} 
              audioData={audioData} 
              isPlaying={isPlaying}
            />
          )}
        </div>

        {/* Controls Panel */}
        <div className={`bg-black/40 backdrop-blur-lg border-t border-purple-500/20 transition-all duration-500 ease-in-out ${controlsExpanded ? 'max-h-96' : 'max-h-20'}`}>
          <button 
            onClick={() => setControlsExpanded(!controlsExpanded)}
            className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-purple-500 rounded-full p-2 hover:bg-purple-400 transition-colors"
          >
            {controlsExpanded ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
          </button>
          
          <div className="container mx-auto p-4">
            <AudioControls />
            
            {controlsExpanded && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                <PreloadedTracks onTrackSelect={setCurrentTrack} currentTrack={currentTrack} />
                <VisualizerControls 
                  mode={visualizationMode} 
                  setMode={setVisualizationMode}
                  colorTheme={colorTheme}
                  setColorTheme={setColorTheme}
                />
                <AIInsights audioData={audioData} isPlaying={isPlaying} />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;