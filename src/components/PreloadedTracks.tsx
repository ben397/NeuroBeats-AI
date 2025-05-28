import React from 'react';
import { Music } from 'lucide-react';
import { preloadedTracks } from '../data/tracks';
import { useAudioContext } from '../contexts/AudioContext';
import { Track } from '../types';

interface PreloadedTracksProps {
  onTrackSelect: (track: string | null) => void;
  currentTrack: string | null;
}

const PreloadedTracks: React.FC<PreloadedTracksProps> = ({ 
  onTrackSelect, 
  currentTrack 
}) => {
  const { setCurrentTrack } = useAudioContext();

  const handleTrackSelect = (track: Track) => {
    setCurrentTrack(track);
    onTrackSelect(track.id);
  };

  return (
    <div className="bg-black/30 rounded-lg p-4 backdrop-blur-md">
      <h3 className="text-purple-400 font-medium mb-3">Demo Tracks</h3>
      
      <div className="space-y-2 max-h-32 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-purple-600">
        {preloadedTracks.map((track) => (
          <button
            key={track.id}
            onClick={() => handleTrackSelect(track)}
            className={`w-full flex items-center p-2 rounded ${
              currentTrack === track.id ? 'bg-purple-600' : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            <div className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center mr-3">
              <Music className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium truncate">{track.title}</p>
              <p className="text-xs text-gray-400 truncate">{track.artist}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PreloadedTracks;