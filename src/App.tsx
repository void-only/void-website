import React, { useState, useEffect, useRef } from 'react';
import { 
  Github, Gamepad2, Cpu, Monitor, Mouse, ExternalLink, Music, 
  Youtube, Play, Pause, Activity, Zap, Copy, Check, Disc, 
  Grid, Move
} from 'lucide-react';

// --- STYLES & ANIMATIONS ---
const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Jura:wght@300;500;700&display=swap');

  body {
    background-color: #000;
    color: #e2e8f0;
    font-family: 'Jura', sans-serif;
    overflow-x: hidden;
  }
  
  h1, h2, h3 {
    font-family: 'Cinzel', serif;
  }

  /* Star Animations */
  @keyframes twinkle {
    0%, 100% { opacity: 0.3; transform: scale(0.8); }
    50% { opacity: 1; transform: scale(1.2); }
  }
  
  /* Black Hole Accretion Disk */
  @keyframes spin-slow {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }

  @keyframes pulse-glow {
    0%, 100% { filter: drop-shadow(0 0 2px rgba(255,255,255,0.5)); }
    50% { filter: drop-shadow(0 0 8px rgba(0,255,255,0.8)); }
  }

  @keyframes fade-up {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .animate-float { animation: float 6s ease-in-out infinite; }
  .animate-spin-slow { animation: spin-slow 20s linear infinite; }
  .animate-spin-slower { animation: spin-slow 40s linear infinite reverse; }
  .animate-fade-up { animation: fade-up 0.8s ease-out forwards; }
  
  /* Glassmorphism Utilities */
  .glass-panel {
    background: rgba(10, 10, 15, 0.4);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
    transition: all 0.3s ease;
  }
  
  .glass-panel:hover {
    background: rgba(20, 20, 30, 0.5);
    border-color: rgba(255, 255, 255, 0.2);
    box-shadow: 0 0 20px rgba(6, 182, 212, 0.15);
    transform: translateY(-2px);
  }
`;

// --- CONFIG ---
const CONFIG = {
  musicUrl: "https://cdn.discordapp.com/attachments/1386051430049124525/1447625523609210995/l8IahfK.mp3?ex=69384dd4&is=6936fc54&hm=b23729eda85603b83f10a8b03441c1e6142454ad6676a970f4006761b80aa524&",
  discord: "void_only.",
  youtube: "https://youtube.com/@v.0.1.d_?si=mrKir7drsJyHuvRy",
  github: "https://github.com/void-only"
};

// --- COMPONENTS ---

// 1. Parallax Starfield (Restored & Smooth)
const StarField = () => {
  const [stars, setStars] = useState<{id: number, top: number, left: number, size: number, opacity: number}[]>([]);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Generate stars
    const newStars = Array.from({ length: 150 }, (_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.7 + 0.1
    }));
    setStars(newStars);

    const handleMouseMove = (e: MouseEvent) => {
      // Calculate offset based on center of screen
      const x = (e.clientX - window.innerWidth / 2) * 0.02; // Strength of effect
      const y = (e.clientY - window.innerHeight / 2) * 0.02;
      setOffset({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-black">
      {/* Stars Layer - Moves opposite to mouse for depth */}
      <div 
        className="absolute inset-0 transition-transform duration-100 ease-out"
        style={{ transform: `translate(${-offset.x}px, ${-offset.y}px)` }}
      >
        {stars.map((star) => (
          <div 
            key={star.id}
            className="absolute bg-white rounded-full"
            style={{
              top: `${star.top}%`,
              left: `${star.left}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
              boxShadow: `0 0 ${star.size * 2}px white`
            }}
          />
        ))}
      </div>
      
      {/* Nebula Fog Layers - Move faster for foreground effect */}
      <div 
        className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-purple-900/10 rounded-full blur-[150px] mix-blend-screen transition-transform duration-700 ease-out"
        style={{ transform: `translate(${offset.x * 2}px, ${offset.y * 2}px)` }}
      />
      <div 
        className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-900/10 rounded-full blur-[150px] mix-blend-screen transition-transform duration-700 ease-out"
        style={{ transform: `translate(${offset.x * 3}px, ${offset.y * 3}px)` }}
      />
    </div>
  );
};

