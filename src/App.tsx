/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Navbar } from './Navbar';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue, useInView, MotionValue } from 'motion/react';
import { Testimonials } from './Testimonials';
import { X, Cpu, Linkedin, Github, ArrowRight, Facebook } from 'lucide-react';

import dialcraftImg from './images/640278467_122203525586563833_3738548141300404979_n.jpg';
import colorPaletteImg from './images/Screenshot 2026-03-09 011828.png';
import brightBdImg from './images/Screenshot 2026-03-09 231854.png';
import aiFinderImg from './images/Screenshot 2026-03-09 231719.png';
import blogSiteImg from './images/image1.png';
import myselfImg from './images/1878312872148782_3242345_45243.jpg';

// --- Types & Data ---

interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  link: string;
  era: 'cyberpunk' | 'brutalist' | 'celestial' | 'tech';
  countdown: string;
  details: {
    challenges: string;
    solutions: string;
    technologies: string[];
  };
  theme: {
    primary: string;
    bg: string;
    cursor: string;
  };
}

interface Milestone {
  id: string;
  year: string;
  title: string;
  org: string;
  evolution: string;
  details: string;
  side: 'left' | 'right';
}

interface Strand {
  index: number;
  milestone: Milestone | null;
  angle: number;
  y: number;
}

interface VaultPanelProps {
  letter: string;
  project: Project;
  index: number;
  activeIndex: number | null;
  setActiveIndex: (index: number | null) => void;
  onSelect: (project: Project) => void;
}

interface DNAStrandProps {
  strand: Strand;
  globalRotation: MotionValue<number>;
  radius: number;
  isHoveredGlobal?: React.MutableRefObject<boolean>;
}

const projects: Project[] = [
  {
    id: "01",
    title: "DIALCRAFT WATCHES",
    category: "Functionalities",
    description: "Custom printed & hand-painted watch customization : Single & bulk orders\nPersonalized watches in Bangladesh\n📩 DM to customize your watch\n𝓓𝓲𝓪𝓵𝓬𝓻𝓪𝓯𝓽 - 𝓬𝓻𝓪𝓯𝓽𝓮𝓭 𝓯𝓸𝓻 𝔂𝓸𝓾",
    image: dialcraftImg,
    link: "https://mustakim-1.github.io/watch/",
    era: 'cyberpunk',
    countdown: "00:00:42:12",
    details: {
      challenges: "“I always want to do something unique, but whenever I discover a rare idea, I realize I’m not skilled enough to bring it to life yet.”",
      solutions: "Learned what I discovered",
      technologies: ["css", "js", "html", "tailwind", "AI Integrated"]
    },
    theme: {
      primary: "#00FF66",
      bg: "#050505",
      cursor: "crosshair"
    }
  },
  {
    id: "02",
    title: "COLOR PALETTE",
    category: "functionalities",
    description: "A PERFECT TOOL TO FIND BALANCED COLOR",
    image: colorPaletteImg,
    link: "https://mustakim-1.github.io/colors/",
    era: 'celestial',
    countdown: "12:04:55:01",
    details: {
      challenges: "IT WAS VERY HARD FOR ME; THE ERRORS ALMOST KILLED MY WILLPOWER",
      solutions: "TOOK HELP FROM SOME PROFESSIONALS",
      technologies: ["React", "JS", "css", "TypeScript", "html"]
    },
    theme: {
      primary: "#A855F7",
      bg: "#0A0510",
      cursor: "default"
    }
  },
  {
    id: "03",
    title: "BRIGHT BD",
    category: "EDUCATIONAL PLATFORM",
    description: "THIS IS THE BIGGEST PROJECT I HAVE EVER DONE. ACTUALLY I MADE IT FOR A DIVISIONAL SCIENCE FAIR COMPETITION, AND IT WAS THE WINNER OF THE COMPETITION. I WANT TO PUBLISH IT THROUGH GOVERNMENT, I ALREADY TALKED TO THE MAYOR OF CHITTAGONG ABOUT IT AND WITH SOME OTHER POPULAR FACES OF OUR COUNTRY.",
    image: brightBdImg,
    link: "https://brightbd.netlify.app/",
    era: 'brutalist',
    countdown: "04:12::059",
    details: {
      challenges: "Most difficult",
      solutions: "Gave my best",
      technologies: ["typescript", "js", "css", "React","html","AI Integration"]
    },
    theme: {
      primary: "#FFFFFF",
      bg: "#111111",
      cursor: "nw-resize"
    }
  },
  {
    id: "04",
    title: "AI FINDER",
    category: "TREASURE",
    description: "A TOOL WHERE YOU CAN FIND AI. NOT VERY USEFUL. 🙂",
    image: aiFinderImg,
    link: "https://mustakim-1.github.io/ai-finder/",
    era: 'tech',
    countdown: "99:23:59:59",
    details: {
      challenges: "It was very boring to collect the links of the AI, and it was very difficult to find the right ones.",
      solutions: "I took help from ChatGPT to find the right links, and I also took help from some friends.",
      technologies: ["html", "css", "js", "tailwind"]
    },
    theme: {
      primary: "#3B82F6",
      bg: "#000814",
      cursor: "wait"
    }
  },
  {
    id: "05",
    title: "SULPHURIC BENCH BLOG SITE [ NOT FINISHED ]",
    category: "",
    description: "It's not that good of a project, but I placed it here because I learned many things with this project... I think it's almost 2 years old.",
    image: blogSiteImg,
    link: "https://mustakim-1.github.io/blog-site/",
    era: 'cyberpunk',
    countdown: "00:00:00:00",
    details: {
      challenges: "Not that challenging",
      solutions: "",
      technologies: ["html", "css", "js"]
    },
    theme: {
      primary: "#FF0055",
      bg: "#050002",
      cursor: "crosshair"
    }
  }
];

