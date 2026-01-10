import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // Status action variants
        accept: "bg-[hsl(142_76%_36%)] text-white hover:bg-[hsl(142_76%_30%)] shadow-sm",
        reject: "bg-[hsl(0_84%_60%)] text-white hover:bg-[hsl(0_84%_50%)] shadow-sm",
        ready: "bg-[hsl(32_95%_50%)] text-white hover:bg-[hsl(32_95%_44%)] shadow-sm",
        complete: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
        // PIN pad variants
        pin: "bg-card text-card-foreground border border-border hover:bg-accent hover:border-primary/30 text-xl font-semibold h-14 w-14 rounded-xl shadow-sm",
        pinAction: "bg-primary text-primary-foreground hover:bg-primary/90 text-xl font-semibold h-14 w-14 rounded-xl shadow-sm",
        pinDelete: "bg-destructive/10 text-destructive hover:bg-destructive/20 text-xl font-semibold h-14 w-14 rounded-xl",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-lg px-8",
        xl: "h-12 px-6 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
