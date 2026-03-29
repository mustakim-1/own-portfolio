import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';

const navItems = [
  { name: 'HOME', id: 'home' },
  { name: 'ABOUT', id: 'identity' },
  { name: 'ACADEMIC', id: 'systems' },
  { name: 'VAULT', id: 'vault' },
  { name: 'LAB', id: 'lab' },
  { name: 'CONTACT', id: 'connect' },
];

export const Navbar = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const [clickEffect, setClickEffect] = useState(false);

  const { scrollY } = useScroll();
  
  // Scroll transformations for Monolith
  const height = useTransform(scrollY, [0, 200], ['140px', '70px']);
  
  // Dynamic text sizes to prevent overflow on mobile
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fontSize = useTransform(scrollY, [0, 200], isMobile ? ['3.5vw', '2.5vw'] : ['5vw', '3vw']); // Adjusted to fit all items
  const letterSpacing = useTransform(scrollY, [0, 200], ['-0.05em', '0em']);
  
  // Brutal Click Effect
  const handleNavClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setActiveTab(id);
    setClickEffect(true);
    setTimeout(() => setClickEffect(false), 300);
    
    const element = id === 'home' ? document.body : document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.div 
      className="fixed top-0 left-0 right-0 z-[100] flex justify-center overflow-hidden max-w-full"
      style={{ height }}
      animate={{ y: clickEffect ? 40 : 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
    >
        {/* The Monolith Slab */}
        <div className="relative w-full h-full bg-black flex items-center justify-between px-4 md:px-12 select-none border-b border-white/10 overflow-x-auto no-scrollbar gap-6 md:gap-0">
            
            {/* Background Cutout Layer Logic 
                The text needs to 'cut' through the black background to reveal the page behind.
                We achieve this by using mix-blend-mode: destination-out on the text.
                However, for this to work, the container must be isolated and have a white background behind the black layer?
                No, destination-out makes the source (text) transparent and cuts a hole in the destination (background).
                
                Correct Stacking Context:
                1. Root (Page Content)
                2. Navbar Container (isolation: isolate)
                   2a. Black Background (Layer)
                   2b. Text (mix-blend-mode: destination-out) -> This cuts hole in 2a.
            */}
            
            {/* We need an isolated group for the 'Cutout' effect to work without clearing the whole page */}
            <div className="absolute inset-0 isolate min-w-max md:min-w-0">
                {/* The Solid Black Slab */}
                <div className="absolute inset-0 bg-black" />

                {/* The 'Hole' Text (Hovered Items) */}
                <div className="absolute inset-0 flex items-center justify-between px-4 md:px-12 pointer-events-none gap-6 md:gap-0 min-w-max md:min-w-0">
                    {navItems.map((item) => (
                        <motion.span
                            key={`hole-${item.id}`}
                            style={{ 
                                fontSize,
                                letterSpacing
                            }}
                            className="font-display font-black leading-none transition-opacity duration-0"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: hoveredTab === item.id && activeTab !== item.id ? 1 : 0 }}
                        >
                            <span className="text-black" style={{ mixBlendMode: 'destination-out' }}>
                                {item.name}
                            </span>
                        </motion.span>
                    ))}
                </div>
            </div>

            {/* The Visible Text Layer (Active & Default State) */}
            <div className="relative z-20 w-full flex items-center justify-between pointer-events-none gap-6 md:gap-0 min-w-max md:min-w-0">
                {navItems.map((item) => {
                    const isActive = activeTab === item.id;
                    const isHovered = hoveredTab === item.id;

                    return (
                        <div 
                            key={item.id} 
                            className="relative flex items-center justify-center pointer-events-auto cursor-pointer group"
                            onMouseEnter={() => setHoveredTab(item.id)}
                            onMouseLeave={() => setHoveredTab(null)}
                            onClick={(e) => handleNavClick(e, item.id)}
                        >
                            <motion.span
                                style={{ 
                                    fontSize,
                                    letterSpacing
                                }}
                                className={`font-display font-black leading-none transition-all duration-200 ${
                                    isActive 
                                        ? 'text-white' // Active: Filled
                                        : isHovered 
                                            ? 'opacity-0' // Hover: Invisible (reveals hole underneath)
                                            : 'text-transparent' // Default: Stroke only
                                }`}
                                animate={{
                                    WebkitTextStroke: isActive || isHovered ? '0px' : '1px rgba(255,255,255,0.5)', // Default stroke
                                }}
                            >
                                {item.name}
                            </motion.span>
                        </div>
                    );
                })}
            </div>

        </div>
    </motion.div>
  );
};
