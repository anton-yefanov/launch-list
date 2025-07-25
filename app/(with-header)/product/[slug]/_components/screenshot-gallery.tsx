"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

export interface Screenshot {
  id: string;
  url: string;
}

interface ScreenshotGalleryProps {
  screenshots: Screenshot[];
  startupName: string;
}

export default function ScreenshotGallery({
  screenshots,
  startupName,
}: ScreenshotGalleryProps) {
  const [selectedScreenshot, setSelectedScreenshot] = useState<string>(
    screenshots[0]?.url || "",
  );

  if (!screenshots || screenshots.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <div className="mb-4">
        <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
          <Image
            src={selectedScreenshot}
            alt={`${startupName} screenshot`}
            fill
            className="object-cover"
            draggable={false}
            priority={selectedScreenshot === screenshots[0]?.url}
          />
        </div>
      </div>

      {screenshots.length > 1 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {screenshots.map((screenshot, index) => (
            <div
              key={screenshot.id}
              className={cn(
                "relative aspect-video bg-gray-100 rounded cursor-pointer overflow-hidden border-2 transition-all",
                selectedScreenshot === screenshot.url
                  ? "border-primary-color"
                  : "border-transparent hover:border-gray-300",
              )}
              onClick={() => setSelectedScreenshot(screenshot.url)}
            >
              <Image
                src={screenshot.url}
                alt={`${startupName} screenshot ${index + 1}`}
                fill
                className="object-cover"
                draggable={false}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
