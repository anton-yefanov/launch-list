import { ReactNode } from "react";
import { LayoutHeader } from "@/app/(with-header)/_components/layout-header";

export default function LayoutWithHeader({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <LayoutHeader />
      {children}
    </>
  );
}
