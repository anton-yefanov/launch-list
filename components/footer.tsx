import Link from "next/link";

export const Footer = () => {
  return (
    <div className="text-sm flex gap-4 mt-5 justify-center">
      <Link href="/tos" className="hover:underline">
        Terms of Service
      </Link>
      <Link href="/privacy" className="hover:underline">
        Privacy policy
      </Link>
    </div>
  );
};
