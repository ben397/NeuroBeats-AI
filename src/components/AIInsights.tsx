import React, { useState, useEffect } from 'react';
import { Brain, Share2 } from 'lucide-react';
import { AudioData } from '../types';

interface AIInsightsProps {
  audioData: AudioData;
  isPlaying: boolean;
}

interface Mood {
  energetic: number;
  calm: number;
  dark: number;
  euphoric: number;
}

const AIInsights: React.FC<AIInsightsProps> = ({ audioData, isPlaying }) => {
  const [mood, setMood] = useState<Mood>({
    energetic: 0.2,
    calm: 0.3,
    dark: 0.1,
    euphoric: 0.4
  });
  
  // Generate "AI insights" based on audio data
  useEffect(() => {
    if (!isPlaying) return;
    
    // Update every second
    const interval = setInterval(() => {
      // Create a fake AI analysis based on frequency data
      const bassMagnitude = audioData.frequencyData.slice(0, 4).reduce((sum, val) => sum + val, 0) / 1020;
      const midsMagnitude = audioData.frequencyData.slice(4, 20).reduce((sum, val) => sum + val, 0) / 4080;
      const trebleMagnitude = audioData.frequencyData.slice(20, 50).reduce((sum, val) => sum + val, 0) / 7650;
      
      // Generate "AI mood detection" (purely algorithmic, not real ML)
      const newMood = {
        energetic: Math.min(0.9, Math.max(0.1, bassMagnitude * 1.2)),
        calm: Math.min(0.9, Math.max(0.1, 1 - bassMagnitude * 0.8)),
        dark: Math.min(0.9, Math.max(0.1, (1 - trebleMagnitude) * 0.7)),
        euphoric: Math.min(0.9, Math.max(0.1, midsMagnitude + trebleMagnitude * 0.5))
      };
      
      // Smoothly update the values
      setMood(prev => ({
        energetic: prev.energetic * 0.7 + newMood.energetic * 0.3,
        calm: prev.calm * 0.7 + newMood.calm * 0.3,
        dark: prev.dark * 0.7 + newMood.dark * 0.3,
        euphoric: prev.euphoric * 0.7 + newMood.euphoric * 0.3
      }));
    }, 1000);
    
    return () => clearInterval(interval);
  }, [audioData, isPlaying]);
  
  // Generate a random music insight
  const generateInsight = () => {
    const insights = [
      "The syncopated rhythm suggests a complex emotional texture",
      "This track exhibits harmonic progression typical of introspective genres",
      "The frequency spectrum suggests influence from ambient electronica",
      "Audio fingerprint shows characteristics of post-modern composition",
      "This audio contains patterns frequently found in transformative works",
      "The tonal structure suggests an emotional narrative arc"
    ];
    
    return insights[Math.floor(Math.random() * insights.length)];
  };
  
  return (
    <div className="bg-black/30 rounded-lg p-4 backdrop-blur-md">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-purple-400 font-medium">AI Analysis</h3>
        <button 
          className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded-full flex items-center"
          onClick={() => alert("Analysis would be shared in a real app!")}
        >
          <Share2 className="w-3 h-3 mr-1" />
          Share
        </button>
      </div>
      
      <div>
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1">
            <span>Mood Analysis</span>
            <span className="text-purple-300">{isPlaying ? "Real-time" : "Static"}</span>
          </div>
          
          <div className="space-y-2">
            {Object.entries(mood).map(([key, value]) => (
              <div key={key} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="capitalize">{key}</span>
                  <span>{Math.round(value * 100)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-1.5">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-cyan-500 h-1.5 rounded-full" 
                    style={{ width: `${value * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Brain className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-medium">Neural Pattern Analysis</span>
          </div>
          <p className="text-xs text-gray-300 italic">"{generateInsight()}"</p>
        </div>
      </div>
    </div>
  );
};

export default AIInsights;