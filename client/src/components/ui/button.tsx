import type React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@client/lib/utils";

const variants = cva("inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold", {
  variants: { variant: { default: "bg-primary text-white", ghost: "border border-border bg-white" } },
  defaultVariants: { variant: "default" }
});

export function Button({ className, variant, asChild, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof variants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(variants({ variant }), className)} {...props} />;
}
