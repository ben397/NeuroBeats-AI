import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { AudioData, Track } from '../types';
import { preloadedTracks } from '../data/tracks';

interface AudioContextType {
  audioData: AudioData;
  isPlaying: boolean;
  currentTrack: Track | null;
  volume: number;
  togglePlayback: () => void;
  setCurrentTrack: (track: Track | null) => void;
  setVolume: (volume: number) => void;
  startMicrophoneInput: () => Promise<void>;
  stopMicrophoneInput: () => void;
  isMicrophoneActive: boolean;
}

const defaultAudioData: AudioData = {
  waveform: Array(128).fill(0),
  frequencyData: Array(128).fill(0),
  volume: 0,
  bpm: null
};

const AudioContext = createContext<AudioContextType>({
  audioData: defaultAudioData,
  isPlaying: false,
  currentTrack: null,
  volume: 0.8,
  togglePlayback: () => {},
  setCurrentTrack: () => {},
  setVolume: () => {},
  startMicrophoneInput: async () => {},
  stopMicrophoneInput: () => {},
  isMicrophoneActive: false
});

export const useAudioContext = () => useContext(AudioContext);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [audioData, setAudioData] = useState<AudioData>(defaultAudioData);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [volume, setVolume] = useState(0.8);
  const [isMicrophoneActive, setIsMicrophoneActive] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | MediaStreamAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const microphoneStreamRef = useRef<MediaStream | null>(null);
  
  // Initialize Web Audio API
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const initAudioContext = () => {
      try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        audioContextRef.current = new AudioContext();
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 256;
        
        // Create audio element for track playback
        audioRef.current = new Audio();
        audioRef.current.volume = volume;
        
        return true;
      } catch (error) {
        console.error('Web Audio API not supported:', error);
        return false;
      }
    };
    
    const initialized = initAudioContext();
    if (!initialized) return;
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
      if (microphoneStreamRef.current) {
        microphoneStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Audio analysis loop
  const analyzeAudio = () => {
    if (!analyserRef.current || !audioContextRef.current) return;
    
    const frequencyData = new Uint8Array(analyserRef.current.frequencyBinCount);
    const waveformData = new Uint8Array(analyserRef.current.frequencyBinCount);
    
    analyserRef.current.getByteFrequencyData(frequencyData);
    analyserRef.current.getByteTimeDomainData(waveformData);
    
    // Calculate volume
    const sum = frequencyData.reduce((acc, val) => acc + val, 0);
    const avg = sum / frequencyData.length || 0;
    const normalizedVolume = Math.min(1, avg / 256);
    
    setAudioData({
      frequencyData: Array.from(frequencyData),
      waveform: Array.from(waveformData),
      volume: normalizedVolume,
      bpm: estimateBPM(frequencyData)
    });
    
    animationFrameRef.current = requestAnimationFrame(analyzeAudio);
  };
  
  // Simple BPM estimation (mock)
  const estimateBPM = (frequencyData: Uint8Array) => {
    // This is a simplified mock BPM calculation
    // In a real app, we'd use a more sophisticated algorithm
    const bassEnergy = frequencyData.slice(0, 10).reduce((sum, val) => sum + val, 0);
    // Random value influenced by bass energy but constrained between 90-150 BPM
    return Math.floor(90 + (bassEnergy / 500) * 60);
  };

  // Setup audio source when track changes
  useEffect(() => {
    if (!audioContextRef.current || !analyserRef.current || !currentTrack) return;
    
    // Stop any existing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    
    // Setup new audio source
    audioRef.current = new Audio(currentTrack.url);
    audioRef.current.volume = volume;
    
    if (sourceRef.current) {
      sourceRef.current.disconnect();
    }
    
    // Resume audio context if suspended
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
    
    // Create new source and connect
    sourceRef.current = audioContextRef.current.createMediaElementSource(audioRef.current);
    sourceRef.current.connect(analyserRef.current);
    analyserRef.current.connect(audioContextRef.current.destination);
    
    // Start analysis
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    animationFrameRef.current = requestAnimationFrame(analyzeAudio);
    
    // Play if already in playing state
    if (isPlaying) {
      audioRef.current.play();
    }
    
    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [currentTrack]);
  
  // Handle play/pause
  useEffect(() => {
    if (!audioRef.current || !currentTrack) return;
    
    if (isPlaying) {
      audioRef.current.play().catch(error => {
        console.error('Error playing audio:', error);
        setIsPlaying(false);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrack]);
  
  // Handle volume change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Toggle playback
  const togglePlayback = () => {
    if (!currentTrack && preloadedTracks.length > 0) {
      // Auto-select first track if none selected
      setCurrentTrack(preloadedTracks[0]);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  // Start microphone input
  const startMicrophoneInput = async () => {
    if (!audioContextRef.current || !analyserRef.current) return;
    
    try {
      // Stop any playing track
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
      
      // Get microphone stream
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      microphoneStreamRef.current = stream;
      
      // Disconnect any existing source
      if (sourceRef.current) {
        sourceRef.current.disconnect();
      }
      
      // Create new source from microphone
      sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
      sourceRef.current.connect(analyserRef.current);
      
      // Start analysis
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      animationFrameRef.current = requestAnimationFrame(analyzeAudio);
      
      setIsMicrophoneActive(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  // Stop microphone input
  const stopMicrophoneInput = () => {
    if (microphoneStreamRef.current) {
      microphoneStreamRef.current.getTracks().forEach(track => track.stop());
      microphoneStreamRef.current = null;
    }
    
    setIsMicrophoneActive(false);
  };

  const value = {
    audioData,
    isPlaying,
    currentTrack,
    volume,
    togglePlayback,
    setCurrentTrack,
    setVolume,
    startMicrophoneInput,
    stopMicrophoneInput,
    isMicrophoneActive
  };

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
};