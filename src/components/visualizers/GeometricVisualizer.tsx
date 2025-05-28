import React, { useRef, useEffect } from 'react';

interface GeometricVisualizerProps {
  audioData: {
    waveform: number[];
    frequencyData: number[];
    volume: number;
    bpm: number | null;
  };
  colorTheme: string;
  isPlaying: boolean;
}

const GeometricVisualizer: React.FC<GeometricVisualizerProps> = ({ 
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
    
    let time = 0;
    const colors = getThemeColors();
    
    const animate = () => {
      // Clear canvas with fade effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Calculate center of canvas
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      // Number of shapes to draw (based on audio)
      const numShapes = isPlaying ? 
        Math.floor(5 + audioData.volume * 10) : 5;
      
      // Draw multiple geometric layers
      for (let i = 0; i < numShapes; i++) {
        // Choose shape based on frequency data
        const frequencyIndex = Math.floor((i / numShapes) * audioData.frequencyData.length);
        const frequencyValue = audioData.frequencyData[frequencyIndex] || 0;
        const normalizedValue = frequencyValue / 255;
        
        // Size based on audio + index
        const baseSize = Math.min(canvas.width, canvas.height) * 0.3;
        const size = baseSize * (1 - i / numShapes) * (isPlaying ? (0.5 + normalizedValue * 0.5) : 1);
        
        // Rotation based on time and audio
        const rotation = time * (i % 2 === 0 ? 1 : -1) * 0.2 + 
          (isPlaying ? normalizedValue * Math.PI : 0);
        
        // Color based on theme and index
        const colorIndex = i % colors.length;
        const color = colors[colorIndex];
        
        // Set drawing styles
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(rotation);
        ctx.lineWidth = 2 + normalizedValue * 3;
        ctx.strokeStyle = color;
        ctx.shadowBlur = 15 * (isPlaying ? (0.5 + normalizedValue * 0.5) : 0.5);
        ctx.shadowColor = color;
        
        // Draw different shapes based on index
        if (i % 3 === 0) {
          // Pentagon
          drawPolygon(ctx, 0, 0, size, 5);
        } else if (i % 3 === 1) {
          // Hexagon
          drawPolygon(ctx, 0, 0, size, 6);
        } else {
          // Star
          drawStar(ctx, 0, 0, size, size * 0.5, 8);
        }
        
        ctx.stroke();
        ctx.restore();
      }
      
      // Update time
      time += 0.01;
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    // Helper function to draw regular polygon
    const drawPolygon = (
      ctx: CanvasRenderingContext2D, 
      x: number, 
      y: number, 
      radius: number, 
      sides: number
    ) => {
      ctx.beginPath();
      for (let i = 0; i < sides; i++) {
        const angle = (i / sides) * Math.PI * 2;
        const px = x + Math.cos(angle) * radius;
        const py = y + Math.sin(angle) * radius;
        
        if (i === 0) {
          ctx.moveTo(px, py);
        } else {
          ctx.lineTo(px, py);
        }
      }
      ctx.closePath();
    };
    
    // Helper function to draw star
    const drawStar = (
      ctx: CanvasRenderingContext2D, 
      x: number, 
      y: number, 
      outerRadius: number, 
      innerRadius: number, 
      points: number
    ) => {
      ctx.beginPath();
      for (let i = 0; i < points * 2; i++) {
        const angle = (i / (points * 2)) * Math.PI * 2;
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const px = x + Math.cos(angle) * radius;
        const py = y + Math.sin(angle) * radius;
        
        if (i === 0) {
          ctx.moveTo(px, py);
        } else {
          ctx.lineTo(px, py);
        }
      }
      ctx.closePath();
    };
    
    animate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [audioData, isPlaying, colorTheme]);
  
  return <canvas ref={canvasRef} className="w-full h-full" />;
};

export default GeometricVisualizer;