import React, { useMemo } from "react";

export type SkeletonProps = React.SVGAttributes<SVGElement> & {
  gradientRatio?: number;
  interval?: number;
  speed?: number;
  title?: string;
};

export const SkeletonRectBase = () => <rect x="0" y="0" rx="3" ry="3" width="100%" height="15" />;

export const Skeleton: React.FC<SkeletonProps> = ({ children, gradientRatio = 2, interval = 0.15, speed = 2.75, title = "Loading...", ...props }) => {
  const fixedId = useMemo(() => Math.random().toFixed(36).substring(2, 16), []);
  const idClip = useMemo(() => `${fixedId}-diff`, [fixedId]);
  const idGradient = useMemo(() => `${fixedId}-animated-diff`, [fixedId]);
  const idAria = useMemo(() => `${fixedId}-aria`, [fixedId]);
  const keyTimes = useMemo(() => `0; ${interval}; 1`, [interval]);
  const duration = useMemo(() => `${speed}s`, [speed]);

  return (
    <svg {...props} aria-labelledby={idAria} role="img">
      <title id={idAria}>{title}</title>
      <rect role="presentation" x="0" y="0" width="100%" height="100%" clipPath={`url(#${idClip})`} style={{ fill: `url(#${idGradient})` }} />
      <defs role="presentation">
        <clipPath id={idClip}>{children}</clipPath>
        <linearGradient id={idGradient}>
          <stop offset="0%" className="to-stop-color">
            <animate
              attributeName="offset"
              values={`${-gradientRatio}; ${-gradientRatio}; 1`}
              keyTimes={keyTimes}
              dur={duration}
              repeatCount="indefinite"
            />
          </stop>
          <stop offset="50%" className="from-stop-color">
            <animate
              attributeName="offset"
              values={`${-gradientRatio / 2}; ${-gradientRatio / 2}; ${1 + gradientRatio / 2}`}
              keyTimes={keyTimes}
              dur={duration}
              repeatCount="indefinite"
            />
          </stop>
          <stop offset="100%" className="to-stop-color">
            <animate attributeName="offset" values={`0; 0; ${1 + gradientRatio}`} keyTimes={keyTimes} dur={duration} repeatCount="indefinite" />
          </stop>
        </linearGradient>
      </defs>
    </svg>
  );
};
