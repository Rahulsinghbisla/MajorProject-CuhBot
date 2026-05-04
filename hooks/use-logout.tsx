import { authClient } from "@/lib/auth-client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useLogout() {
  const router = useRouter();
  
  return useMutation({
    mutationFn: async () => {
      await authClient.signOut();
    },
    onSuccess: () => {
      router.push("/");
      router.refresh();
    },
    onError: () => {
      toast.error("Failed to logout. Please try again.");
    }
  });
}