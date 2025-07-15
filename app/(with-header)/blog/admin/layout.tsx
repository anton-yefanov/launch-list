import { redirect } from "next/navigation";
import { auth } from "@/auth";
import React, { ReactNode } from "react";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  return <>{children}</>;
}
