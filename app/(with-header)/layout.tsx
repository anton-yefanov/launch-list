import { ReactNode } from "react";
import { LayoutHeader } from "@/components/layout-header";

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
