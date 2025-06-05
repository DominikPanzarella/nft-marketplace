"use client";

import { Button } from "@heroui/button";
import { tv } from "tailwind-variants";
import { Checkbox, CheckboxGroup, Divider, Link, Select, SelectItem, Tab, Tabs } from "@heroui/react";
import { parseAsJson, parseAsString, useQueryState } from "nuqs";
import { X } from "lucide-react";

import PriceSlider from "../price-slider";
import { FilterIcon } from "../icons";
import { defaultFilterSort, filterKeys } from "@/lib/url-keys";
import { filterableTableItems } from "@/types/filterable-items";
import { FilterTypeEnum } from "@/types/filter-types";
import PopoverFilterWrapper from "../popover-filter-wrapper";

export const filterStyles = tv({
  slots: {
    container: "flex flex-col gap-2.5 mb-10",
    title: "text-[22px] sm:text-[28px] lg:text-[28px] leading-[30px] sm:leading-[39px] font-articulatDemiBold",
    buttonText: "text-[16px] font-archivo",
  },
});

export const FiltersDesktop = ({
  filterTitle,
  filterableTableItemsProp = filterableTableItems,
}: {
  filterTitle: string;
  filterableTableItemsProp?: typeof filterableTableItems;
}) => {
  const { container, title, buttonText } = filterStyles();
  const [sort, setSort] = useQueryState(filterKeys.sort, parseAsString.withDefault(defaultFilterSort));
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const [filters, setFilters] = useQueryState(filterKeys.filters, parseAsJson<Record<string, any>>().withDefault({}));

  const clearAllFilters = () => {
    setSort(defaultFilterSort);
    setFilters({});
  };

  const handleFilterChange = (filterKey: string, value: any) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterKey]: value,
    }));
  };

  const transformedFilters = Object.entries(filters).flatMap(([filterKey, values]) => {
    // Handle price range
    if (filterKey === "price" && Array.isArray(values)) {
      return [
        {
          filterKey,
          value: `ETH ${values[0]} - ETH ${values[1]}`,
        },
      ];
    }
    // Handle array values
    if (Array.isArray(values)) {
      return values.map((value) => ({ filterKey, value }));
    }
    // Handle string values

    return [{ filterKey, value: values }];
  });

  const handleDeleteFilterClick = (filterKeyToDelete: string, valueToDelete: string) => {
    setFilters((prevFilters) => {
      const newFilters = { ...prevFilters };
      const currentValue = newFilters[filterKeyToDelete];

      // Handle price filter
      if (filterKeyToDelete === "price") {
        delete newFilters[filterKeyToDelete];

        return newFilters;
      }

      // Handle array values
      if (Array.isArray(currentValue)) {
        const updatedValues = currentValue.filter((value: string) => value !== valueToDelete);

        if (updatedValues.length > 0) {
          newFilters[filterKeyToDelete] = updatedValues;
        } else {
          delete newFilters[filterKeyToDelete];
        }
      }
      // Handle string values
      else if (currentValue === valueToDelete) {
        delete newFilters[filterKeyToDelete];
      }

      return newFilters;
    });
  };

  return (
    <div className={container()}>
      <div className="flex items-center justify-between sm:mb-9">
        <h3 className={title({ class: "w-full" })}>{filterTitle}</h3>
        <Select
          aria-label="Sort by"
          classNames={{
            base: "items-center justify-end hidden sm:flex",
            label: "text-tiny whitespace-nowrap md:text-small",
            mainWrapper: "max-w-[207px]",
            trigger: "bg-transparent rounded-lg border-1 border-gray-700 focus:border-gray-900 focus:border-2",
            value: `${buttonText({ class: "text-secondary font-semibold" })}`,
            selectorIcon: "right-5",
          }}
          label="Sort by"
          labelPlacement="outside-left"
          placeholder="Select an option"
          selectedKeys={[sort]}
          variant="bordered"
          onChange={(e) => setSort(e.target.value)}
        >
          <SelectItem key="price_low_to_high">Price: Low to High</SelectItem>
          <SelectItem key="price_high_to_low">Price: High to Low</SelectItem>
        </Select>
      </div>
      <Button fullWidth className="w-full sm:hidden" radius="md" startContent={<FilterIcon />} variant="bordered">
        <div className={buttonText()}>Filter & Sort</div>
      </Button>

      <div className="hidden w-full flex-wrap items-center justify-start gap-2 sm:flex md:ml-0">
        {filterableTableItemsProp.map((filter) => (
          <PopoverFilterWrapper key={filter.title} className={filter.className} placement="bottom" title={filter.title}>
            {filter.type === FilterTypeEnum.CheckboxGroup && (
              <CheckboxGroup
                aria-label={`${filter.title} filter`}
                className="gap-1"
                orientation="horizontal"
                value={filters[filter.key]}
                onValueChange={(value) => handleFilterChange(filter.key, value)}
              >
                {filter.options?.map((option) => (
                  <Checkbox key={option.value} value={option.value}>
                    {option.title}
                  </Checkbox>
                ))}
              </CheckboxGroup>
            )}
            {filter.type === FilterTypeEnum.PriceRange && (
              <PriceSlider
                aria-label={filter.title}
                defaultValue={filters[filter.key] || filter.range?.defaultValue}
                formatOptions={{ style: "currency", currency: "ETH" }}
                range={filter.range}
                onChangeEnd={(value) => handleFilterChange(filter.key, value)}
              />
            )}
            {filter.type === FilterTypeEnum.Tabs && (
              <Tabs
                aria-label={filter.title}
                selectedKey={filters[filter.key] || filter.options?.[0].value}
                size="sm"
                title={filter.title}
                onSelectionChange={(value) => handleFilterChange(filter.key, value)}
              >
                {filter.options?.map((option) => <Tab key={option.value} title={option.title} />)}
              </Tabs>
            )}
          </PopoverFilterWrapper>
        ))}
      </div>
      <Divider className="my-1 hidden px-1 sm:block" />
      <div className="hidden flex-wrap items-center gap-4 px-1 sm:flex">
        {transformedFilters.map(({ filterKey, value }) => (
          <div key={`${filterKey}-${value}`}>
            <div className="rounded-lg border-1 border-secondary px-2 py-1">
              <div className="flex items-center gap-2">
                <div className="text-archivo text-base">{value.toUpperCase()}</div>
                <Button
                  isIconOnly
                  className="p-0"
                  size="sm"
                  variant="light"
                  onPress={() => handleDeleteFilterClick(filterKey, value)}
                >
                  <X />
                </Button>
              </div>
            </div>
          </div>
        ))}
        <div>
          {filters && Object.keys(filters).length > 0 && (
            <Link className="cursor-pointer py-2 text-secondary" underline="always" onPress={clearAllFilters}>
              Clear Filters
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
