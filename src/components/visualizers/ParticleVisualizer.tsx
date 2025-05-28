import React, { useRef, useEffect } from 'react';

interface ParticleVisualizerProps {
  audioData: {
    waveform: number[];
    frequencyData: number[];
    volume: number;
    bpm: number | null;
  };
  colorTheme: string;
  isPlaying: boolean;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
}

const ParticleVisualizer: React.FC<ParticleVisualizerProps> = ({ 
  audioData, 
  colorTheme, 
  isPlaying 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
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

  // Initialize the canvas and particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions to match container
    const resize = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      
      // Reinitialize particles on resize
      initializeParticles();
    };
    
    // Create initial particles
    const initializeParticles = () => {
      const colors = getThemeColors();
      const particles: Particle[] = [];
      
      // Create a number of particles based on canvas size
      const particleCount = Math.floor((canvas.width * canvas.height) / 6000);
      
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 4 + 2,
          speedX: Math.random() * 1 - 0.5,
          speedY: Math.random() * 1 - 0.5,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.02
        });
      }
      
      particlesRef.current = particles;
    };
    
    resize();
    window.addEventListener('resize', resize);
    
    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [colorTheme]);
  
  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      particlesRef.current.forEach((particle, i) => {
        // Respond to audio data
        const frequencyIndex = Math.floor((i / particlesRef.current.length) * audioData.frequencyData.length);
        const frequencyValue = audioData.frequencyData[frequencyIndex] || 0;
        const audioInfluence = frequencyValue / 255;
        
        // Update particle based on audio
        const sizeModifier = isPlaying ? 1 + audioInfluence * 2 : 1;
        const speedModifier = isPlaying ? 1 + audioInfluence * 1.5 : 1;
        
        // Draw particle
        ctx.save();
        ctx.translate(particle.x, particle.y);
        ctx.rotate(particle.rotation);
        
        // Draw particle as a small polygon with glow
        ctx.shadowBlur = 15 * sizeModifier;
        ctx.shadowColor = particle.color;
        ctx.fillStyle = particle.color;
        
        const size = particle.size * sizeModifier;
        
        ctx.beginPath();
        if (i % 3 === 0) {
          // Triangle
          ctx.moveTo(0, -size);
          ctx.lineTo(size, size);
          ctx.lineTo(-size, size);
        } else if (i % 3 === 1) {
          // Square
          ctx.rect(-size/2, -size/2, size, size);
        } else {
          // Circle
          ctx.arc(0, 0, size/2, 0, Math.PI * 2);
        }
        ctx.closePath();
        ctx.fill();
        
        ctx.restore();
        
        // Update particle position
        particle.x += particle.speedX * speedModifier;
        particle.y += particle.speedY * speedModifier;
        particle.rotation += particle.rotationSpeed * (isPlaying ? (1 + audioInfluence) : 1);
        
        // Wrap around edges
        if (particle.x < -size) particle.x = canvas.width + size;
        if (particle.x > canvas.width + size) particle.x = -size;
        if (particle.y < -size) particle.y = canvas.height + size;
        if (particle.y > canvas.height + size) particle.y = -size;
      });
      
      animationRef.current = requestAnimationFrame(animate);
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

export default ParticleVisualizer;