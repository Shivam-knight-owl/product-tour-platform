"use client";

interface VideoPlayerProps {
  src: string;
  className?: string;
}

export function VideoPlayer({ src, className = "" }: VideoPlayerProps) {
  return (
    <div className={className}>
      <video
        src={src}
        controls
        className="w-full h-full rounded-lg"
        playsInline
      />
    </div>
  );
} 