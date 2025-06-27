"use client";

import { Directory } from "@/components/directory";
import { Checkbox } from "@/components/ui/checkbox";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import ConfettiExplosion from "react-confetti-explosion";

export default function MyLaunchListPage() {
  const [isLaunched, setIsLaunched] = useState(false);
  const [isExploding, setIsExploding] = useState(false);

  const LaunchedButton = useMemo(() => {
    return (
      <div className="relative">
        <Button
          className={`active:scale-95 transition-all duration-100 items-center ${
            isLaunched
              ? "bg-green-600 hover:bg-green-600/80"
              : "bg-primary-color hover:bg-primary-color/90"
          }`}
          variant="outline"
          onClick={() => {
            setIsExploding(!isLaunched);
            setIsLaunched(!isLaunched);
          }}
        >
          {/* Use a visual indicator instead of actual Checkbox component */}
          <div
            className={`w-4 h-4 rounded border-2 border-white bg-white flex items-center justify-center ${
              isLaunched ? "bg-white" : "bg-transparent"
            }`}
          >
            {isLaunched && (
              <svg
                className="w-3 h-3 text-primary-color"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
          <div className="text-white">Launched!</div>
        </Button>
        {isExploding && <ConfettiExplosion className="absolute top-0 left-0" />}
      </div>
    );
  }, [isExploding, isLaunched]);

  return (
    <div>
      <h1 className="font-semibold text-2xl">
        Dont forget to launch everywhere!
      </h1>
      <div className="mb-4">Check directories you launched on</div>
      <div className="flex flex-col gap-2">
        <Directory
          title="Product Hunt"
          bgColor="bg-orange-600"
          buttonComponent={LaunchedButton}
        />
      </div>
    </div>
  );
}
