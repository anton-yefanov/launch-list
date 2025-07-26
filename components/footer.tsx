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
          href="https://fazier.com/launches/www.launch-list.org"
          target="_blank"
        >
          <img
            src="https://fazier.com/api/v1//public/badges/launch_badges.svg?badge_type=launched&theme=light"
            width={120}
            alt="Fazier badge"
          />
        </a>
        <a href="https://yo.directory/" target="_blank">
          <img
            src="https://cdn.prod.website-files.com/65c1546fa73ea974db789e3d/65e1e171f89ebfa7bd0129ac_yodirectory-featured.png"
            alt="yo.directory"
            style={{ width: 150, height: 54 }}
            width="150"
            height="54"
          />
        </a>
      </div>
      <div className="text-sm flex gap-4  justify-center">
        <Link href="/blog" className="text-gray-600 hover:underline">
          Blog
        </Link>
        {/*<Link href="/tos" className="text-gray-600 hover:underline">*/}
        {/*  Terms of Service*/}
        {/*</Link>*/}
        {/*<Link href="/privacy" className="text-gray-600 hover:underline">*/}
        {/*  Privacy policy*/}
        {/*</Link>*/}
        {/*<Link href="/blog" className="hover:underline">*/}
        {/*  Blog*/}
        {/*</Link>*/}
      </div>
    </div>
  );
};
