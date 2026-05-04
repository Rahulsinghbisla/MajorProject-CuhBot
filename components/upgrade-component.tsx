"use client";
import { Button } from "@/components/ui/button";
import { isUserHaveSubscription } from "@/http/polar";
import { authClient } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";

export function UpgradeComponent() {
  const { isPending, data } = useQuery({
    queryKey: ["customer_state"],
    queryFn: async () => {
      return isUserHaveSubscription();
    },
  });

  return (
    <>
      {!data && !isPending && (
        <div className="absolute left-1/2 -translate-x-1/2">
          <Button
            onClick={async () => {
              await authClient.checkout({
                slug: "pro",
              });
            }}
            variant="default"
            className="rounded-full bg-[#373669] border-[#3e3e4a] text-white hover:bg-[#373669]/60 text-[12px] h-8 px-4 font-medium"
          >
            ✦ Get Plus
          </Button>
        </div>
      )}
    </>
  );
}
