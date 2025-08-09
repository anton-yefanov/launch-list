"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const HeroBanner = () => {
  const { status } = useSession();
  const isAuth = status === "authenticated";

  // Typewriter animation state
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  const words = ["traffic", "backlink", "feedback"];

  useEffect(() => {
    let timeout: NodeJS.Timeout | undefined;

    const animate = () => {
      const currentWord = words[currentWordIndex];

      if (isDeleting) {
        // Deleting phase
        if (displayText.length > 0) {
          setDisplayText(currentWord.slice(0, displayText.length - 1));
          timeout = setTimeout(animate, 50); // Faster deletion
        } else {
          // Finished deleting, move to next word
          setIsDeleting(false);
          setIsTyping(true);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
        }
      } else {
        // Typing phase
        if (displayText.length < currentWord.length) {
          setDisplayText(currentWord.slice(0, displayText.length + 1));
          timeout = setTimeout(animate, 100); // Normal typing speed
        } else {
          // Finished typing, wait then start deleting
          setIsTyping(false);
          timeout = setTimeout(() => {
            setIsDeleting(true);
          }, 2000); // Pause before deleting
        }
      }
    };

    timeout = setTimeout(animate, isDeleting ? 50 : 100);

    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    return () => {
      if (timeout) clearTimeout(timeout);
      if (cursorInterval) clearInterval(cursorInterval);
    };
  }, [currentWordIndex, displayText, isDeleting, isTyping]);

  return (
    <div className="select-none rounded-2xl shadow-none text-center py-10 px-10 bg-gradient-to-b from-[#00449D] to-[#2FB2FF] relative overflow-hidden">
      {/* Dot pattern overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
          backgroundSize: "20px 20px",
        }}
      />

      {/* Content with relative positioning to appear above dots */}
      <div className="relative z-10">
        <Image
          src="/logo_clear.svg"
          alt="logo"
          width={50}
          height={50}
          draggable={false}
          className="rounded mx-auto mb-6"
        />
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
          Launch your Product Today
        </h1>
        <h2 className="text-lg sm:text-2xl font-bold text-white">
          Get free{" "}
          <span className="inline-block min-w-[85px] sm:min-w-[110px]">
            <span className="text-white">{displayText}</span>
            <span
              className={`inline-block w-0.5 h-4 bg-white ml-1 ${
                showCursor ? "opacity-100" : "opacity-0"
              } transition-opacity duration-200`}
            />
          </span>{" "}
          for Your Website
        </h2>
        <div className="w-full flex flex-col gap-3 mt-10 px-2 sm:px-34">
          <Button
            variant="outline"
            onClick={() => {
              window.location.href = isAuth ? "/submit/product" : "/login";
            }}
            className="cursor-pointer flex-1 hover:scale-102 transition-all duration-100 active:scale-98"
          >
            Submit to Launch List
            <Image
              src="/logo_clear.svg"
              alt="logo"
              width={20}
              height={20}
              draggable={false}
              className="rounded"
            />
          </Button>
          <Link
            href="/websites"
            className="text-sm hover:underline w-fit text-white mx-auto"
          >
            Explore launch websites
          </Link>
        </div>
      </div>
    </div>
  );
};