// 2. The Singularity (Hero Visual)
const Singularity = () => {
  return (
    <div className="relative w-[300px] h-[300px] md:w-[500px] md:h-[500px] flex items-center justify-center pointer-events-none">
       {/* Accretion Disk (Outer) */}
       <div className="absolute inset-0 rounded-full border-[1px] border-white/10 animate-spin-slow"></div>
       <div className="absolute inset-[10%] rounded-full border-[1px] border-white/5 animate-spin-slower"></div>
       
       {/* Glow */}
       <div className="absolute inset-[35%] bg-white/5 blur-[50px] rounded-full animate-pulse"></div>

       {/* The Event Horizon (Black Hole) */}
       <div className="absolute inset-[30%] bg-black rounded-full shadow-[0_0_60px_rgba(255,255,255,0.15)] z-10 border border-white/5"></div>
       
       {/* Photon Ring */}
       <div className="absolute inset-[29%] rounded-full border border-white/20 blur-[1px] z-20"></div>
    </div>
  );
};

// 3. Constellation Cat (N.E.K.O)
const ConstellationCat = () => {
  const [mood, setMood] = useState<'idle' | 'purr'>('idle');
  const [hovered, setHovered] = useState(false);
  const [eyePos, setEyePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const maxMove = 5;
      const x = (e.clientX - window.innerWidth / 2) / 30;
      const y = (e.clientY - window.innerHeight / 2) / 30;
      
      setEyePos({
        x: Math.max(-maxMove, Math.min(maxMove, x)),
        y: Math.max(-maxMove, Math.min(maxMove, y))
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleClick = () => {
    setMood('purr');
    setTimeout(() => setMood('idle'), 2000);
  };

  return (
    <div 
      className="relative w-full h-64 glass-panel rounded-xl overflow-hidden flex flex-col items-center justify-center cursor-pointer group"
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="absolute top-4 right-4 text-[10px] tracking-[0.3em] text-slate-500 font-bold">
        CONSTELLATION: N.E.K.O
      </div>

      <div className={`relative w-48 h-48 transition-all duration-700 ${hovered ? 'scale-105' : 'scale-100'}`}>
        {/* The Constellation SVG */}
        <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">
           {/* Connecting Lines */}
           <path 
             d="M 50 70 L 40 40 L 70 50 L 100 40 L 130 50 L 160 40 L 150 70 L 170 120 L 140 160 L 60 160 L 30 120 Z" 
             className="fill-transparent stroke-white/20 stroke-1"
           />
           {/* Inner Face Lines */}
           <path d="M 60 160 L 100 120 L 140 160" className="fill-transparent stroke-white/10 stroke-[0.5]" />
           
           {/* Star Nodes (The Body) */}
           {[
             {cx:40, cy:40}, {cx:70, cy:50}, {cx:100, cy:40}, {cx:130, cy:50}, {cx:160, cy:40}, // Ears
             {cx:50, cy:70}, {cx:150, cy:70}, // Cheeks
             {cx:30, cy:120}, {cx:170, cy:120}, // Whiskers/Side
             {cx:60, cy:160}, {cx:140, cy:160} // Chin
           ].map((point, i) => (
             <circle key={i} cx={point.cx} cy={point.cy} r={Math.random() * 2 + 1} fill="white" className="animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
           ))}

           {/* Eyes (Glowing Stars) - NOW TRACKING MOUSE */}
           <g 
             className={`transition-transform duration-100 ${mood === 'purr' ? 'scale-y-10' : 'scale-y-100'}`} 
             style={{ transformOrigin: 'center', transform: `translate(${eyePos.x}px, ${eyePos.y}px)` }}
           >
             {/* Left Eye */}
             <circle cx="75" cy="90" r="3" fill="white" className="drop-shadow-[0_0_8px_cyan]" />
             {/* Right Eye */}
             <circle cx="125" cy="90" r="3" fill="white" className="drop-shadow-[0_0_8px_cyan]" />
           </g>

           {/* Heart/Core */}
           {mood === 'purr' && (
             <path 
               d="M 100 130 L 105 125 L 110 130 L 100 145 L 90 130 L 95 125 Z" 
               fill="#ec4899" 
               className="animate-bounce drop-shadow-[0_0_10px_#ec4899]"
             />
           )}
        </svg>
      </div>

      <div className="absolute bottom-4 text-center">
        <div className="text-xs text-cyan-200/50 tracking-widest mb-1 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
          {mood === 'purr' ? 'AFFECTION DETECTED' : 'HOVER TO SYNC'}
        </div>
      </div>
    </div>
  );
};

// 4. Flux Matrix (New Interactive Toy)
const FluxMatrix = () => {
  const [cells, setCells] = useState(Array(50).fill(0)); // 0 = off, 1 = on

  const handleHover = (index: number) => {
    setCells(prev => {
      const newCells = [...prev];
      newCells[index] = 1;
      return newCells;
    });
    
    // Decay effect
    setTimeout(() => {
      setCells(prev => {
        const newCells = [...prev];
        if (newCells[index] === 1) newCells[index] = 0;
        return newCells;
      });
    }, 800);
  };

  return (
    <div className="glass-panel p-6 rounded-xl group hover:border-cyan-500/50 transition-colors">
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="text-xl font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">FLUX MATRIX</div>
          <div className="text-[10px] text-cyan-400 tracking-[0.2em]">INTERACTIVE FIELD</div>
        </div>
        <div className="p-2 bg-cyan-500/10 rounded-lg">
          <Grid size={16} className="text-cyan-400" />
        </div>
      </div>
      
      {/* The Grid */}
      <div className="grid grid-cols-10 gap-1 h-32 w-full cursor-crosshair">
        {cells.map((active, i) => (
          <div 
            key={i}
            onMouseEnter={() => handleHover(i)}
            className={`rounded-sm transition-all duration-700 ${active ? 'bg-cyan-400 shadow-[0_0_10px_cyan] scale-110 duration-0' : 'bg-white/5 scale-100'}`}
          ></div>
        ))}
      </div>
      
      <div className="mt-4 text-[10px] text-slate-500 font-mono flex items-center gap-2">
        <Move size={10} /> HOVER TO DISTURB FIELD
      </div>
    </div>
  );
};

// 5. Music Player
const MusicPlayer = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.4);

  useEffect(() => {
    audioRef.current = new Audio(CONFIG.musicUrl);
    audioRef.current.loop = true;
    audioRef.current.volume = volume;
    return () => { audioRef.current?.pause(); };
  }, []);

  const toggle = () => {
    if(!audioRef.current) return;
    if(isPlaying) audioRef.current.pause();
    else audioRef.current.play().catch(e => console.log("Autoplay blocked"));
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="glass-panel p-6 rounded-xl flex items-center justify-between group">
      <div className="flex items-center gap-6">
        <div className={`relative w-12 h-12 flex items-center justify-center rounded-full border border-white/10 ${isPlaying ? 'animate-spin-slow' : ''}`}>
          <Disc size={24} className="text-white/80" />
          {isPlaying && <div className="absolute inset-0 border border-cyan-500/50 rounded-full animate-ping opacity-20"></div>}
        </div>
        <div>
          <div className="text-xs text-slate-500 tracking-[0.2em] mb-1">NOW PLAYING</div>
          <div className="text-lg font-bold text-white tracking-widest">KEROSENE</div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {isPlaying && (
          <div className="flex items-end gap-1 h-8">
            {[...Array(5)].map((_, i) => (
              <div 
                key={i} 
                className="w-1 bg-cyan-500 animate-pulse" 
                style={{ 
                  height: `${Math.random() * 100}%`,
                  animationDuration: `${0.5 + Math.random() * 0.5}s` 
                }}
              />
            ))}
          </div>
        )}

        <button 
          onClick={toggle}
          className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/20 flex items-center justify-center transition-all border border-white/10"
        >
          {isPlaying ? <Pause size={16} fill="white" /> : <Play size={16} fill="white" className="ml-1" />}
        </button>
      </div>
    </div>
  );
};

const CopyID = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const el = document.createElement('textarea');
    el.value = CONFIG.discord;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      onClick={handleCopy} 
      className="glass-panel p-4 rounded-xl flex items-center justify-between cursor-pointer group active:scale-95 transition-transform"
    >
      <div className="flex items-center gap-4">
        <div className="p-2 bg-[#5865F2]/20 rounded-lg text-[#5865F2] group-hover:text-white transition-colors">
          <Gamepad2 size={20} />
        </div>
        <div>
          <div className="text-[10px] text-slate-500 tracking-[0.2em]">DISCORD ID</div>
          <div className="text-sm font-bold text-slate-200">{CONFIG.discord}</div>
        </div>
      </div>
      <div className="text-slate-500 group-hover:text-white transition-colors">
        {copied ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
      </div>
    </div>
  );
};

