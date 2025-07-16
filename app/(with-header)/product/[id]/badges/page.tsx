import { Code } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BadgesPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Explore badges</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <BadgeCard />
        <BadgeCard />
        <BadgeCard />
      </div>
    </div>
  );
}

const BadgeCard = () => {
  return (
    <div className="relative aspect-square border rounded-md py-10 grid place-items-center gap-6">
      {/*<a*/}
      {/*  href="https://startupfa.me/s/launch-list?utm_source=www.launch-list.org"*/}
      {/*  target="_blank"*/}
      {/*>*/}
      {/*  <img*/}
      {/*    src="https://startupfa.me/badges/featured-badge.webp"*/}
      {/*    alt="Featured on Startup Fame"*/}
      {/*    width="171"*/}
      {/*    height="54"*/}
      {/*  />*/}
      {/*</a>*/}
      <Button
        variant="ghost"
        className="bottom-2 absolute active:scale-95 transition-all duration-100"
      >
        <Code size={16} />
        Get badge
      </Button>
    </div>
  );
};
