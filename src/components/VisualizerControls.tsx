import React from 'react';
import { Layers, Hexagon, Cube } from 'lucide-react';
import { VisualizationMode } from '../types';

interface VisualizerControlsProps {
  mode: VisualizationMode;
  setMode: (mode: VisualizationMode) => void;
  colorTheme: string;
  setColorTheme: (theme: string) => void;
}

const VisualizerControls: React.FC<VisualizerControlsProps> = ({ 
  mode, 
  setMode, 
  colorTheme, 
  setColorTheme 
}) => {
  return (
    <div className="bg-black/30 rounded-lg p-4 backdrop-blur-md">
      <h3 className="text-purple-400 font-medium mb-3">Visualization Controls</h3>
      
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-300 mb-2">Visualization Mode</p>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setMode('particles')}
              className={`flex flex-col items-center justify-center p-2 rounded ${
                mode === 'particles' ? 'bg-purple-600' : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              <Layers className="h-5 w-5 mb-1" />
              <span className="text-xs">Particles</span>
            </button>
            
            <button
              onClick={() => setMode('geometric')}
              className={`flex flex-col items-center justify-center p-2 rounded ${
                mode === 'geometric' ? 'bg-purple-600' : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              <Hexagon className="h-5 w-5 mb-1" />
              <span className="text-xs">Geometric</span>
            </button>
            
            <button
              onClick={() => setMode('dream3d')}
              className={`flex flex-col items-center justify-center p-2 rounded ${
                mode === 'dream3d' ? 'bg-purple-600' : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              <Cube className="h-5 w-5 mb-1" />
              <span className="text-xs">Dream 3D</span>
            </button>
          </div>
        </div>
        
        <div>
          <p className="text-sm text-gray-300 mb-2">Color Theme</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setColorTheme('cyberpunk')}
              className={`p-2 rounded text-xs ${
                colorTheme === 'cyberpunk' ? 'bg-purple-600' : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              <div className="flex justify-center space-x-1 mb-1">
                <div className="w-3 h-3 rounded-full bg-fuchsia-500"></div>
                <div className="w-3 h-3 rounded-full bg-cyan-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-300"></div>
              </div>
              Cyberpunk
            </button>
            
            <button
              onClick={() => setColorTheme('neon')}
              className={`p-2 rounded text-xs ${
                colorTheme === 'neon' ? 'bg-purple-600' : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              <div className="flex justify-center space-x-1 mb-1">
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-blue-400"></div>
              </div>
              Neon
            </button>
            
            <button
              onClick={() => setColorTheme('pastel')}
              className={`p-2 rounded text-xs ${
                colorTheme === 'pastel' ? 'bg-purple-600' : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              <div className="flex justify-center space-x-1 mb-1">
                <div className="w-3 h-3 rounded-full bg-pink-200"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-200"></div>
                <div className="w-3 h-3 rounded-full bg-blue-200"></div>
              </div>
              Pastel
            </button>
            
            <button
              onClick={() => setColorTheme('monochrome')}
              className={`p-2 rounded text-xs ${
                colorTheme === 'monochrome' ? 'bg-purple-600' : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              <div className="flex justify-center space-x-1 mb-1">
                <div className="w-3 h-3 rounded-full bg-white"></div>
                <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                <div className="w-3 h-3 rounded-full bg-gray-700"></div>
              </div>
              Monochrome
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualizerControls;