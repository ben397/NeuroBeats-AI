import React, { useRef, useEffect } from 'react';

interface Dream3DVisualizerProps {
  audioData: {
    waveform: number[];
    frequencyData: number[];
    volume: number;
    bpm: number | null;
  };
  colorTheme: string;
  isPlaying: boolean;
}

const Dream3DVisualizer: React.FC<Dream3DVisualizerProps> = ({ 
  audioData, 
  colorTheme, 
  isPlaying 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  
  // Get theme colors based on selected theme
  const getThemeColors = () => {
    switch (colorTheme) {
      case 'cyberpunk':
        return ['#ff00ff', '#00ffff', '#ffff00', '#ff00aa', '#00aaff'];
      case 'neon':
        return ['#39ff14', '#ff3131', '#00ffff', '#ff00ff', '#ffff00'];
      case 'pastel':
        return ['#ffb3ba', '#ffdfba', '#ffffba', '#baffc9', '#bae1ff'];
      case 'monochrome':
        return ['#ffffff', '#dddddd', '#bbbbbb', '#999999', '#777777'];
      default:
        return ['#ff00ff', '#00ffff', '#ffff00', '#ff00aa', '#00aaff'];
    }
  };

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Resize canvas to match container size
    const resize = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };
    
    resize();
    window.addEventListener('resize', resize);
    
    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);
  
  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Time variables for animation
    let time = 0;
    let lastDrawTime = 0;
    
    // Noise function for terrain generation
    const noise = (x: number, y: number, z: number) => {
      const X = Math.floor(x) & 255;
      const Y = Math.floor(y) & 255;
      const Z = Math.floor(z) & 255;
      
      x -= Math.floor(x);
      y -= Math.floor(y);
      z -= Math.floor(z);
      
      const u = fade(x);
      const v = fade(y);
      const w = fade(z);
      
      // Simple hash function
      const hash = (n: number) => {
        return Math.sin(n) * 43758.5453 % 1;
      };
      
      const a = hash(X) + Y;
      const aa = hash(a) + Z;
      const ab = hash(a + 1) + Z;
      const b = hash(X + 1) + Y;
      const ba = hash(b) + Z;
      const bb = hash(b + 1) + Z;
      
      return lerp(w, lerp(v, lerp(u, hash(aa), hash(ba)), 
                              lerp(u, hash(ab), hash(bb))),
                     lerp(v, lerp(u, hash(aa + 1), hash(ba + 1)), 
                              lerp(u, hash(ab + 1), hash(bb + 1))));
    };
    
    // Helper functions for noise
    const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
    const lerp = (t: number, a: number, b: number) => a + t * (b - a);
    
    // Animate function
    const animate = (timestamp: number) => {
      const deltaTime = timestamp - lastDrawTime;
      lastDrawTime = timestamp;
      
      // Clear with fade effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Get colors for this theme
      const colors = getThemeColors();
      
      // Grid size for the terrain
      const gridSize = 20;
      const rows = Math.ceil(canvas.height / gridSize) + 2;
      const cols = Math.ceil(canvas.width / gridSize) + 2;
      
      // Calculate center point for the grid
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      // Extract audio features
      const bass = isPlaying ? 
        audioData.frequencyData.slice(0, 5).reduce((a, b) => a + b, 0) / (5 * 255) : 0.5;
      const mids = isPlaying ? 
        audioData.frequencyData.slice(5, 20).reduce((a, b) => a + b, 0) / (15 * 255) : 0.5;
      const treble = isPlaying ? 
        audioData.frequencyData.slice(20, 50).reduce((a, b) => a + b, 0) / (30 * 255) : 0.5;
      
      // Draw 3D terrain/grid with audio influence
      ctx.save();
      ctx.translate(centerX, centerY);
      
      // Create a 3D perspective rotation
      const rotX = Math.PI / 4 + (isPlaying ? bass * 0.2 : 0);
      const rotY = time * 0.1 + (isPlaying ? mids * 0.2 : 0);
      const rotZ = Math.sin(time * 0.05) * 0.1 + (isPlaying ? treble * 0.1 : 0);
      
      ctx.rotate(rotZ);
      
      // Size of the grid (affected by audio)
      const size = Math.min(canvas.width, canvas.height) * 0.7 * 
        (isPlaying ? (0.8 + audioData.volume * 0.4) : 1);
      
      // Draw terrain
      for (let y = -rows/2; y < rows/2; y++) {
        for (let x = -cols/2; x < cols/2; x++) {
          // Calculate 3D point
          const nx = x / cols;
          const ny = y / rows;
          const nz = time * 0.1;
          
          // Get noise value for height
          const noiseValue = noise(nx * 3, ny * 3, nz) * 0.5 + 0.5;
          
          // Audio influence on height
          const audioInfluence = isPlaying ? 
            audioData.frequencyData[Math.abs(Math.floor(x + y) % audioData.frequencyData.length)] / 255 : 0;
          
          // Calculate point position with perspective
          const scale = 1.5 - (y / rows + 0.5);
          const px = x * gridSize * scale;
          const py = y * gridSize * scale;
          
          // Height influenced by noise and audio
          const height = noiseValue * 50 + (isPlaying ? audioInfluence * 50 : 0);
          
          // Color based on height and theme
          const colorIndex = Math.floor(noiseValue * colors.length);
          const color = colors[colorIndex % colors.length];
          
          // Draw point
          const pointSize = 2 + (isPlaying ? audioInfluence * 8 : 0);
          
          ctx.beginPath();
          ctx.fillStyle = color;
          ctx.shadowBlur = 10;
          ctx.shadowColor = color;
          
          // Draw different shapes based on position
          if ((x + y) % 3 === 0) {
            // Diamond
            ctx.moveTo(px, py - height - pointSize);
            ctx.lineTo(px + pointSize, py - height);
            ctx.lineTo(px, py - height + pointSize);
            ctx.lineTo(px - pointSize, py - height);
          } else if ((x + y) % 3 === 1) {
            // Circle
            ctx.arc(px, py - height, pointSize, 0, Math.PI * 2);
          } else {
            // Square
            ctx.rect(px - pointSize/2, py - height - pointSize/2, pointSize, pointSize);
          }
          
          ctx.fill();
          
          // Connect points with lines for grid effect
          if (x < cols/2 - 1 && y < rows/2 - 1) {
            const nextNoiseX = noise((nx + 1/cols) * 3, ny * 3, nz) * 0.5 + 0.5;
            const nextNoiseY = noise(nx * 3, (ny + 1/rows) * 3, nz) * 0.5 + 0.5;
            
            const nextAudioX = isPlaying ? 
              audioData.frequencyData[Math.abs(Math.floor(x + 1 + y) % audioData.frequencyData.length)] / 255 : 0;
            const nextAudioY = isPlaying ? 
              audioData.frequencyData[Math.abs(Math.floor(x + y + 1) % audioData.frequencyData.length)] / 255 : 0;
            
            const nextScaleX = 1.5 - (y / rows + 0.5);
            const nextScaleY = 1.5 - ((y + 1) / rows + 0.5);
            
            const pxNext = (x + 1) * gridSize * nextScaleX;
            const pyNext = y * gridSize * nextScaleX;
            const pxNextY = x * gridSize * nextScaleY;
            const pyNextY = (y + 1) * gridSize * nextScaleY;
            
            const heightX = nextNoiseX * 50 + (isPlaying ? nextAudioX * 50 : 0);
            const heightY = nextNoiseY * 50 + (isPlaying ? nextAudioY * 50 : 0);
            
            // Draw connecting lines with gradient
            const gradient = ctx.createLinearGradient(
              px, py - height, pxNext, pyNext - heightX
            );
            gradient.addColorStop(0, color);
            gradient.addColorStop(1, colors[(colorIndex + 1) % colors.length]);
            
            ctx.beginPath();
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1;
            ctx.globalAlpha = 0.3;
            ctx.moveTo(px, py - height);
            ctx.lineTo(pxNext, pyNext - heightX);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(px, py - height);
            ctx.lineTo(pxNextY, pyNextY - heightY);
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }
      
      ctx.restore();
      
      // Update time based on audio
      const timeStep = 0.01 * (isPlaying ? (1 + audioData.volume * 2) : 1);
      time += timeStep;
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [audioData, isPlaying, colorTheme]);
  
  return <canvas ref={canvasRef} className="w-full h-full" />;
};

export default Dream3DVisualizer;