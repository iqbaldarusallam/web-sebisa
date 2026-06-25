"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  videoUrl: string;
  children: (thumbnailUrl: string) => React.ReactNode;
};

export default function VideoThumbnail({ videoUrl, children }: Props) {
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    const video = document.createElement("video");
    video.crossOrigin = "anonymous";
    video.muted = true;
    video.preload = "auto";
    video.playsInline = true;
    video.src = videoUrl;

    function captureFrame() {
      if (cancelled) return;
      try {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 360;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
          if (!cancelled) {
            setThumbnail(dataUrl);
          }
        }
      } catch {
        // CORS or other error - silently fail
      }
      video.remove();
    }

    function handleSeeked() {
      captureFrame();
    }

    function handleLoadedData() {
      try {
        video.currentTime = Math.min(1, video.duration * 0.1);
      } catch {
        captureFrame();
      }
    }

    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("seeked", handleSeeked);
    video.addEventListener("error", () => video.remove(), { once: true });

    return () => {
      cancelled = true;
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("seeked", handleSeeked);
      video.remove();
    };
  }, [videoUrl]);

  if (thumbnail) {
    return <>{children(thumbnail)}</>;
  }

  return null;
}
