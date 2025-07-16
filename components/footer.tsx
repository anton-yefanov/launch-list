import Link from "next/link";

export const Footer = () => {
  return (
    <div className="mt-12 flex flex-col justify-center items-center gap-4">
      <div className="flex items-center gap-2">
        <a href="https://www.uneed.best/tool/launch-list" target="_blank">
          <img
            src="https://www.uneed.best/POTD1.png"
            alt="Uneed POTD1 Badge"
            className="w-38"
          />
        </a>
        <a
          href="https://startupfa.me/s/launch-list?utm_source=www.launch-list.org"
          target="_blank"
        >
          <img
            src="https://startupfa.me/badges/featured-badge-small.webp"
            alt="Featured on Startup Fame"
            width="224"
            height="36"
          />
        </a>
      </div>
      <div className="text-sm flex gap-4  justify-center">
        <Link href="/tos" className="text-gray-600 hover:underline">
          Terms of Service
        </Link>
        <Link href="/privacy" className="text-gray-600 hover:underline">
          Privacy policy
        </Link>
        {/*<Link href="/blog" className="hover:underline">*/}
        {/*  Blog*/}
        {/*</Link>*/}
      </div>
    </div>
  );
};