// --- Components ---

const CustomCursor = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { stiffness: 500, damping: 28 };
  const x = useSpring(cursorX, springConfig);
  const y = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 rounded-full border pointer-events-none z-[9999] mix-blend-difference flex items-center justify-center"
      style={{ 
        x, 
        y, 
        translateX: '-50%', 
        translateY: '-50%',
        borderColor: '#00FF66'
      }}
    >
      <motion.div 
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="w-1 h-1 rounded-full"
        style={{ backgroundColor: '#00FF66' }}
      />
    </motion.div>
  );
};

const Marquee = ({ text, reverse = false }: { text: string, reverse?: boolean }) => (
  <div className="overflow-hidden py-4 border-y border-white/5 bg-dark-surface/50">
    <div className={reverse ? "marquee-track-reverse" : "marquee-track"}>
      {[...Array(10)].map((_, i) => (
        <span key={i} className="text-6xl md:text-8xl font-display uppercase leading-none px-8 text-outline hover:text-neon transition-colors duration-500 cursor-default whitespace-nowrap">
          {text}
        </span>
      ))}
    </div>
  </div>
);

const EntryScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div 
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[200] bg-dark-base flex flex-col items-center justify-center p-12"
    >
      <div className="w-full max-w-xl space-y-8">
        <div className="flex justify-between text-[10px] font-mono tracking-[0.5em] text-neon uppercase">
          <span>Initializing System</span>
          <span>{progress}%</span>
        </div>
        <div className="h-[2px] w-full bg-white/5 relative overflow-hidden">
          <motion.div 
            className="absolute inset-y-0 left-0 bg-neon shadow-[0_0_15px_rgba(0,255,102,0.5)]"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="grid grid-cols-2 gap-4 text-[8px] font-mono text-white/20 uppercase">
          <span>{'>'} Loading Architecture</span>
          <span>{'>'} Verifying Identity</span>
          <span>{'>'} Calibrating Motion</span>
          <span>{'>'} Accessing Vault</span>
        </div>
      </div>
    </motion.div>
  );
};

const FadeIn = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string, key?: React.Key }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);



const VaultPanel: React.FC<VaultPanelProps> = ({ letter, project, index, activeIndex, setActiveIndex, onSelect }) => {
  const isActive = activeIndex === index;
  const isAnyActive = activeIndex !== null;
  
  return (
    <motion.div
      layout
      onHoverStart={() => setActiveIndex(index)}
      onHoverEnd={() => setActiveIndex(null)}
      onClick={() => onSelect(project)}
      className={`relative h-[60vh] md:h-screen border-r border-white/10 bg-black overflow-hidden cursor-pointer transition-colors duration-500 ${isActive ? 'flex-[3]' : 'flex-1'} flex flex-col justify-end group`}
      style={{
        willChange: "flex-grow"
      }}
    >
      {/* Background Image (Revealed on Hover) */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={false}
        animate={{ 
          opacity: isActive ? 1 : 0.4, // Increased base opacity
          scale: isActive ? 1.1 : 1,
          filter: isActive ? "grayscale(0%)" : "grayscale(100%)"
        }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <img 
          src={project.image} 
          alt={project.title} 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        {/* Darker overlay for better text contrast */}
        <div className="absolute inset-0 bg-black/70 group-hover:bg-black/40 transition-colors duration-500" />
      </motion.div>

      {/* The Giant Letter (V, A, U, L, T) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 overflow-hidden">
        <motion.span 
          animate={{ 
            y: isActive ? "-20%" : "0%",
            opacity: isActive ? 0.1 : 1, // Fades out more when active to let content shine
            scale: isActive ? 1.5 : 1
          }}
          className="text-[20vw] font-display font-black text-white/30 select-none" // Increased from white/10 to white/30
        >
          {letter}
        </motion.span>
      </div>

      {/* Content Overlay */}
      <div className="relative z-20 p-8 md:p-12 flex flex-col justify-end h-full bg-gradient-to-t from-black via-black/80 to-transparent">
        {/* Vertical Text (Inactive State) */}
        {!isActive && !isAnyActive && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute top-12 left-1/2 -translate-x-1/2 hidden md:block"
          >
            <span className="writing-vertical text-xs font-mono tracking-[0.5em] text-white/70 uppercase whitespace-nowrap font-bold">
              {project.category}
            </span>
          </motion.div>
        )}

        {/* Active Content */}
        <motion.div
          initial={false}
          animate={{ 
            y: isActive ? 0 : 20,
            opacity: isActive ? 1 : 0
          }}
          className="space-y-4"
        >
          <div className="flex items-center gap-4">
            <span className="text-neon font-mono text-sm tracking-widest font-bold">0{index + 1}</span>
            <div className="h-[2px] w-12 bg-neon" />
          </div>
          
          <h3 className="text-4xl md:text-6xl font-sans font-black uppercase leading-none text-white drop-shadow-lg">
            {project.title}
          </h3>
          
          {isActive && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-base text-white/90 max-w-md line-clamp-2 md:line-clamp-none font-medium leading-relaxed"
            >
              {project.description}
            </motion.p>
          )}
        </motion.div>
      </div>
      
      {/* Hover Border Highlight */}
      <div className="absolute inset-0 border border-white/0 group-hover:border-white/10 transition-colors duration-300 pointer-events-none" />
    </motion.div>
  );
};

