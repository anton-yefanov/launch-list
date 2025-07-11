import { CheckoutEventsData } from "@paddle/paddle-js/types/checkout/events";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { formatMoney } from "@/utils/paddle/parse-money";

interface LoadingTextProps {
  value: number | undefined;
  currencyCode: string | undefined;
}

function LoadingText({ value, currencyCode }: LoadingTextProps) {
  if (value === undefined) {
    return <Skeleton className="h-[20px] w-[75px] bg-border" />;
  } else {
    return formatMoney(value, currencyCode);
  }
}

interface Props {
  checkoutData: CheckoutEventsData | null;
}

export function CheckoutLineItems({ checkoutData }: Props) {
  return (
    <>
      <div className="md:pt-12 text-base leading-[20px] font-medium">
        {checkoutData?.items[0].price_name}
      </div>
      <Separator className="bg-border/50 mt-2" />
      <div className="pt-2 flex justify-between">
        <span className="text-base leading-[20px] font-medium text-muted-foreground">
          Subtotal
        </span>
        <span className="text-base leading-[20px] font-semibold">
          <LoadingText
            currencyCode={checkoutData?.currency_code}
            value={checkoutData?.totals.subtotal}
          />
        </span>
      </div>
      <div className="pt-2 flex justify-between">
        <span className="text-base leading-[20px] font-medium text-muted-foreground">
          Tax
        </span>
        <span className="text-base leading-[20px] font-semibold">
          <LoadingText
            currencyCode={checkoutData?.currency_code}
            value={checkoutData?.totals.tax}
          />
        </span>
      </div>
      <Separator className="bg-border/50 mt-2" />
      <div className="pt-2 flex justify-between">
        <span className="text-base leading-[20px] font-medium text-muted-foreground">
          Due today
        </span>
        <span className="text-base leading-[20px] font-semibold">
          <LoadingText
            currencyCode={checkoutData?.currency_code}
            value={checkoutData?.totals.total}
          />
        </span>
      </div>
    </>
  );
}
