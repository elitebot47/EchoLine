import { cn } from "@/lib/utils"; // Your classname utility
import { Loader2 } from "lucide-react";

interface SpinnerProps extends React.ComponentPropsWithoutRef<typeof Loader2> {
  size?: "sm" | "md" | "lg";
  label?: string;
}

export default function Spinner({
  className,
  size = "md",
  label = "Loading...",
  ...props
}: SpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  return (
    <div
      role="status"
      aria-label={label}
      className="inline-flex items-center gap-2"
    >
      <Loader2
        className={cn(
          " animate-spin text-muted-foreground",
          sizeClasses[size],
          className
        )}
        {...props}
      />
      {label && <span className="sr-only">{label}</span>}
    </div>
  );
}
