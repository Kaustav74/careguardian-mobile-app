import type React from "react";
import { cn } from "@client/lib/utils";

export function Card(props: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={cn("rounded-lg border border-border bg-card p-4", props.className)} />;
}
