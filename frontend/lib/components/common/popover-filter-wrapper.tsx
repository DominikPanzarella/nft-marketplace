"use client";

import type { PopoverProps } from "@heroui/react";

import React from "react";
import { Button, Divider, Popover, PopoverContent, PopoverTrigger, useDisclosure } from "@heroui/react";
import { ChevronDownIcon } from "lucide-react";

import { filterStyles } from "./filter&sort/filters-desktop";

import { cn } from "@/lib/utils";

export type PopoverFilterWrapperProps = Omit<PopoverProps, "children"> & {
  title?: string;
  children: React.ReactNode;
  className?: string;
};

const PopoverFilterWrapper = React.forwardRef<HTMLDivElement, PopoverFilterWrapperProps>(
  ({ title, children, ...props }, ref) => {
    const { isOpen, onOpenChange } = useDisclosure();
    const { buttonText } = filterStyles();

    return (
      <Popover ref={ref} isOpen={isOpen} onOpenChange={onOpenChange} {...props}>
        <PopoverTrigger>
          <Button
            className={cn("border-1", props.className)}
            color="secondary"
            endContent={<ChevronDownIcon className="h-4 w-4" />}
            variant="bordered"
          >
            <span className={buttonText()}>{title}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="flex max-w-xs flex-col items-start gap-2 px-4 pt-4">
          <span className="mb-2 text-medium font-medium text-default-600">{title}</span>
          <div className="w-full px-2">{children}</div>
          <Divider className="mt-3 bg-default-100" />
          {/* <div className="flex w-full justify-end gap-2 py-2">
            <Button size="sm" variant="flat" onPress={onClose}>
              Cancel
            </Button>
            <Button color="primary" size="sm" variant="flat" onPress={onClose}>
              Apply
            </Button>
          </div> */}
        </PopoverContent>
      </Popover>
    );
  }
);

PopoverFilterWrapper.displayName = "PopoverFilterWrapper";

export default PopoverFilterWrapper;
