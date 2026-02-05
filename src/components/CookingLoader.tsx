import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const LOADING_QUOTES = [
    "Traycer is cooking...",
    "Shipping straight fire...",
    "Manifesting your app...",
    "Deploying vibez...",
    "Any help? Visit traycer.ai",
    "It's giving productivity...",
    "No cap, this is gonna be huge...",
    "Doing the needful...",
    "Compiling rizz...",
    "Finna deploy...",
];

export function CookingLoader() {
    const [quoteIndex, setQuoteIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setQuoteIndex((prev) => (prev + 1) % LOADING_QUOTES.length);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full flex flex-col items-center justify-center py-20">

            <div className="mt-8 h-8 flex items-center justify-center relative w-full">
                <AnimatePresence mode="wait">
                    <motion.h3
                        key={quoteIndex}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="text-xl font-medium text-white text-center absolute"
                    >
                        {LOADING_QUOTES[quoteIndex]}
                    </motion.h3>
                </AnimatePresence>
            </div>
        </div>
    );
}
