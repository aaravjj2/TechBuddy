"use client";

import * as Tooltip from "@radix-ui/react-tooltip";
import { cn } from "@/lib/cn";

export type TooltipLabelProps = {
  /** Short plain-language hint shown on hover/focus */
  content: string;
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  className?: string;
};

export function TooltipLabel({
  content,
  children,
  side = "top",
  className,
}: TooltipLabelProps) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          side={side}
          sideOffset={8}
          className={cn(
            "z-[100] max-w-xs rounded-senior bg-neutral-900 px-3 py-2 text-left text-senior-sm leading-snug text-white shadow-lg",
            className
          )}
        >
          {content}
          <Tooltip.Arrow className="fill-neutral-900" />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}
