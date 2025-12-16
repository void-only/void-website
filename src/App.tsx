import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';

const App = () => {
  const [bootFinished, setBootFinished] = useState(false);
  const [isDay, setIsDay] = useState(true);
  const [time, setTime] = useState("00:00");

  // --- Clock & Theme Logic ---
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      
      // Update time string
      setTime(now.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
      }));

      // Update Day/Night state (Day is 06:00 to 18:00)
      setIsDay(hours >= 6 && hours < 18);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    // w-full ensures consistent width across devices
    <div className="relative w-full h-screen bg-black text-white overflow-hidden selection:bg-white selection:text-black">
      {/* Global Styles for Font and specific effects */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700;900&display=swap');
        
        body, html { 
            font-family: 'Orbitron', sans-serif; 
            margin: 0;
            padding: 0;
            background-color: #000;
            width: 100%;
            height: 100%;
            overflow: hidden;
        }
        
        .neon-text {
          text-shadow: 
            0 0 5px rgba(255, 255, 255, 0.9),
            0 0 10px rgba(255, 255, 255, 0.6),
            0 0 20px rgba(255, 255, 255, 0.4);
        }

        .icon-glow {
           filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.8));
        }
        
        .grid-bg {
          background-image: 
            linear-gradient(rgba(30, 30, 30, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(30, 30, 30, 0.5) 1px, transparent 1px);
          background-size: 40px 40px;
        }

        /* Fixed Star Drift Animation - Left to Right */
        @keyframes drift {
          0% { 
            transform: translateX(0px) translateY(0px); 
            opacity: 0; 
          }
          10% { 
            opacity: var(--star-opacity); 
          }
          90% { 
            opacity: var(--star-opacity); 
          }
          100% { 
            transform: translateX(150px) translateY(20px); 
            opacity: 0; 
          }
        }
      `}</style>

      {/* Ambient Starfield Background (Visible after boot) */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: bootFinished ? 1 : 0 }}
        transition={{ duration: 2, delay: 0.5 }}
        className="absolute inset-0 pointer-events-none"
      >
          <Starfield />
      </motion.div>

      {/* Main Content Area (Always mounted, fades in) */}
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: bootFinished ? 1 : 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="fixed inset-0 z-10 flex items-center justify-center pointer-events-none"
      >
         <div className="pointer-events-auto">
             {/* Main Content Placeholder */}
         </div>
      </motion.main>

      {/* Top Right UI (Clock & Icons) - TIGHT spacing */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: bootFinished ? 1 : 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="fixed top-4 right-4 flex items-center gap-1 z-50 select-none"
      >
        <motion.div 
            className="icon-glow text-white flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          {/* Filled icons for better visibility */}
          {isDay ? (
            <Sun size={14} strokeWidth={2} fill="currentColor" className="text-white" />
          ) : (
            <Moon size={14} strokeWidth={2} fill="currentColor" className="text-white" />
          )}
        </motion.div>
        
        {/* Clock Text */}
        <div className="text-[10px] neon-text tracking-widest font-bold text-right">
          {time}
        </div>
      </motion.div>
      
      {/* AI Companion - Floating Cat Icon */}
      <AICompanion bootFinished={bootFinished} />

      {/* Boot Sequence Overlay */}
      <AnimatePresence>
        {!bootFinished && (
          <BootSequence onComplete={() => setBootFinished(true)} />
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Helper Component: Typewriter Message ---
const TypewriterMessage = ({ text, color = "text-white" }: { text: string, color?: string }) => {
  const [displayedText, setDisplayedText] = useState("");

  // Calculate a fixed width based on text length to keep centering stable
  const estimatedWidth = Math.min(220, Math.max(80, text.length * 8));

  useEffect(() => {
    let i = 0;
    setDisplayedText("");
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 30); 

    return () => clearInterval(interval);
  }, [text]);

  return (
    <motion.div
        initial={{ opacity: 0, y: 5, x: "-50%" }}
        animate={{ opacity: 1, y: 0, x: "-50%" }}
        exit={{ opacity: 0, y: 2, x: "-50%" }}
        style={{ width: `${estimatedWidth}px` }} 
        // Decreased size to text-[8px]
        className={`absolute bottom-full left-1/2 mb-2 text-center text-[8px] font-bold ${color} tracking-widest pointer-events-none whitespace-normal leading-relaxed`}
    >
        {displayedText}
        {/* Cursor */}
        <span className={`inline-block w-[2px] h-[8px] ${color === 'text-white' ? 'bg-white' : 'bg-red-500'} ml-1 align-middle animate-pulse`}></span>
    </motion.div>
  );
};

// --- Sub-Component: AI Companion (Emotional Cat) ---
const AICompanion = ({ bootFinished }) => {
  const [message, setMessage] = useState("");
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // State: 'idle' | 'sleeping' | 'dizzy' | 'dizzy-recover' | 'angry'
  const [mood, setMood] = useState('idle');
  const [blink, setBlink] = useState(false);
  
  // Interaction tracking
  const tapCount = useRef(0);
  const lastTapTime = useRef(0);
  const inactivityTimer = useRef<NodeJS.Timeout | null>(null);
  const tapResetTimer = useRef<NodeJS.Timeout | null>(null);
  const angryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dizzyTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const recoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Motion Values for 3D Face Movement
  const faceX = useMotionValue(0);
  const faceY = useMotionValue(0);

  // --- 1. Inactivity / Sleep Logic ---
  const resetInactivity = () => {
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    if (mood === 'angry' || mood === 'dizzy' || mood === 'dizzy-recover') return; // Don't sleep if emotional
    
    inactivityTimer.current = setTimeout(() => {
        setMood('sleeping');
        setMessage(""); // Clear any active messages
    }, 8000); // 8 seconds to sleep
  };

  useEffect(() => {
    if (bootFinished) resetInactivity();
    return () => {
        if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
        if (angryTimeoutRef.current) clearTimeout(angryTimeoutRef.current);
        if (dizzyTimeoutRef.current) clearTimeout(dizzyTimeoutRef.current);
        if (recoverTimeoutRef.current) clearTimeout(recoverTimeoutRef.current);
    };
  }, [bootFinished]);

  // --- 2. Looking Around Logic (Idle State Only) ---
  useEffect(() => {
    let lookTimeout: NodeJS.Timeout;

    const triggerLook = () => {
        const newX = Math.random() * 8 - 4; // Range -4 to 4px
        const newY = Math.random() * 6 - 3; // Range -3 to 3px
        animate(faceX, newX, { duration: 0.6, ease: "circOut" });
        animate(faceY, newY, { duration: 0.6, ease: "circOut" });
        
        // Only schedule next look if we are still idle
        lookTimeout = setTimeout(triggerLook, Math.random() * 2000 + 1500);
    };

    // Only start the loop if we are idle
    if (mood === 'idle') {
        triggerLook();
    } else {
        // Stop any pending look timeouts
        clearTimeout(lookTimeout);
        // Center face immediately
        animate(faceX, 0, { duration: 0.5 });
        animate(faceY, 0, { duration: 0.5 });
    }

    // Blink Logic
    const triggerBlink = () => {
      if (mood !== 'sleeping' && mood !== 'dizzy' && mood !== 'dizzy-recover') {
          setBlink(true);
          setTimeout(() => setBlink(false), 150);
      }
      setTimeout(triggerBlink, Math.random() * 3000 + 2000);
    };
    const blinkTimer = setTimeout(triggerBlink, 2000);

    return () => {
      clearTimeout(lookTimeout);
      clearTimeout(blinkTimer);
    };
  }, [mood]);

  // --- 3. Interaction Logic ---
  const handleClick = () => {
    // Lock interaction if angry
    if (mood === 'angry') return;

    const now = Date.now();
    
    // Wake up if sleeping
    if (mood === 'sleeping') {
        setMood('idle');
        setMessage("system online.");
        resetInactivity();
        return;
    }

    // Reset Inactivity Timer
    resetInactivity();

    // Tap Counting for Dizzy/Angry
    if (now - lastTapTime.current < 400) {
        tapCount.current += 1;
    } else {
        tapCount.current = 1; // Reset count if tapping too slow
    }
    lastTapTime.current = now;

    // Clear previous short reset timer
    if (tapResetTimer.current) clearTimeout(tapResetTimer.current);

    // THRESHOLD: ANGRY (>= 6 rapid taps)
    if (tapCount.current >= 6) {
        setMood('angry');
        setMessage("angy");
        
        // Clear dizzy timeouts
        if (dizzyTimeoutRef.current) clearTimeout(dizzyTimeoutRef.current);
        if (recoverTimeoutRef.current) clearTimeout(recoverTimeoutRef.current);
        
        // Cool down after 5 seconds
        if (angryTimeoutRef.current) clearTimeout(angryTimeoutRef.current);
        angryTimeoutRef.current = setTimeout(() => {
            setMood('idle');
            tapCount.current = 0;
            setMessage("");
            resetInactivity();
        }, 5000);
    } 
    // THRESHOLD: DIZZY (>= 4 rapid taps)
    else if (tapCount.current >= 4) {
        setMood('dizzy');
        setMessage("calibration lost...");
        
        // Clear existing dizzy sequence
        if (dizzyTimeoutRef.current) clearTimeout(dizzyTimeoutRef.current);
        if (recoverTimeoutRef.current) clearTimeout(recoverTimeoutRef.current);

        // 1. Stay Dizzy for 4.5 seconds
        dizzyTimeoutRef.current = setTimeout(() => {
            setMood('dizzy-recover');
        }, 4500);

        // 2. Shake head for 0.5s then back to Idle (Total 5s)
        recoverTimeoutRef.current = setTimeout(() => {
            setMood('idle');
            tapCount.current = 0;
            setMessage("");
            resetInactivity();
        }, 5000);
    } 
    // THRESHOLD: NORMAL INTERACTION
    else {
        // Only set to idle if not already dizzy
        if (mood !== 'dizzy' && mood !== 'dizzy-recover') {
            setMood('idle');
            if (timerRef.current) clearTimeout(timerRef.current);
            const normalMessages = [
                "hooman… why tap?",
                "nyahaha, that tickled.",
                "nya~ you found my button.",
                "grrrnyaa.",
                "boop denied.",
                "i allow one boop, hooman.",
                "puny hooman, stop this!",
                "meow? no.",
                "purr...haps later.",
                "do not disturb the floof.",
                "my whiskers detect cringe."
            ];
            const randomMsg = normalMessages[Math.floor(Math.random() * normalMessages.length)];
            setMessage(randomMsg);
            timerRef.current = setTimeout(() => setMessage(""), 2500);
            
            // Reset tap count if user stops tapping
            tapResetTimer.current = setTimeout(() => {
                tapCount.current = 0;
            }, 1500);
        }
    }
  };

  // --- Visual Helpers based on Mood ---
  const catColor = mood === 'angry' ? '#ff3b3b' : 'white';
  const shadowColor = mood === 'angry' ? 'rgba(255, 59, 59, 0.8)' : 'rgba(255,255,255,0.9)';
  
  return (
    <div className="fixed top-[20%] w-full flex justify-center z-40 pointer-events-none">
         <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: bootFinished ? 1 : 0, scale: bootFinished ? 1 : 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="relative pointer-events-auto flex flex-col items-center"
         >
            {/* Sleeping Zzz Animation */}
            <AnimatePresence>
                {mood === 'sleeping' && (
                    <motion.div
                        key="zzz-container"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }} 
                        className="absolute top-0 right-2 z-50 flex flex-col items-center pointer-events-none"
                    >
                         {/* Z 1 */}
                         <motion.span
                            initial={{ opacity: 0, y: 5, x: -2 }}
                            animate={{ opacity: 1, y: -10, x: 2 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
                            className="text-[8px] font-bold text-white/80 absolute"
                        >z</motion.span>
                         {/* Z 2 */}
                         <motion.span
                            initial={{ opacity: 0, y: 5, x: 2 }}
                            animate={{ opacity: 1, y: -15, x: -2 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                            className="text-[10px] font-bold text-white/80 absolute"
                        >z</motion.span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Message */}
             <AnimatePresence>
                {message && mood !== 'sleeping' && 
                    <TypewriterMessage 
                        text={message} 
                        color={mood === 'angry' ? "text-red-500" : "text-white"} 
                    />
                }
            </AnimatePresence>

            {/* The Cat Icon */}
            <motion.div
                whileHover={mood !== 'angry' ? { scale: 1.1 } : {}}
                whileTap={mood !== 'angry' ? { scale: 0.95 } : {}} // Much more subtle tap effect
                onClick={handleClick}
                style={{ touchAction: "manipulation" }} 
                animate={
                    // Angry: Fast, small vibration (Left/Right)
                    mood === 'angry' ? { x: [-1, 1, -1], y: [-1, 1, -1] } :
                    // Dizzy: Static (Eyes spin)
                    mood === 'dizzy' ? { scale: 1 } :
                    // Dizzy Recover: Head Shake
                    mood === 'dizzy-recover' ? { rotate: [0, -20, 20, -20, 20, 0] } :
                    // Default Float
                    { y: [0, -4, 0] } 
                }
                transition={
                    mood === 'angry' 
                    ? { duration: 0.05, repeat: Infinity } // Very fast vibration
                    : mood === 'dizzy-recover' 
                    ? { duration: 0.5 } // Fast shake duration
                    : { 
                        scale: { type: "spring", stiffness: 800, damping: 10 },
                        y: { duration: 4, repeat: Infinity, ease: "easeInOut" } // Float
                      }
                }
                className="relative cursor-pointer group flex items-center justify-center p-4"
            >
               {/* Custom "Cyber Cat" SVG */}
               <svg 
                  width="44" 
                  height="44" 
                  viewBox="0 0 100 100" 
                  style={{ 
                      overflow: 'visible',
                      filter: `drop-shadow(0 0 12px ${shadowColor})`
                  }}
                  className="transition-all duration-300"
               >
                 {/* Main Head Shape - Sleek & Geometric */}
                 <motion.path 
                   d="M 20 35 L 15 15 L 40 25 L 60 25 L 85 15 L 80 35 Q 90 50 85 70 Q 50 90 15 70 Q 10 50 20 35 Z" 
                   fill={catColor}
                   animate={{ fill: catColor }} // Animate color change for anger
                   transition={{ duration: 0.3 }}
                 />
                 
                 {/* 3D FACE GROUP (Eyes, Nose, Whiskers) */}
                 <motion.g style={{ x: faceX, y: faceY }}>
                    
                    {/* EYES */}
                    {mood === 'sleeping' ? (
                        // Sleeping Eyes (Lines)
                        <>
                           <path d="M 30 55 L 40 55" stroke="black" strokeWidth="2" strokeLinecap="round" />
                           <path d="M 60 55 L 70 55" stroke="black" strokeWidth="2" strokeLinecap="round" />
                        </>
                    ) : (
                        // Awake Eyes
                        <>
                            {/* Left Eye */}
                            <g transform="translate(35, 55)">
                                {mood === 'dizzy' || mood === 'dizzy-recover' ? (
                                    <motion.path 
                                        d="M -5 0 A 5 5 0 0 1 5 0 A 2.5 2.5 0 0 1 0 0"
                                        stroke="black" strokeWidth="2" fill="none"
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    />
                                ) : mood === 'angry' ? (
                                    <path d="M -5 -3 L 5 3 L -5 3 Z" fill="black" /> // Angry Slant
                                ) : (
                                    <motion.circle 
                                        r="5"
                                        fill="black" 
                                        animate={{ scaleY: blink ? 0.05 : 1 }}
                                        transition={{ duration: 0.1 }}
                                    />
                                )}
                            </g>

                            {/* Right Eye */}
                            <g transform="translate(65, 55)">
                                {mood === 'dizzy' || mood === 'dizzy-recover' ? (
                                    <motion.path 
                                        d="M -5 0 A 5 5 0 0 1 5 0 A 2.5 2.5 0 0 1 0 0"
                                        stroke="black" strokeWidth="2" fill="none"
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    />
                                ) : mood === 'angry' ? (
                                    <path d="M 5 -3 L -5 3 L 5 3 Z" fill="black" /> // Angry Slant
                                ) : (
                                    <motion.circle 
                                        r="5"
                                        fill="black" 
                                        animate={{ scaleY: blink ? 0.05 : 1 }}
                                        transition={{ duration: 0.1 }}
                                    />
                                )}
                            </g>
                        </>
                    )}
                 
                    {/* Nose */}
                    <path d="M 46 64 L 54 64 L 50 69 Z" fill="black" />

                    {/* Whiskers */}
                    <path d="M 20 60 L 5 55" stroke="black" strokeWidth="3" strokeLinecap="round" />
                    <path d="M 20 68 L 8 68" stroke="black" strokeWidth="3" strokeLinecap="round" />
                    
                    <path d="M 80 60 L 95 55" stroke="black" strokeWidth="3" strokeLinecap="round" />
                    <path d="M 80 68 L 92 68" stroke="black" strokeWidth="3" strokeLinecap="round" />
                 </motion.g>
               </svg>
               
               {/* Extra "Life" Pulse (Red if angry) */}
               <div className={`absolute inset-0 rounded-full blur-xl animate-pulse opacity-0 group-hover:opacity-50 transition-opacity duration-500 ${mood === 'angry' ? 'bg-red-500/30' : 'bg-white/10'}`} />
            </motion.div>
         </motion.div>
     </div>
  );
};

// --- Sub-Component: Ambient Starfield ---
const Starfield = () => {
    // Generate stars only once
    const stars = useMemo(() => {
        const starCount = 60; 
        return Array.from({ length: starCount }).map((_, i) => ({
            id: i,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 120 - 20}%`, 
            size: Math.random() < 0.7 ? 1 : 2, 
            opacity: Math.random() * 0.5 + 0.2,
            duration: Math.random() * 20 + 20, 
            delay: Math.random() * 20,
        }));
    }, []);

    return (
        <div className="w-full h-full overflow-hidden absolute inset-0">
            {stars.map((star) => (
                <div
                    key={star.id}
                    className="absolute bg-white rounded-full"
                    style={{
                        top: star.top,
                        left: star.left,
                        width: `${star.size}px`,
                        height: `${star.size}px`,
                        '--star-opacity': star.opacity, 
                        opacity: 0, 
                        animation: `drift ${star.duration}s infinite linear`,
                        animationDelay: `-${star.delay}s`,
                        willChange: 'transform, opacity'
                    } as React.CSSProperties}
                />
            ))}
        </div>
    );
};

