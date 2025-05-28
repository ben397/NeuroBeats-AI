import React from 'react';
import { Play, Pause, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { useAudioContext } from '../contexts/AudioContext';

const AudioControls: React.FC = () => {
  const { 
    isPlaying, 
    togglePlayback, 
    volume, 
    setVolume, 
    startMicrophoneInput,
    stopMicrophoneInput,
    isMicrophoneActive,
    currentTrack
  } = useAudioContext();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <button 
          onClick={togglePlayback}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-purple-600 hover:bg-purple-500 transition-colors"
          disabled={!currentTrack && !isMicrophoneActive}
        >
          {isPlaying ? 
            <Pause className="w-5 h-5" /> : 
            <Play className="w-5 h-5 ml-1" />
          }
        </button>
        
        <div className="text-sm">
          {isMicrophoneActive ? (
            <div className="animate-pulse text-purple-400">Microphone Active</div>
          ) : currentTrack ? (
            <div>{currentTrack.title} - {currentTrack.artist}</div>
          ) : (
            <div className="text-gray-500">Select a track or enable mic</div>
          )}
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          {volume === 0 ? <VolumeX className="w-5 h-5 text-gray-400" /> : <Volume2 className="w-5 h-5 text-purple-400" />}
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="ml-2 w-24 accent-purple-500"
          />
        </div>
        
        <button
          onClick={isMicrophoneActive ? stopMicrophoneInput : startMicrophoneInput}
          className={`flex items-center space-x-2 px-3 py-1 rounded-full ${
            isMicrophoneActive ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-700 hover:bg-gray-600'
          } transition-colors`}
        >
          {isMicrophoneActive ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          <span className="text-xs">{isMicrophoneActive ? 'Disable Mic' : 'Enable Mic'}</span>
        </button>
      </div>
    </div>
  );
};

export default AudioControls;