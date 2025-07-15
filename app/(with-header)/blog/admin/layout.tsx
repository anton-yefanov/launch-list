import { redirect } from "next/navigation";
import { auth } from "@/auth";
import React from "react";

export default async function AdminLayout({
  children,
}: {
  children: React.PropsWithChildren;
}) {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  return <>{children}</>;
}
