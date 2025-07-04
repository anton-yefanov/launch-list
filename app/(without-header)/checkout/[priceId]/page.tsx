"use client";

import { CheckoutHeader } from "@/components/checkout/checkout-header";
import { CheckoutContents } from "@/components/checkout/checkout-contents";

export default function CheckoutPage() {
  return (
    <div className="bg-background relative min-h-screen w-full overflow-hidden">
      <div className="relative mx-auto flex max-w-6xl flex-col justify-between gap-6 px-[16px] py-[24px] md:px-[32px]">
        <CheckoutHeader />
        <CheckoutContents />
      </div>
    </div>
  );
}
