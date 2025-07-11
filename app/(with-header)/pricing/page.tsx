import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function PricingPage() {
  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold mb-2">
            Advertise on Launch List
          </h1>
          <h2>Get your product in front of Launch List visitors</h2>
        </div>
        <Button
          size="lg"
          className="mt-4 active:scale-96 transition-all duration-100"
        >
          Get featured
        </Button>
      </div>
      <div className="mt-4 grid gap-2 grid-cols-1 sm:grid-cols-3">
        <Card title="Your product on the home page" imageSrc="/pricing/1.png" />
        <Card
          title="Your product on the websites page"
          imageSrc="/pricing/2.png"
        />
        <Card
          title="Your product on the launch list page"
          imageSrc="/pricing/3.png"
        />
      </div>
    </div>
  );
}

const Card = ({ title, imageSrc }: { title: string; imageSrc: string }) => {
  return (
    <div className="bg-gradient-to-br from-white to-sky-50 p-2 hover:scale-102 transition-all border border-sky-200 rounded-lg flex flex-col gap-2">
      <div className="text-center text-xs">{title}</div>
      <Image
        src={imageSrc}
        alt="logo"
        width={0}
        height={0}
        sizes="100vw"
        style={{ width: "100%", height: "auto", objectFit: "contain" }}
        draggable={false}
        className="rounded-md"
      />
    </div>
  );
};
