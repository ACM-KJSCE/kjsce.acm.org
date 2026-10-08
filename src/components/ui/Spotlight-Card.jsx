import { useRef } from "react";
import { cn } from "../../lib/utils";

/**
 * Card with a soft light and a bright border that follow the cursor.
 * Pattern: Magic UI "Magic Card" (MIT). The pointer position is written to CSS
 * variables, so moving the mouse never re-renders React.
 * Styles live in App.css (.ct-spot, .ct-spot-border).
 */
export function SpotlightCard({ className = "", innerClassName = "", children, ...props }) {
    const ref = useRef(null);

    const onMove = (e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - r.left}px`);
        el.style.setProperty("--my", `${e.clientY - r.top}px`);
    };

    return (
        <div ref={ref} onMouseMove={onMove} className={cn("group relative overflow-hidden", className)} {...props}>
            <span
                aria-hidden="true"
                className="ct-spot pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />
            <span
                aria-hidden="true"
                className="ct-spot-border pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />
            <div className={cn("relative z-10", innerClassName)}>{children}</div>
        </div>
    );
}