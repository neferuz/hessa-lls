"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./Preloader.module.css";

export default function Preloader() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Track session storage so preloader only shows once per session 
        // Commented out to ensure it shows during testing
        /*
        const hasLoaded = sessionStorage.getItem("hessa_loaded");
        if (hasLoaded) {
            setLoading(false);
            return;
        }
        */

        const timer = setTimeout(() => {
            setLoading(false);
            // sessionStorage.setItem("hessa_loaded", "true");
        }, 2200);

        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence>
            {loading && (
                <motion.div
                    key="preloader"
                    className={styles.preloader}
                    initial={{ opacity: 1 }}
                    exit={{ 
                        y: "-100%", 
                        transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } 
                    }}
                >
                    <div className={styles.loaderBg} />
                    <div className={styles.loaderContent}>
                        <div className={styles.premiumOrbit}>
                            <motion.div 
                                className={styles.orbitRing}
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                            />
                            <motion.div 
                                className={styles.orbitPulse}
                                animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
                                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                            />
                            <div className={styles.logoWrapper}>
                                <div className={styles.loaderLogo}>HESSA</div>
                            </div>
                        </div>
                        <div className={styles.loaderProgressWrap}>
                            <div className={styles.loaderBar} />
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
