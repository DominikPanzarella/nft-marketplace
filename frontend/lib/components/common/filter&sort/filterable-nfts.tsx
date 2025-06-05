"use client";

import { FiltersDesktop } from "./filters-desktop";
import React, { Suspense, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMarketItemWithMetadata } from "@/lib/api/marketplace";
import { useAuth } from "@/components/AuthProvider";
import { parseAsJson, parseAsString, useQueryState } from "nuqs";
import { defaultFilterSort, filterKeys } from "@/lib/url-keys";
import SearchInput from "@/lib/components/common/search-input";
import { HeroSecondary } from "@/lib/components/common/hero-secondary";
import { ethers } from "ethers";
import { searchInObject } from "@/lib/utils";
import { Nft } from "@/lib/api/nft";

type ChildProps = {
  data?: Nft[];
  isLoading?: boolean;
  error?: unknown;
};

const FilterableNfts = ({
  children,
  filterTitle,
}: {
  children: React.ReactElement<ChildProps>;
  filterTitle: string;
}) => {
  const [sort] = useQueryState(filterKeys.sort, parseAsString.withDefault(defaultFilterSort));
  const [querySearchTerm, setQuerySearchTerm] = useQueryState(filterKeys.searchTerm);
  const [filters] = useQueryState(
    filterKeys.filters,
    parseAsJson<Record<string, any>>((value) => value as Record<string, any>).withDefault({})
  );

  const { signer } = useAuth();

  const searchFilter = (item: Nft) => !querySearchTerm || searchInObject(item, querySearchTerm.toLowerCase());

  const priceFilter = (item: Nft) => {
    if (!filters?.price?.length || filters.price.length !== 2) return true;

    try {
      const formattedPrice = ethers.formatEther(item.marketPlace?.price || 0);
      const itemPrice = Number(formattedPrice);
      return itemPrice >= filters.price[0] && itemPrice <= filters.price[1];
    } catch {
      return false;
    }
  };

  const statusFilter = (item: Nft) => {
    if (!filters?.status?.length || filters.status.length === 2) return true;

    const isListed = Boolean(item.marketPlace?.list);
    return filters.status.includes("listed") ? isListed : !isListed;
  };

  const sortFunctions = {
    price_low_to_high: (a: Nft, b: Nft) => {
      try {
        return (
          Number(ethers.formatEther(a.marketPlace?.price || 0)) - Number(ethers.formatEther(b.marketPlace?.price || 0))
        );
      } catch {
        return 0;
      }
    },
    price_high_to_low: (a: Nft, b: Nft) => {
      try {
        return (
          Number(ethers.formatEther(b.marketPlace?.price || 0)) - Number(ethers.formatEther(a.marketPlace?.price || 0))
        );
      } catch {
        return 0;
      }
    },
  };

  //fixme generalize this
  const {
    data: marketItems = [],
    error,
    isLoading,
  } = useQuery({
    queryKey: ["marketItems"],
    queryFn: async () => await getMarketItemWithMetadata(signer),
    enabled: !!signer,
    refetchInterval: 5000,
    staleTime: 0,
  });

  const filteredAndSortedItems = useMemo(() => {
    if (!marketItems) return [];

    return marketItems
      .filter(searchFilter)
      .filter(priceFilter)
      .filter(statusFilter)
      .sort(sortFunctions?.[sort as "price_high_to_low" | "price_low_to_high"] || (() => 0));
  }, [marketItems, querySearchTerm, filters, sort]);

  return (
    <>
      <HeroSecondary subtitle="Find your perfect NFT!" title="Browse NFT">
        <Suspense>
          <SearchInput size="lg" onChange={setQuerySearchTerm} value={querySearchTerm} />
        </Suspense>
      </HeroSecondary>
      <div className="relative px-6 py-10 xl:px-0">
        <FiltersDesktop filterTitle={filterTitle} />
        {React.cloneElement(children, {
          data: filteredAndSortedItems,
          isLoading,
          error,
        })}
      </div>
    </>
  );
};

export default FilterableNfts;
