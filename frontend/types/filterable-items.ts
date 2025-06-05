import { Filter, FilterTypeEnum } from "@/types/filter-types";

export const filterableTableItems: Filter[] = [
  {
    type: FilterTypeEnum.PriceRange,
    title: "Price",
    key: "price",
    range: {
      min: 0,
      defaultValue: [0, 100],
      max: 100,
      step: 0.1,
    },
  },
  {
    type: FilterTypeEnum.CheckboxGroup,
    title: "Status",
    key: "status",
    defaultOpen: false,
    className: "hidden lg:flex",
    options: [
      {
        title: "Listed",
        value: "listed",
      },
      {
        title: "Not Listed",
        value: "not-listed",
      },
    ],
  },
];
