import React, {useRef, useLayoutEffect, useState} from "react";
import styles from "./ProgressBar.module.scss";

interface ProgressBarProps {
    steps: string[];
    currentStep: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({steps, currentStep}) => {
    const totalSteps = steps.length;

    const clampedStep = Math.min(Math.max(currentStep, 0), totalSteps - 1);

    const [progressFraction, setProgressFraction] = useState(0);

    const barRef = useRef<HTMLDivElement>(null);
    const [trackDims, setTrackDims] = useState<{ left: number; width: number }>({
        left: 0,
        width: 0,
    });

    useLayoutEffect(() => {
        const update = () => {
            const bar = barRef.current;
            if (!bar) return;

            const circles = bar.querySelectorAll<HTMLElement>(`.${styles.circle}`);
            if (circles.length < 1) return;

            const first = circles[0].getBoundingClientRect();
            const last = circles[circles.length - 1].getBoundingClientRect();
            const barRect = bar.getBoundingClientRect();

            const left = first.left + first.width / 2 - barRect.left;
            const width = last.left + last.width / 2 - barRect.left - left;

            // Compute fraction based on actual geometry
            const centers = Array.from(circles).map((el) => {
                const r = el.getBoundingClientRect();
                return r.left + r.width / 2 - barRect.left;
            });
            const firstCenter = centers[0];
            const lastCenter = centers[centers.length - 1];
            const currentCenter = centers[clampedStep];
            const fraction =
                lastCenter - firstCenter > 0
                    ? (currentCenter - firstCenter) / (lastCenter - firstCenter)
                    : 0;

            setTrackDims({left, width});
            setProgressFraction(fraction);
        };

        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, [steps, clampedStep]);

    return (
        <div
            className={styles.progressBar}
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={totalSteps - 1}
            aria-valuenow={clampedStep}
            ref={barRef}
        >
            <div
                className={styles.progressTrack}
                style={{left: trackDims.left, width: trackDims.width}}
            />

            <div
                className={styles.progressLine}
                style={{
                    '--progress-left': `${trackDims.left}px`,
                    '--progress-width': `${trackDims.width}px`,
                    '--progress-scale': progressFraction,
                } as React.CSSProperties}
            />
            {steps.map((label, index) => (
                <div
                    className={`${styles.step} ${
                        index < clampedStep ? styles.completed : ""
                    } ${index === clampedStep ? styles.active : ""}`}
                    aria-current={index === clampedStep ? "step" : undefined}
                    key={label}
                >
                    <div className={styles.circle}/>
                    <p className={styles.label}>{label}</p>
                </div>
            ))}
        </div>
    );
};

export default React.memo(ProgressBar);
