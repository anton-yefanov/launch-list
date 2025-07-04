import { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="pt-10 flex flex-col gap-10">
      <Link href="/launch" className="shrink-0 select-none">
        <Image
          src="/logo.png"
          alt="logo"
          width={50}
          height={50}
          draggable={false}
          className="rounded"
        />
      </Link>
      {children}
    </div>
  );
}