// --- Sub-Component: Boot Sequence ---
const BootSequence = ({ onComplete }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);
  const [typedText, setTypedText] = useState("");
  const fullText = "Initializing..."; 

  useEffect(() => {
    // 1. Progress Bar Animation (Reduced to 3s)
    const animation = animate(count, 
      [0, 15, 28, 35, 60, 75, 82, 98, 100], 
      { 
        duration: 3, 
        times: [0, 0.1, 0.3, 0.35, 0.5, 0.7, 0.85, 0.95, 1],
        ease: "easeInOut",
        onComplete: () => {
          setTimeout(onComplete, 200); 
        }
      }
    );

    return () => animation.stop();
  }, []);

  // 2. Typewriter Effect Logic
  useEffect(() => {
    let i = 0;
    setTypedText(""); // Reset
    
    const typeInterval = setInterval(() => {
        i++;
        // Use slice instead of index access to strictly safely get the substring
        setTypedText(fullText.slice(0, i)); 
        
        if (i >= fullText.length) {
            clearInterval(typeInterval);
        }
    }, 100); 

    return () => clearInterval(typeInterval);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center cursor-wait"
      exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeOut" } }}
    >
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />

      <div className="relative z-10 w-full max-w-md px-6 flex flex-col gap-4">
        
        {/* Progress Bar */}
        <div className="w-full h-[2px] bg-neutral-900 rounded-full overflow-hidden relative">
          <motion.div 
            className="h-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)]"
            style={{ width: useTransform(count, (value) => `${value}%`) }}
          />
        </div>

        {/* Text Info */}
        <div className="flex justify-between w-full text-xs tracking-[0.2em] font-bold h-6">
          <span className="text-white text-shadow-[0_0_8px_rgba(255,255,255,0.8)] flex items-center">
            {typedText}
            {/* Blinking Block Cursor */}
            <motion.span 
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, ease: "steps(2)" }}
                className="inline-block w-2.5 h-4 bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)] ml-1 align-middle"
            />
          </span>
          <span className="text-white text-shadow-[0_0_8px_rgba(255,255,255,0.8)] w-[4ch] text-right">
            <motion.span>{rounded}</motion.span>%
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default App;