// Reveal on Scroll Component
const RevealOnScroll = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={ref} 
      className={`transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// Typewriter Component
const Typewriter = ({ texts }: { texts: string[] }) => {
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  
  useEffect(() => {
    const currentText = texts[textIndex];
    const speed = isDeleting ? 50 : 150;

    const timeout = setTimeout(() => {
      if (!isDeleting && charIndex < currentText.length) {
        setCharIndex(charIndex + 1);
      } else if (isDeleting && charIndex > 0) {
        setCharIndex(charIndex - 1);
      } else if (!isDeleting && charIndex === currentText.length) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && charIndex === 0) {
        setIsDeleting(false);
        setTextIndex((prev) => (prev + 1) % texts.length);
      }
    }, speed);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, textIndex, texts]);

  return (
    <div className="h-6 flex items-center justify-center gap-2">
      <span className="text-xs md:text-sm text-slate-400 font-light tracking-[0.3em] uppercase">
        {texts[textIndex].substring(0, charIndex)}
      </span>
      <span className="w-0.5 h-4 bg-white animate-pulse"></span>
    </div>
  );
};

// Main App Structure
const App = () => {
  return (
    <div className="min-h-screen relative selection:bg-cyan-500/30 selection:text-white">
      <style>{GLOBAL_STYLES}</style>
      <StarField />
      
      {/* Scroll Fade Overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-transparent via-transparent to-black pointer-events-none z-0"></div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-20 md:py-32">
        
        {/* HERO SECTION */}
        <section className="flex flex-col items-center justify-center text-center min-h-[70vh] mb-32">
          
          <Singularity />
          
          <div className="mt-[-100px] md:mt-[-150px] relative z-20 space-y-6 animate-float">
            <h1 className="text-6xl md:text-9xl font-bold text-white tracking-[0.2em] drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]">
              V O I D
            </h1>
            <Typewriter texts={["GAME DEV", "EDITOR", "GAMER", "CAT LOVER"]} />
          </div>
          
          <div className="absolute bottom-10 animate-bounce opacity-30">
            <div className="w-[1px] h-20 bg-gradient-to-b from-transparent via-white to-transparent"></div>
          </div>
        </section>

        {/* CONTENT GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* LEFT COLUMN */}
          <div className="space-y-8">
            <RevealOnScroll delay={100}>
              <h2 className="text-2xl text-white tracking-[0.2em] border-b border-white/10 pb-4">TRANSMISSIONS</h2>
            </RevealOnScroll>
            
            {/* Music Player */}
            <RevealOnScroll delay={200}>
              <MusicPlayer />
            </RevealOnScroll>

            {/* Socials */}
            <div className="grid gap-4">
              <RevealOnScroll delay={300}>
                <CopyID />
              </RevealOnScroll>
              
              <RevealOnScroll delay={400}>
                <a href={CONFIG.youtube} target="_blank" rel="noreferrer" className="glass-panel p-4 rounded-xl flex items-center justify-between group active:scale-95 transition-transform">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-[#FF0000]/20 rounded-lg text-[#FF0000] group-hover:text-white transition-colors">
                      <Youtube size={20} />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 tracking-[0.2em]">CHANNEL</div>
                      <div className="text-sm font-bold text-slate-200">V O I D</div>
                    </div>
                  </div>
                  <ExternalLink size={18} className="text-slate-500 group-hover:text-white" />
                </a>
              </RevealOnScroll>

              <RevealOnScroll delay={500}>
                <a href={CONFIG.github} target="_blank" rel="noreferrer" className="glass-panel p-4 rounded-xl flex items-center justify-between group active:scale-95 transition-transform">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-white/10 rounded-lg text-white group-hover:text-cyan-400 transition-colors">
                      <Github size={20} />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 tracking-[0.2em]">REPOSITORY</div>
                      <div className="text-sm font-bold text-slate-200">GITHUB</div>
                    </div>
                  </div>
                  <ExternalLink size={18} className="text-slate-500 group-hover:text-white" />
                </a>
              </RevealOnScroll>
            </div>

            {/* Loadout */}
            <RevealOnScroll delay={600}>
              <div className="glass-panel p-6 rounded-xl space-y-4">
                 <div className="flex items-center gap-3 mb-2">
                   <Zap className="text-cyan-400" size={18} />
                   <span className="tracking-[0.2em] font-bold">LOADOUT</span>
                 </div>
                 <div className="space-y-3">
                   {[
                     { name: "Ryzen 9 5900X", type: "CORE" },
                     { name: "RTX 4080 FE", type: "VISUAL" },
                     { name: "Wooting 60HE", type: "INPUT" },
                     { name: "Alienware AW3423DW", type: "DISPLAY" }
                   ].map((item, i) => (
                     <div key={i} className="flex justify-between items-center text-sm border-b border-white/5 pb-2 last:border-0">
                       <span className="text-slate-300">{item.name}</span>
                       <span className="text-[10px] text-slate-600 tracking-wider">{item.type}</span>
                     </div>
                   ))}
                 </div>
              </div>
            </RevealOnScroll>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-8">
             <RevealOnScroll delay={150}>
               <h2 className="text-2xl text-white tracking-[0.2em] border-b border-white/10 pb-4">ARCHIVES</h2>
             </RevealOnScroll>

             {/* N.E.K.O */}
             <RevealOnScroll delay={250}>
               <ConstellationCat />
             </RevealOnScroll>

             {/* Projects & Toys */}
             <div className="space-y-4">
               
               {/* Flux Matrix (REPLACES VOID ENGINE) */}
               <RevealOnScroll delay={350}>
                 <FluxMatrix />
               </RevealOnScroll>

               {/* Active Games */}
               <RevealOnScroll delay={450}>
                 <div className="glass-panel p-6 rounded-xl hover:border-green-500/50 transition-colors group">
                   <div className="flex justify-between items-start mb-4">
                     <div>
                       <div className="text-xl font-bold text-white mb-1 group-hover:text-green-400 transition-colors">MISSION STATUS</div>
                       <div className="text-[10px] text-green-400 tracking-[0.2em]">ACTIVE GAMES</div>
                     </div>
                     <div className="p-2 bg-green-500/10 rounded-lg">
                       <Gamepad2 size={16} className="text-green-400" />
                     </div>
                   </div>
                   
                   <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-300">ARC RAIDERS</span>
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-[10px] text-green-500">ONLINE</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-300">BATTLEFIELD 6</span>
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                          <span className="text-[10px] text-yellow-500">STANDBY</span>
                        </div>
                      </div>
                   </div>
                 </div>
               </RevealOnScroll>
             </div>
          </div>

        </div>

        {/* Footer */}
        <footer className="mt-32 text-center text-[10px] text-slate-700 tracking-[0.5em] uppercase">
          End of Transmission // VOID Systems
        </footer>

      </div>
    </div>
  );
};

export default App;