const ShutterVault = ({ projects, onSelect, isModalOpen }: { projects: Project[], onSelect: (p: Project) => void, isModalOpen: boolean }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const letters = "VAULT".split("");
  const vaultProjects = useMemo(() => projects.slice(0, 5), [projects]);

  useEffect(() => {
    if (isModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        setActiveIndex((prev) => (prev === null ? 0 : (prev + 1) % vaultProjects.length));
      } else if (e.key === "ArrowLeft") {
        setActiveIndex((prev) => (prev === null ? vaultProjects.length - 1 : (prev - 1 + vaultProjects.length) % vaultProjects.length));
      } else if (e.key === "Enter") {
        if (activeIndex !== null) {
          onSelect(vaultProjects[activeIndex]);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, vaultProjects, onSelect, isModalOpen]);

  return (
    <section id="vault" className="min-h-screen bg-black relative z-10 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden p-8 border-b border-white/10">
        <h2 className="text-4xl font-display font-black text-white">VAULT</h2>
        <p className="text-xs font-mono text-white/40 mt-2">SECURE ARCHIVES</p>
      </div>

      {vaultProjects.map((project, i) => (
        <VaultPanel 
          key={project.id}
          letter={letters[i]}
          project={project}
          index={i}
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
          onSelect={onSelect}
        />
      ))}
    </section>
  );
};

const ProjectModal = ({ project, onClose }: { project: Project | null, onClose: () => void }) => {
  const eraStyles = {
    cyberpunk: { accent: "text-neon", border: "border-neon/30", font: "font-mono" },
    brutalist: { accent: "text-white", border: "border-white/20", font: "font-display" },
    celestial: { accent: "text-purple-400", border: "border-purple-500/20", font: "font-sans" },
    tech: { accent: "text-blue-400", border: "border-blue-500/20", font: "font-mono" }
  };

  const style = project ? eraStyles[project.era] : eraStyles.tech;

  return (
    <AnimatePresence>
      {project && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black"
          />
          
          {/* Immersive Container */}
          <motion.div
            layoutId={`letter-container-${project.id}`}
            className="relative w-full h-full bg-black flex flex-col md:flex-row overflow-hidden"
          >
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 md:top-8 md:right-8 z-50 p-2 md:p-4 bg-white/10 md:bg-white/5 hover:bg-white hover:text-black rounded-full transition-all duration-300 mix-blend-difference"
            >
              <X className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            
            {/* Left: Immersive Visual */}
            <div className="w-full md:w-1/2 h-[35vh] md:h-full relative overflow-hidden shrink-0">
              <motion.img 
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                src={project.image} 
                alt={project.title} 
                className="w-full h-full object-cover object-top opacity-90"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent md:bg-gradient-to-r" />
              
              {/* Desktop Title Overlay */}
              <div className="hidden md:block absolute bottom-24 left-24">
                <div className={`text-xs ${style.font} tracking-[0.5em] uppercase opacity-70 mb-4 text-white`}>
                  {project.era} // {project.category}
                </div>
                <h2 className="text-6xl md:text-9xl font-sans font-black uppercase tracking-tighter leading-none text-white mix-blend-overlay">
                  {project.title}
                </h2>
              </div>
            </div>
            
            {/* Right: Content */}
            <div className="w-full md:w-1/2 flex-1 md:h-full overflow-y-auto custom-scrollbar bg-black p-6 pt-20 md:p-24 flex flex-col justify-start md:justify-center">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="max-w-xl space-y-8 md:space-y-16"
              >
                {/* Mobile Title */}
                <div className="md:hidden pt-4 space-y-3">
                  <div className={`text-[10px] ${style.font} tracking-[0.3em] uppercase opacity-70 text-white`}>
                    {project.era} // {project.category}
                  </div>
                  <h2 className="text-4xl font-sans font-black uppercase tracking-tighter leading-none text-white">
                    {project.title}
                  </h2>
                </div>

                <div>
                  <p className="text-xl md:text-3xl font-light text-white/70 leading-relaxed whitespace-pre-line">
                    {project.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-12 border-t border-white/10 pt-12">
                  <div className="space-y-4">
                    <div className={`text-[10px] ${style.font} tracking-[0.3em] uppercase opacity-40`}>Challenge</div>
                    <p className="text-sm text-white/50 leading-relaxed">{project.details.challenges}</p>
                  </div>
                  <div className="space-y-4">
                    <div className={`text-[10px] ${style.font} tracking-[0.3em] uppercase opacity-40`}>Solution</div>
                    <p className="text-sm text-white/50 leading-relaxed">{project.details.solutions}</p>
                  </div>
                </div>

                <div className="space-y-6 pt-6">
                  <div className="flex flex-wrap gap-3">
                    {project.details.technologies.map((tech, i) => (
                      <span 
                        key={i} 
                        className={`px-4 py-2 border border-white/10 text-[10px] ${style.font} uppercase tracking-widest bg-white/5 text-white/60`}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <motion.a 
                  href={project.link}
                  whileHover={{ x: 10 }}
                  className={`inline-flex items-center gap-4 text-white ${style.font} text-sm uppercase tracking-widest hover:text-neon transition-colors`}
                >
                  Initiate Protocol <ArrowRight className="w-5 h-5" />
                </motion.a>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};



const KnowledgeDNA = () => {
  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-10%" });
  const [showPixelation, setShowPixelation] = useState(false);
  const [radius, setRadius] = useState(150);

  useEffect(() => {
    const updateRadius = () => {
      setRadius(window.innerWidth < 768 ? 60 : 150);
    };
    updateRadius();
    window.addEventListener('resize', updateRadius);
    return () => window.removeEventListener('resize', updateRadius);
  }, []);

  useEffect(() => {
    if (isInView) {
      setShowPixelation(true);
      const timer = setTimeout(() => setShowPixelation(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isInView]);

  const rotation = useMotionValue(0);
  const isHoveredGlobal = useRef(false);

  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();
    const animate = (now: number) => {
      const delta = now - lastTime;
      lastTime = now;
      // Rotate faster, pause if hovered
      if (!isHoveredGlobal.current) {
        rotation.set(rotation.get() + delta * 0.035);
      }
      animationFrameId = requestAnimationFrame(animate);
    };
    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [rotation]);

  const opacity = 1; // Constant opacity now that we aren't scrolling through it

  const milestones = [
    { 
      id: "SEQ_01", 
      year: "2022", 
      title: "Chakaria Korak Biddyapith", 
      org: "CLASS: 6",
      evolution: "FOUNDATIONAL_LEARNING",
      details: "Completed 6th standard.",
      side: "left" as const
    },
    { 
      id: "SEQ_02", 
      year: "2023-2024", 
      title: "HARBANG UNION HIGH SCHOOL", 
      org: "CLASS: 7-8",
      evolution: "ACADEMIC_GROWTH",
      details: "Started Programming Hero course, but didn't complete.",
      side: "right" as const
    },
    { 
      id: "SEQ_03", 
      year: "Current", 
      title: "SANOWARA ISLAM BOYS HIGH SCHOOL", 
      org: "2025-2026",
      evolution: "ONGOING_EDUCATION",
      details: "Currently attending.",
      side: "left" as const
    }
  ];

  // Generate visual DNA twists (non-milestone strands)
  const totalStrands = 20;
  const strands = Array.from({ length: totalStrands }).map((_, i) => {
    const milestone = milestones.find((m, idx) => i === Math.floor((totalStrands / milestones.length) * idx + 2));
    return {
      index: i,
      milestone: milestone || null,
      angle: (i / totalStrands) * Math.PI * 4, // 2 full twists
      y: (i / totalStrands) * 100 - 50 // -50% to 50%
    };
  });

  return (
    <section ref={containerRef} className="min-h-[80vh] md:min-h-screen bg-black relative z-10 py-24 flex flex-col">
      <div className="relative w-full flex-1 min-h-[60vh] md:min-h-[80vh] overflow-hidden flex items-center justify-center bg-black">
        
        {/* Insane Entry Effect: Pixelation */}
        <AnimatePresence>
          {showPixelation && <PixelTransition />}
        </AnimatePresence>

        {/* Scientific Background */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,102,0.05)_0%,transparent_70%)]" />
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-full bg-gradient-to-b from-transparent via-white/10 to-transparent" />
        </div>

        {/* DNA Helix Container */}
        <motion.div 
          style={{ opacity }}
          className="relative w-full max-w-4xl h-[80vh] flex flex-col items-center justify-center perspective-[1000px] z-10"
        >
           {strands.map((strand) => (
             <DNAStrand 
               key={strand.index} 
               strand={strand} 
               globalRotation={rotation}
               radius={radius}
               isHoveredGlobal={isHoveredGlobal}
             />
           ))}
        </motion.div>

        {/* Scientific HUD */}
        <div className="absolute top-24 left-6 md:top-12 md:left-12 font-mono text-[10px] text-neon/40 space-y-2 pointer-events-none z-0 opacity-50 md:opacity-100">
           <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-neon animate-pulse" />
              <span>SEQUENCE_ANALYSIS: ACTIVE</span>
           </div>
           <div>GENOME_ID: KNOWLEDGE_DNA_v4.8</div>
           <div className="text-white/20 hidden md:block">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i}>{Math.random().toString(16).substring(2, 15).toUpperCase()}</div>
              ))}
           </div>
        </div>

        <div className="absolute bottom-24 right-6 md:bottom-12 md:right-12 font-mono text-[10px] text-neon/40 text-right pointer-events-none z-0 opacity-50 md:opacity-100">
           <div>MUTATION_RATE: <motion.span>{useTransform(rotation, v => ((v % 100) * 0.05 + 0.1).toFixed(2))}</motion.span>%</div>
           <div>EVOLUTIONARY_STABILITY: NOMINAL</div>
        </div>

      </div>
    </section>
  );
};

const DNAStrand: React.FC<DNAStrandProps> = ({ strand, globalRotation, radius, isHoveredGlobal }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const handleHoverStart = () => {
    setIsHovered(true);
    if (isHoveredGlobal) isHoveredGlobal.current = true;
  };
  
  const handleHoverEnd = () => {
    setIsHovered(false);
    if (isHoveredGlobal) isHoveredGlobal.current = false;
  };
  
  // Calculate local rotation based on global scroll rotation + strand's fixed angle
  const rotateY = useTransform(globalRotation, (r: number) => r + (strand.angle * 180) / Math.PI);
  
  // X position based on sine of rotation
  const xOffset = radius; // Radius of helix
  const x1 = useTransform(rotateY, (r) => Math.sin((r * Math.PI) / 180) * xOffset);
  const x2 = useTransform(rotateY, (r) => Math.sin(((r + 180) * Math.PI) / 180) * xOffset);
  
  // Z position for depth sorting (opacity/blur)
  const z1 = useTransform(rotateY, (r) => Math.cos((r * Math.PI) / 180) * xOffset);
  const opacity1 = useTransform(z1, [-xOffset, 0, xOffset], [0.2, 0.5, 1]);
  const opacity2 = useTransform(z1, [-xOffset, 0, xOffset], [1, 0.5, 0.2]);

  const milestone = strand.milestone;

  return (
    <div 
      className="absolute w-full flex items-center justify-center pointer-events-none"
      style={{ top: `${50 + strand.y}%` }}
    >
      {/* Connecting Line (Hydrogen Bond) */}
      <motion.div 
        style={{ 
          width: useTransform(rotateY, (r) => Math.abs(Math.sin((r * Math.PI) / 180) * xOffset * 2)),
          opacity: useTransform(z1, [-xOffset, xOffset], [0.1, 0.3])
        }}
        className="h-[1px] bg-white/30 absolute"
      />

      {/* Node 1 */}
      <motion.div
        style={{ x: x1, opacity: opacity1, scale: useTransform(z1, [-xOffset, xOffset], [0.8, 1.2]) }}
        className={`w-3 h-3 rounded-full bg-neon shadow-[0_0_15px_rgba(0,255,102,0.5)] z-10`}
      />

      {/* Node 2 (Opposite side) */}
      <motion.div
        style={{ x: x2, opacity: opacity2, scale: useTransform(z1, [xOffset, -xOffset], [0.8, 1.2]) }}
        className={`w-3 h-3 rounded-full bg-white/20 z-10`}
      />

      {/* Milestone Content (If present) */}
      {milestone && (
        <motion.div
          onHoverStart={handleHoverStart}
          onHoverEnd={handleHoverEnd}
          onClick={() => {
            // For mobile toggle
            if (window.innerWidth < 768) {
              if (isHovered) {
                handleHoverEnd();
              } else {
                handleHoverStart();
              }
            }
          }}
          style={{ 
            x: milestone.side === 'left' ? useTransform(x1, v => v - (window.innerWidth < 768 ? 10 : 20)) : useTransform(x2, v => v + (window.innerWidth < 768 ? 10 : 20)),
            opacity: useTransform(z1, milestone.side === 'left' ? [-xOffset, xOffset] : [xOffset, -xOffset], [0, 1]),
            pointerEvents: 'auto'
          }}
          className={`absolute ${milestone.side === 'left' ? 'right-[50%] pr-4 md:pr-12 text-right' : 'left-[50%] pl-4 md:pl-12 text-left'} group cursor-pointer w-[40vw] md:w-[30vw]`}
        >
           <motion.div 
             animate={isHovered ? { scale: 1.05, x: milestone.side === 'left' ? -10 : 10 } : { scale: 1, x: 0 }}
             className="relative"
           >
              <div className="text-[8px] md:text-sm font-mono text-neon/60 mb-1 tracking-widest">{milestone.year} // {milestone.evolution}</div>
          <h3 className="text-[12px] md:text-3xl font-display font-bold !text-white uppercase tracking-normal leading-tight">
            {milestone.title}
          </h3>
          <div className="text-[8px] md:text-sm font-mono !text-white/40 uppercase mb-2 md:mb-4 tracking-wide">{milestone.org}</div>
              
              <AnimatePresence>
                {isHovered && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <p className={`text-[10px] md:text-base text-white/60 font-light leading-relaxed max-w-[120px] md:max-w-[250px] ${milestone.side === 'left' ? 'ml-auto' : 'mr-auto'}`}>
                      {milestone.details}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Hover Indicator Line */}
              <motion.div 
                initial={{ width: 0 }}
                animate={isHovered ? { width: '100%' } : { width: 0 }}
                className={`absolute -bottom-2 ${milestone.side === 'left' ? 'right-0' : 'left-0'} h-[1px] bg-neon/50`}
              />
           </motion.div>
        </motion.div>
      )}
    </div>
  );
};

const PixelTransition = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = window.innerWidth / 10; // Low res
    canvas.height = window.innerHeight / 10;
    ctx.imageSmoothingEnabled = false;

    let frame = 0;
    const totalFrames = 30; // 0.5s at 60fps

    const render = () => {
      frame++;
      const progress = frame / totalFrames;
      
      if (progress > 1) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }

      // Draw random pixels
      const w = canvas.width;
      const h = canvas.height;
      const blockSize = Math.max(1, 20 * (1 - progress)); // Blocks get smaller
      
      ctx.clearRect(0, 0, w, h);
      
      for (let x = 0; x < w; x += blockSize) {
        for (let y = 0; y < h; y += blockSize) {
          if (Math.random() > progress) { // Fewer pixels as progress increases
            const gray = Math.floor(Math.random() * 255);
            ctx.fillStyle = `rgba(${gray}, ${gray}, ${gray}, ${1 - progress})`;
            ctx.fillRect(x, y, blockSize, blockSize);
          }
        }
      }

      requestAnimationFrame(render);
    };

    render();
  }, []);

  return (
    <motion.canvas
      ref={canvasRef}
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="absolute inset-0 w-full h-full z-[100] pointer-events-none mix-blend-overlay"
      style={{ imageRendering: "pixelated" }}
    />
  );
};





