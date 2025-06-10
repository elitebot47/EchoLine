import { cn } from "@/lib/utils";
import { Check, CheckCheck, Clock } from "lucide-react";

type StatusType = "SENDING" | "SENT" | "DELIVERED" | "READ";

export function MessageStatus({
  status,
  className,
}: {
  status: StatusType;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "ml-1.5 inline-flex items-center",
        status === "READ" ? "text-blue-500" : "text-muted-foreground",
        className
      )}
    >
      {status === "SENDING" && <Clock className="w-3 h-3 animate-pulse" />}
      {status === "SENT" && <Check className="w-3 h-3" />}
      {status === "DELIVERED" && (
        <span className="flex">
          <Check className="w-3 h-3" />
          <Check className="w-3 h-3 -ml-1" />
        </span>
      )}
      {status === "READ" && (
        <span className="flex">
          <CheckCheck className="w-3 h-3" />
          <CheckCheck className="w-3 h-3 -ml-1" />
        </span>
      )}
    </span>
  );
}
