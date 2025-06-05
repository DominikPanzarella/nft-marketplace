import React from "react";
import { Select, SelectItem, Card } from "@heroui/react";
import { Controller, Control } from "react-hook-form";
import { Icon } from "@iconify/react";

interface SelectOption {
  key: string;
  value?: string;
  label?: string;
}

interface InputSelectProps {
  control: Control<any>;
  name: string;
  label: string;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  required?: boolean;
  description?: string;
}

const InputSelect: React.FC<InputSelectProps> = ({
  control,
  name,
  label,
  options,
  placeholder = "Select an option",
  required = false,
  description,
  className = "",
}) => {
  // Map of icons for different field names
  const iconMap: Record<string, string> = {
    category: "lucide:folder",
    status: "lucide:activity",
    priority: "lucide:flag",
    type: "lucide:layers",
    role: "lucide:users",
    country: "lucide:globe",
    language: "lucide:languages",
  };

  return (
    <Controller
      name={name}
      control={control}
      rules={{ required: required ? "This field is required" : false }}
      render={({ field, fieldState: { invalid, error } }) => (
        <Card shadow="sm" className={`mb-4 w-full bg-content1/50 ${className}`}>
          <div className="relative p-1">
            <Select
              {...field}
              label={label}
              placeholder={placeholder}
              isRequired={required}
              variant="flat"
              radius="sm"
              color={invalid ? "danger" : "primary"}
              labelPlacement="outside"
              classNames={{
                base: "group",
                trigger: "h-12",
                value: "text-base",
                label: "font-medium text-default-700",
                innerWrapper: "group-data-[has-value=true]:text-primary",
                listboxWrapper: "max-h-[400px]",
                listbox: "p-1 shadow-lg",
                triggerIcon: "text-default-500",
                selectorIcon: "text-default-500",
                errorMessage: "text-danger text-xs mt-1",
                description: "text-xs text-default-500 mt-1",
                mainWrapper: "w-full",
                trigger: [
                  "shadow-sm",
                  "bg-default-50",
                  "data-[hover=true]:bg-default-100",
                  "group-data-[focus=true]:bg-default-100",
                  "!transition-all",
                  "!duration-300",
                  "!ease-in-out",
                ],
              }}
              startContent={
                iconMap[name] ? (
                  <Icon
                    icon={iconMap[name]}
                    className="text-default-500 group-data-[open=true]:text-primary"
                    width={20}
                  />
                ) : undefined
              }
              description={description}
              errorMessage={invalid ? error?.message : undefined}
            >
              {options.map((option) => (
                <SelectItem
                  key={option.key}
                  value={option.value || option.key}
                  className="data-[selected=true]:bg-primary-100 data-[selected=true]:text-primary"
                >
                  {option.label || option.value || option.key}
                </SelectItem>
              ))}
            </Select>
          </div>
        </Card>
      )}
    />
  );
};

export default InputSelect;
