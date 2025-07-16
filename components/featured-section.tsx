import Image from "next/image";

export const FeaturedSection = () => {
  return (
    <div className="pb-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
      <FeaturedWebsite
        title="Launch List"
        description="Don't forget to launch everywhere!"
        logoSrc="/logo.png"
      />
      <FeaturedWebsite
        title="Your product name"
        description="Your product description"
        logoSrc="/placeholder.png"
      />
    </div>
  );
};

const FeaturedWebsite = ({
  logoSrc,
  title,
  description,
}: {
  logoSrc: string;
  title: string;
  description: string;
}) => {
  return (
    <div className="cursor-pointer flex gap-2 p-2 border rounded-lg relative hover:bg-sky-100 hover:border-sky-500 active:scale-99 transition-all duration-100 select-none">
      <Image
        src={logoSrc}
        alt="star"
        width={80}
        height={80}
        draggable={false}
        className="select-none rounded-lg"
      />
      <div>
        <div className="font-semibold text-lg">{title}</div>
        <div>{description}</div>
      </div>
      <div className="text-[10px] absolute right-2 bg-sky-100 text-sky-800 px-1 rounded">
        Featured
      </div>
    </div>
  );
};
