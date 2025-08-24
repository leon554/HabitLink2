import { useEffect, useState } from "react";
import { motion, useMotionValue, animate } from "framer-motion";

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  className?: string;
}

export function AnimatedNumber({ value, duration = 0.3, className }: AnimatedNumberProps) {
    const motionValue = useMotionValue(Math.abs(value - 10));
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        const controls = animate(motionValue, value, {
        duration,
        onUpdate: (v) => setDisplayValue(Math.round(v)),
        ease: "easeInOut", // easeInOut
        });

        return controls.stop;
    }, [value]);

    return <motion.span className={className}>{displayValue}</motion.span>;
}
