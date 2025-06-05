import React from "react";
import { Controller, Control } from "react-hook-form";
import { Textarea, Card } from "@heroui/react";
import { Icon } from "@iconify/react";

interface TextAreaProps {
  control: Control<any>;
  name: string;
  label: string;
  rules?: object;
  placeholder?: string;
  rows?: number;
}

const TextArea: React.FC<TextAreaProps> = ({
  control,
  name,
  label,
  rules = { required: "This field is required." },
  placeholder = `Enter ${label.toLowerCase()}`,
  rows = 4,
}) => {
  // Map of icons for different field names
  const iconMap: Record<string, string> = {
    description: "lucide:file-text",
    bio: "lucide:user",
    notes: "lucide:clipboard",
    feedback: "lucide:message-square",
    details: "lucide:list",
  };

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { value, onChange, onBlur, ref }, fieldState: { invalid, error } }) => (
        <Card shadow="sm" className="mb-4 w-full bg-content1/50">
          <div className="relative p-1">
            <Textarea
              ref={ref}
              label={label}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              name={name}
              aria-invalid={invalid}
              placeholder={placeholder}
              variant="flat"
              color={invalid ? "danger" : "primary"}
              labelPlacement="outside"
              radius="sm"
              minRows={rows}
              classNames={{
                base: "group",
                label: "font-medium text-default-700",
                inputWrapper: [
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
                  <div className="flex items-start pt-2">
                    <Icon
                      icon={iconMap[name]}
                      className="text-default-500 group-data-[focus=true]:text-primary"
                      width={20}
                    />
                  </div>
                ) : undefined
              }
              errorMessage={error?.message}
            />
            {invalid && (
              <div className="absolute right-4 top-8 animate-pulse text-danger">
                <Icon icon="lucide:alert-circle" width={20} />
              </div>
            )}
          </div>
        </Card>
      )}
    />
  );
};

export default TextArea;