export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const containerRef = useRef(null);

  const identityRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });



  const { scrollYProgress: identityScroll } = useScroll({
    target: identityRef,
    offset: ["start end", "end start"]
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);
  
  const identityRotateY = useTransform(identityScroll, [0, 1], [-15, 15]);
  const identityScale = useTransform(identityScroll, [0, 0.5, 1], [0.95, 1, 0.95]);

  return (
    <div ref={containerRef} className="min-h-screen font-sans cursor-none relative overflow-x-hidden w-full max-w-full">
      <CustomCursor />
      <div className="grain" />
      <div className="noise-bg" />
      
      <AnimatePresence>
        {!isLoaded && <EntryScreen onComplete={() => setIsLoaded(true)} />}
      </AnimatePresence>
 
      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />

      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <motion.section 
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="h-screen flex flex-col items-center justify-center text-center px-6 md:px-12 relative overflow-hidden"
      >
        <FadeIn>
          <div className="text-[10px] font-mono tracking-[0.8em] text-neon uppercase mb-12 flex items-center gap-6 justify-center">
            <span className="w-12 h-[1px] bg-neon" /> 
            DEFINING THE DIGITAL EDGE
            <span className="w-12 h-[1px] bg-neon" />
          </div>
          <h1 className="text-[12vw] md:text-[10vw] font-display font-black leading-[0.8] tracking-tighter uppercase">
            M U S T A K I M <br />
            <span className="text-outline">SAWOD.</span>
          </h1>
        </FadeIn>
        
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-6">
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-[1px] h-24 bg-gradient-to-b from-neon to-transparent" 
          />
          <span className="text-[8px] font-mono uppercase tracking-[0.5em] opacity-20">Initiate Exploration</span>
        </div>
      </motion.section>

      <Marquee text="Developer • Systems Thinker • Future Builder • " />

      {/* Identity Bento */}
      <section id="identity" ref={identityRef} className="py-24 md:py-48 px-4 md:px-12 max-w-7xl mx-auto perspective-[2000px]">
        <motion.div 
          style={{ 
            rotateY: identityRotateY, 
            scale: identityScale,
            transformStyle: "preserve-3d"
          }}
          className="grid grid-cols-1 md:grid-cols-12 gap-6"
        >
          <div className="md:col-span-8 glass p-6 md:p-12 rounded-[2.5rem] space-y-8 neon-glow-hover transition-all duration-500" style={{ transform: "translateZ(50px)" }}>
            <div className="text-[10px] font-mono tracking-[0.4em] text-neon uppercase">The Architect</div>
            <h2 className="text-4xl md:text-8xl font-display uppercase tracking-tighter leading-none">
              Building <br /> Beyond <br /> <span className="text-outline">Limits.</span>
            </h2>
            <p className="text-base md:text-2xl font-light text-white/50 leading-relaxed max-w-2xl">
              16 years old, thinking beyond limits. Focused on exceptional and immersive work that redefine that redefine AI isn't enough to replace yourself
            </p>
          </div>
          
          <div className="md:col-span-4 glass p-6 md:p-12 rounded-[2.5rem] flex flex-col justify-between neon-glow-hover neon-glow transition-all duration-500 relative min-h-[400px]" style={{ transform: "translateZ(30px)" }}>
            <img src={myselfImg} alt="User Photo" className="absolute inset-0 w-full h-full object-cover object-top rounded-[2.5rem]" />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/60 to-transparent rounded-b-[2.5rem]" />
            <div className="relative z-10 flex flex-col justify-end h-full pt-20">
              <div className="text-3xl md:text-5xl font-display uppercase tracking-tighter text-white drop-shadow-md">MYSELF</div>
              <p className="text-white/80 text-sm uppercase tracking-widest mt-2 drop-shadow-md">Crafting Digital Experiences</p>
            </div>
          </div>

          <div className="md:col-span-12 glass p-6 md:p-12 rounded-[2.5rem] flex flex-col justify-between neon-glow-hover neon-glow transition-all duration-500" style={{ transform: "translateZ(30px)" }}>
            <Cpu className="text-neon mb-6 md:mb-12" size={40} />
            <div className="space-y-4">
              <div className="text-3xl md:text-5xl font-display uppercase tracking-tighter">METHOD</div>
              <p className="text-white/40 text-sm uppercase tracking-widest">BUILDING DIFFERENT SINCE 3years</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Radar Skills Section */}
      <section id="systems" className="py-24 md:py-48 px-4 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
          <FadeIn>
            <div className="space-y-12">
              <div>
                <div className="text-[10px] font-mono tracking-[0.4em] text-neon mb-6 uppercase">System Capabilities</div>
                <h2 className="text-4xl md:text-8xl font-display uppercase tracking-tighter leading-none">Capability  <br /> Array</h2>
              </div>
              
              <div className="space-y-12">
                {[
                  { label: "Core Systems", skills: ["React", "TypeScript", "js", "css"] },
                  { label: "Design Logic", skills: ["UI Systems", "Layout Architecture", "social media post designer", "poster designer", "presentation designer"] },
                  { label: "learning", skills: ["word-press", "Sensors", "advance js", "web-design", "IoT", "debating", "prompt Engineering", "AI"] },
                  { label: "passionate to", skills: ["boxing", "workout", "arm wrestling", "cooking", "experience something unique..."] }
                ].map((group, i) => (
                  <div key={group.label} className="space-y-4">
                    <h4 className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-bold">{group.label}</h4>
                    <div className="flex flex-wrap gap-3">
                      {group.skills.map(skill => (
                        <motion.span 
                          key={skill} 
                          whileHover={{ scale: 1.05, color: "#00FF66", borderColor: "#00FF66" }}
                          className="px-5 py-2 glass border border-white/10 text-[10px] font-mono uppercase tracking-widest rounded-full transition-all duration-300 hover:neon-glow cursor-default"
                        >
                          {skill}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
          
          <FadeIn delay={0.3}>
            <div className="relative aspect-square flex items-center justify-center">
              {/* Concentric Circles */}
              {[...Array(4)].map((_, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1, duration: 1 }}
                  className="absolute border border-white/5 rounded-full"
                  style={{ inset: `${i * 15}%` }}
                />
              ))}
              
              {/* Radar Sweep */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-tr from-neon/20 to-transparent rounded-full origin-center"
                style={{ clipPath: 'polygon(50% 50%, 100% 0, 100% 100%)' }}
              />
              
              {/* Center Point */}
              <div className="w-4 h-4 bg-neon rounded-full shadow-[0_0_20px_rgba(0,255,102,0.8)] z-10" />
              
              {/* Random Data Blips */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    opacity: [0, 1, 0],
                    scale: [0.5, 1.2, 0.5]
                  }}
                  transition={{ 
                    duration: 2, 
                    delay: i * 0.7, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute w-1.5 h-1.5 bg-neon rounded-full"
                  style={{
                    top: `${25 + Math.random() * 50}%`,
                    left: `${25 + Math.random() * 50}%`
                  }}
                />
              ))}

              {/* Grid Lines */}
              <div className="absolute inset-0 flex items-center justify-center opacity-10">
                <div className="w-full h-[1px] bg-white" />
                <div className="h-full w-[1px] bg-white absolute" />
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Knowledge Ascension - The Scroll Up */}
      <KnowledgeDNA />

      <Marquee text="System_v4.8 // ACCESS_GRANTED // " reverse />

      {/* Vault Section - Shutter Architecture */}
      <ShutterVault projects={projects} onSelect={setSelectedProject} isModalOpen={!!selectedProject} />

      {/* Achievements Section - Holographic Data Pillars */}
      <section id="lab" className="py-24 md:py-48 px-4 md:px-12 max-w-7xl mx-auto relative">
        <div className="mb-16 md:mb-32 flex flex-col items-center text-center space-y-4 relative z-10">
          <div className="text-[10px] font-mono tracking-[0.6em] text-neon uppercase">System Accolades</div>
          <h2 className="text-3xl md:text-7xl font-display uppercase tracking-tighter">Mission <span className="text-outline">Success</span></h2>
        </div>

        <div className="flex flex-col md:flex-row gap-4 h-[800px] md:h-[600px] relative z-10">
          {[
            { title: "Innovator of the Year", org: "BCSIR DIVISIONAL SCIENCE FEST", year: "2026", id: "01", color: "from-neon/20 to-transparent" },
            { title: "WINNER OF CHOTTOGRAM DIVISIONAL KABBADI TOURNAMENT", org: "DIVISIONAL KABBADI", year: "2025", id: "02", color: "from-purple-500/20 to-transparent" },
            { title: "NATIONALIST, AT BANGLADESH PHYSICS OLYMPIAD ", org: "", year: "2024,2025", id: "03", color: "from-blue-500/20 to-transparent" },
            { title: "NATIONALIST, AT BANGLADESH ECONOMICS OLYMPIAD", org: "", year: "2024", id: "04", color: "from-orange-500/20 to-transparent" }
          ].map((award, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative flex-1 hover:flex-[3] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] bg-black border border-white/5 overflow-hidden flex flex-col justify-end p-4 md:p-8"
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-t ${award.color} opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
              
              {/* Vertical Scanning Line */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-full bg-white/5 group-hover:bg-neon/50 transition-colors duration-500">
                <motion.div 
                  animate={{ top: ["0%", "100%"] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: i * 0.5 }}
                  className="absolute top-0 left-[-1px] w-[3px] h-16 bg-neon shadow-[0_0_10px_var(--color-neon)] opacity-0 group-hover:opacity-100"
                />
              </div>

              {/* Content Container */}
              <div className="relative z-10 flex flex-col h-full justify-between group-hover:items-start items-center transition-all duration-500">
                
                {/* Top ID */}
                <div className="text-2xl md:text-4xl font-display text-white/10 group-hover:text-neon transition-colors duration-500">
                  {award.id}
                </div>

                {/* Vertical Text (Default State) */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-180 [writing-mode:vertical-lr] text-[10px] md:text-xs font-mono tracking-[0.3em] text-white/40 uppercase group-hover:opacity-0 transition-opacity duration-300 whitespace-nowrap">
                  {award.org} — {award.year}
                </div>

                {/* Expanded Content (Hover State) */}
                <div className="opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-8 group-hover:translate-y-0 delay-100 w-full">
                  <div className="w-12 h-[1px] bg-neon mb-6" />
                  <div className="text-[10px] font-mono text-neon mb-2">{award.year}</div>
                  <h3 className="text-xl md:text-5xl font-display uppercase leading-[0.9] tracking-tighter mb-4">
                    {award.title}
                  </h3>
                  <div className="text-[10px] md:text-xs font-mono text-white/60 uppercase tracking-widest">
                    {award.org}
                  </div>
                </div>
              </div>

              {/* Hover Overlay Texture */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-1 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />

      {/* Contact Section */}
      <section id="connect" className="py-24 md:py-48 px-4 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
          <FadeIn>
            <div className="space-y-12">
              <h2 className="text-5xl md:text-9xl font-display uppercase tracking-tighter leading-none">
                Let's <br /> <span className="text-neon">Build.</span>
              </h2>
              <p className="text-base md:text-2xl font-light text-white/40 max-w-md">
                Available for high-impact collaborations and architectural challenges.
              </p>
            </div>
          </FadeIn>
          
          <div className="flex flex-col gap-6">
            {[
              { label: "FACEBOOK", value: "MUSTAKIM SAWOD", icon: Facebook, link: "https://www.facebook.com/profile.php?id=100091273141644" },
              { label: "LINKEDIN", value: "Mustakim Sawod", icon: Linkedin, link: "https://www.linkedin.com/in/mustakim-sawod-874516374/?skipRedirect=true" },
              { label: "GITHUB", value: "mustakim-dev", icon: Github, link: "https://github.com/mustakim-1" }
            ].map((link, i) => (
              <FadeIn key={link.label} delay={i * 0.1}>
                <a href={link.link} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between glass p-6 md:p-10 rounded-3xl hover:border-neon transition-all duration-500 h-full">
                  <div className="space-y-2">
                    <div className="text-[10px] font-mono tracking-[0.3em] text-neon uppercase">{link.label}</div>
                    <div className="text-lg md:text-2xl font-display uppercase tracking-tighter group-hover:text-neon transition-colors">{link.value}</div>
                  </div>
                  <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-neon group-hover:text-black transition-all duration-500 shrink-0 ml-4">
                    <link.icon size={20} />
                  </div>
                </a>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-mono tracking-[0.5em] text-white/20 uppercase">
        <div className="flex items-center gap-4">
          <div className="w-2 h-2 bg-neon rounded-full animate-pulse" />
          <span>© 2026 MUSTAKIM SAWOD — System Architect</span>
        </div>
        <div className="flex gap-12">
          <span>23.8103° N, 90.4125° E</span>
          <span className="text-neon">Status: Kinetic</span>
        </div>
      </footer>
    </div>
  );
}
