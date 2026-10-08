import { Children } from "react";
import { cn } from "../../lib/utils";

/**
 * Children travel around a circular path, evenly spaced.
 * Pattern: Magic UI "Orbiting Circles" (MIT). Place inside a `relative` box;
 * the orbit is centred on it. Keyframes live in App.css (.ct-orbit).
 */
export function OrbitingCircles({
    children,
    radius = 100,
    duration = 24,
    reverse = false,
    iconSize = 34,
    path = true,
    className = "",
}) {
    const items = Children.toArray(children);

    return (
        <>
            {path && (
                <div
                    aria-hidden="true"
                    className="absolute left-1/2 top-1/2 rounded-full border border-dashed border-cyan-400/30"
                    style={{ width: radius * 2, height: radius * 2, marginLeft: -radius, marginTop: -radius }}
                />
            )}
            {items.map((child, i) => (
                <div
                    key={i}
                    className={cn(
                        "ct-orbit absolute left-1/2 top-1/2 flex items-center justify-center rounded-full border border-cyan-400/30 bg-black/70 backdrop-blur-sm",
                        className
                    )}
                    style={{
                        width: iconSize,
                        height: iconSize,
                        marginLeft: -iconSize / 2,
                        marginTop: -iconSize / 2,
                        "--radius": radius,
                        "--angle": (360 / items.length) * i,
                        "--duration": duration,
                        animationDirection: reverse ? "reverse" : "normal",
                    }}
                >
                    {child}
                </div>
            ))}
        </>
    );
}