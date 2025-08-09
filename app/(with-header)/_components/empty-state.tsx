import { useSession } from "next-auth/react";
import { Plus, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const EmptyState = () => {
  const { status } = useSession();
  const isAuth = status === "authenticated";

  return (
    <div className="flex flex-col justify-center items-center text-center py-10">
      <Rocket size={60} className="mb-4 text-gray-500" />
      <p className="mb-4 text-gray-500">No startups launching this week, yet</p>
      <Button
        variant="outline"
        onClick={() =>
          (window.location.href = isAuth ? "/submit/product" : "/login")
        }
        className={cn("active:scale-95 transition-all duration-100")}
      >
        <Plus />
        Be the first to launch!
      </Button>
    </div>
  );
};
