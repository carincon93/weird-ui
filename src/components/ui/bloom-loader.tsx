import { cn } from "../../lib/utils"

interface BloomLoaderProps {
    className?: string
    size?: number
    gap?: number
    bloomBackgroundColor?: string
}

export function BloomLoader({ className, size = 5, gap = 3, bloomBackgroundColor = 'purple' }: BloomLoaderProps) {
    return (
        <div
            className={cn("bloom-loader", className)}
            style={{ "--bloom-size": `${size}px`, "--bloom-gap": `${gap}px`, "--bloom-color": bloomBackgroundColor } as React.CSSProperties}
            aria-label="Loading"
            role="status"
        >
            {[0, 1, 2, 3].map((i) => (
                <div key={i} className="bloom-square" style={{ "--bloom-index": i } as React.CSSProperties} />
            ))}
        </div>
    )
}
