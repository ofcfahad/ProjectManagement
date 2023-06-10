import React from 'react';
import { useState, useEffect, useContext } from 'react';
import { CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { ThemeContext } from '../../Contexts/ThemeContext';
import { themeColors } from '../../functions';

function ProgressBar({ progress, backgroundColor, borderRadius, trailColor, inprogressColor, padding, /* waitingColor, completedColor, inprogress, completed, waiting */ }: { progress: number, backgroundColor: string, borderRadius: number, trailColor: string, inprogressColor: string, padding: number }) {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  const { theme } = useContext(ThemeContext)
  const color = themeColors(theme, 'main')

  useEffect(() => {
    // Animate progress from 0 to the desired value
    const animationInterval = setInterval(() => {
      setAnimatedProgress((prevProgress) => {
        if (prevProgress >= progress) {
          clearInterval(animationInterval);
          return progress;
        }
        return prevProgress + 10;
      });
    }, 10);

    // Clean up animation interval when component unmounts
    return () => clearInterval(animationInterval);
  }, [progress]);



  return (
    <div className="relative h-full flex justify-center items-center">
      <div className={` w-[90%] rounded-full px-${padding} `}>
        <CircularProgressbarWithChildren
          value={animatedProgress}
          text={`${animatedProgress}%`}
          strokeWidth={3}
          styles={{
            root: {
              borderRadius: borderRadius
            },
            path: {
              stroke: inprogressColor,
              strokeLinecap: 'round',
              transition: 'stroke-dashoffset 0.5s ease 0s',
              transform: '',
              transformOrigin: 'center center',
            },
            trail: {
              stroke: trailColor,
              strokeLinecap: 'round',
              transform: '',
              transformOrigin: 'center center',
            },
            text: {
              fill: color,
              fontSize: '16px',
              fontFamily: 'alkatra',
            },
            background: {
              fill: 'transparent',
              stroke: backgroundColor,
              strokeWidth: 40,
            }
          }}
          background
          backgroundPadding={10}
        />

      </div>
    </div>
  );
}

export default ProgressBar;
