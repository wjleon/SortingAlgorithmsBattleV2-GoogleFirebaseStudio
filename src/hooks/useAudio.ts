import { useCallback, useRef, useEffect } from 'react';

// Memoize AudioContext to avoid creating multiple instances
let audioContextInstance: AudioContext | null = null;
const getAudioContext = (): AudioContext | null => {
  if (typeof window !== 'undefined') {
    if (!audioContextInstance || audioContextInstance.state === 'closed') {
      audioContextInstance = new window.AudioContext();
    }
    return audioContextInstance;
  }
  return null;
};


export function useAudio(enabled: boolean) {
  const audioContextRef = useRef<AudioContext | null>(null);
  
  useEffect(() => {
    audioContextRef.current = getAudioContext();
  }, []);

  const playSound = useCallback((type: 'compare' | 'swap', value?: number) => {
    if (!enabled || !audioContextRef.current || audioContextRef.current.state === 'suspended') {
      // Attempt to resume context if suspended (e.g., due to user interaction policy)
      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume().catch(err => console.error("Error resuming audio context:", err));
      }
      if (!enabled || !audioContextRef.current || audioContextRef.current.state !== 'running') {
        return;
      }
    }
    
    const context = audioContextRef.current;
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    let baseFrequency = 200;
    if (value) {
      // Scale frequency based on value. Assume value is 1 to MAX_ELEMENTS (e.g. 200)
      // Map value to a frequency range (e.g., 200Hz to 1000Hz)
      baseFrequency = 200 + (value / 200) * 800; // Max value of 200 for scaling
      if (baseFrequency > 1200) baseFrequency = 1200; // Cap frequency
    }
    
    oscillator.type = 'sine';
    if (type === 'compare') {
      oscillator.frequency.setValueAtTime(baseFrequency, context.currentTime);
      gainNode.gain.setValueAtTime(0.05, context.currentTime); // Softer for comparison
    } else if (type === 'swap') {
      oscillator.frequency.setValueAtTime(baseFrequency * 1.2, context.currentTime); // Slightly higher pitch for swap
      gainNode.gain.setValueAtTime(0.08, context.currentTime); // Louder for swap
    }

    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + 0.05); // Short beep

  }, [enabled]);

  // Attempt to resume audio context on user interaction (e.g. a click anywhere)
  useEffect(() => {
    const resumeAudio = () => {
      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume().catch(err => console.error("Error resuming audio context on interaction:", err));
      }
      document.removeEventListener('click', resumeAudio);
      document.removeEventListener('keydown', resumeAudio);
    };

    if (typeof window !== 'undefined') {
      document.addEventListener('click', resumeAudio);
      document.addEventListener('keydown', resumeAudio);
    }

    return () => {
      if (typeof window !== 'undefined') {
        document.removeEventListener('click', resumeAudio);
        document.removeEventListener('keydown', resumeAudio);
      }
    };
  }, []);


  return { playSound };
}
