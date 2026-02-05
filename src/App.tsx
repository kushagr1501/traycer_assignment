import { useState } from 'react';
import { TraycerApp } from './components/TraycerApp';
import { LandingPage } from './components/LandingPage';
import { AnimatePresence, motion } from 'framer-motion';
import { SmoothCursor } from "@/components/ui/smooth-cursor"
function App() {
  const [showLanding, setShowLanding] = useState(true);

  return (
    <div className="relative w-full min-h-screen bg-black overflow-hidden">
      <div className="absolute inset-0 z-0">
        <TraycerApp />
      </div>

      <AnimatePresence>
        {showLanding && (
          <motion.div
            key="landing"
            className="absolute inset-0 z-50"
            initial={{ opacity: 1 }}
            exit={{
              opacity: 0,
              y: -50,
              pointerEvents: 'none',
              transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
            }}
          >
            <LandingPage onEnter={() => setShowLanding(false)} />
            <SmoothCursor />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
