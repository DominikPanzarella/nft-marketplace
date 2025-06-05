import { MagnifyingGlassIcon } from "@/lib/components/common/icons";
import { Input } from "@heroui/react";

const SearchInput = ({
  size = "md",
  onChange,
  value,
}: {
  size?: "sm" | "md" | "lg";
  onChange?: (value: string) => void;
  value?: string | null;
}) => {
  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <Input
        aria-label="Search"
        classNames={{
          input: "text-base font-archivo",
          inputWrapper: "bg-transparent rounded-large ring-1 border-none ring-secondary focus-within:ring-2",
        }}
        endContent={<MagnifyingGlassIcon />}
        value={value || ""}
        name="searchTerm"
        placeholder="Search for a NFT"
        size={size}
        type="search"
        variant="bordered"
        onChange={(e) => onChange?.(e.target.value)}
      />
    </form>
  );
};

export default SearchInput;
