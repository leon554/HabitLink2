import { useState, useEffect} from "react";

interface ProgressBarProps {
  min: number;
  max: number;
  current: number;
  height?: number;
}

export default function ProgressBar({ min, max, current, height }: ProgressBarProps) {
  const [animatedWidth, setAnimatedWidth] = useState(0);

  useEffect(() => {
    const targetWidth = (current / (max - min)) * 100;
    requestAnimationFrame(() => setAnimatedWidth(targetWidth));
  }, [current, max, min]);

  return (
    <div
      className={`dark:bg-progress-panel dark:outline-0 outline-1  rounded-full box-border flex items-center`}
      style={{ height: height ? `${height}px` : "12px" }}
    >
      <div
        className="dark:bg-highlight bg-highlight h-3 rounded-full ml-[-1px] transition-all duration-2000 ease-in-out"
        style={{
          width: `${animatedWidth}%`,
          height: height ? `${height}px` : "12px",
        }}
      />
    </div>
  );
}
