import Link from "next/link";
import Image from "next/image";
import { Dot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Winner } from "@/app/(with-header)/page";

export const WinnerProduct = ({
  winner,
  showCup,
}: {
  winner: Winner;
  showCup: boolean;
}) => {
  return (
    <Link
      href={`/app/(with-header)/_components/product.tsx/${winner.slug}`}
      className="hover:bg-sidebar relative rounded-lg p-2.5 flex gap-4 select-none"
    >
      <div className="shrink-0">
        <Image
          src={winner.logo}
          alt={`${winner.name} logo`}
          width={50}
          height={50}
          draggable={false}
          className="rounded"
        />
      </div>
      <div className="flex flex-col">
        <div className="font-semibold">{winner.name}</div>
        <div>{winner.tagline}</div>
        <div className="flex text-xs items-center flex-wrap mt-1">
          <div>by {winner.submittedBy}</div>
          {winner.categories.map((category, index) => (
            <span key={index} className="flex">
              <Dot size={16} className="text-gray-300" />
              <span>{category}</span>
            </span>
          ))}
        </div>
      </div>
      {showCup && (
        <Image
          src={
            winner.place === 1
              ? "/golden_cup.png"
              : winner.place === 2
                ? "/silver_cup.png"
                : "/bronze_cup.png"
          }
          alt={`${winner.place} place cup`}
          width={30}
          height={30}
          draggable={false}
          className="rounded absolute -left-1 top-6 -rotate-10"
        />
      )}
      <Button
        variant="outline"
        className="size-12.5 ml-auto flex flex-col gap-0 hover:bg-background"
      >
        {winner.upvoterIds.length}
      </Button>
    </Link>
  );
};
