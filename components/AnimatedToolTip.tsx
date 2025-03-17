import React, { useState } from "react";
import {
  motion,
  useTransform,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "motion/react";

// Define the item type
interface Item {
  id: number;
  name: string;
  designation: string;
  image?: string;
}

// Define the component props
interface AnimatedToolTipProps {
  items: Item[];
  userId?: string;
}

const AnimatedToolTip: React.FC<AnimatedToolTipProps> = ({ items, userId }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const springConfig = { stiffness: 100, damping: 5 };
  const x = useMotionValue(0);
  const rotate = useSpring(
    useTransform(x, [-100, 100], [-45, 45]),
    springConfig,
  );
  const translateX = useSpring(
    useTransform(x, [-100, 100], [-50, 50]),
    springConfig,
  );
  
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const halfWidth = event.currentTarget.offsetWidth / 2;
    x.set(event.nativeEvent.offsetX - halfWidth);
  };
  
  return (
    <div className="flex flex-row items-center justify-center gap-2">
      {items.map((item) => (
        <div 
          key={item.id}
          className="relative group"
          onMouseEnter={() => setHoveredIndex(item.id)}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            {item.image ? (
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            ) : (
              <div className="text-xl font-bold text-gray-500">{item.name.charAt(0)}</div>
            )}
          </div>
          
          <AnimatePresence>
            {hoveredIndex === item.id && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.6 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.6 }}
                style={{
                  translateX: translateX,
                  rotate: rotate,
                }}
                className="absolute -top-16 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center"
              >
                <div className="px-4 py-2 bg-black text-white rounded-md shadow-xl">
                  <div className="font-bold text-center">{item.name}</div>
                  <div className="text-xs text-center">{item.designation}</div>
                </div>
                <div className="w-4 h-4 bg-black rotate-45 -mt-2 z-[-1]"></div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};

export default AnimatedToolTip;