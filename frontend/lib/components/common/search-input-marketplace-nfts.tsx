"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Input } from "@heroui/input";
import { useQueryState } from "nuqs";
import { useSearchParams } from "next/navigation";

import { filterKeys } from "@/lib/url-keys";
import { MagnifyingGlassIcon } from "./icons";

export const SearchInputMarketplaceNfts = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
  const searchParams = useSearchParams();
  const [localTerm, setLocalTerm] = useState(() => searchParams.get(filterKeys.searchTerm) ?? "");

  const [, setQuerySearchTerm] = useQueryState(filterKeys.searchTerm);

  useEffect(() => {
    if (localTerm) {
      setQuerySearchTerm(localTerm);
    }
  }, []);

  const handleSearchChange = useCallback(
    (value: string) => {
      setLocalTerm(value);
      if (value) {
        setQuerySearchTerm(value);
      } else {
        setQuerySearchTerm(null);
      }
    },
    [setQuerySearchTerm]
  );

  return (
    <div>
      <Input
        aria-label="Search"
        classNames={{
          input: "text-base font-archivo",
          inputWrapper: "bg-transparent rounded-large ring-1 border-none ring-secondary focus-within:ring-2",
        }}
        endContent={<MagnifyingGlassIcon />}
        name="searchUserNftTerm"
        placeholder="Search for a Nft"
        size={size}
        type="search"
        value={localTerm}
        variant="bordered"
        onChange={(e) => handleSearchChange(e.target.value)}
      />
    </div>
  );
};
