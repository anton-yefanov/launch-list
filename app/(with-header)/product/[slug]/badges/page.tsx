import { Code, ArrowDownToLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function BadgesPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Explore badges</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <BadgeCard imageSrc="/badges/png/launch_list_badge_1_product_of_the_week.png" />
        <BadgeCard imageSrc="/badges/png/launch_list_badge_2_product_of_the_week.png" />
        <BadgeCard imageSrc="/badges/png/launch_list_badge_3_product_of_the_week.png" />
      </div>
    </div>
  );
}

const BadgeCard = ({ imageSrc }: { imageSrc: string }) => {
  return (
    <div className="relative aspect-square border rounded-md py-10 px-2 grid place-items-center gap-6">
      <Image src={imageSrc} alt={imageSrc} width={580} height={165} />
      <Button
        variant="ghost"
        className="bottom-2 absolute active:scale-95 transition-all duration-100"
      >
        <Code size={16} />
        Copy code
      </Button>
      <div className="flex gap-2 w-full">
        <Button variant="outline">
          <ArrowDownToLine />
          SVG
        </Button>
        <Button variant="outline">
          <ArrowDownToLine />
          PNG
        </Button>
      </div>
    </div>
  );
};
