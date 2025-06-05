import React from "react";
import { Controller, Control } from "react-hook-form";
import { Input } from "@heroui/react";
import { Icon } from "@iconify/react";

interface InputStringProps {
  control: Control<any>;
  name: string;
  label: string;
  rules?: object;
  type?: string;
}

const InputString: React.FC<InputStringProps> = ({
  control,
  name,
  label,
  type = "text",
  rules = { required: "This field is required." },
}) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { value, onChange, onBlur, ref }, fieldState: { invalid, error } }) => (
        <div className="relative">
          <Input
            required
            ref={ref}
            label={label}
            type={type}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            name={name}
            aria-invalid={invalid}
            placeholder={`Enter ${label.toLowerCase()}`}
            variant="bordered"
            color={invalid ? "danger" : "primary"}
            labelPlacement="outside"
            className="transition-all duration-200 hover:scale-[1.01]"
            startContent={
              name === "name" ? (
                <Icon icon="lucide:tag" className="text-default-400" width={18} />
              ) : name === "symbol" ? (
                <Icon icon="lucide:code" className="text-default-400" width={18} />
              ) : null
            }
            description={
              name === "name"
                ? "The name of your NFT collection"
                : name === "symbol"
                  ? "A short symbol for your token (e.g. BTC, ETH)"
                  : undefined
            }
            errorMessage={error?.message}
          />
          {invalid && (
            <div className="absolute right-2 top-8 text-danger">
              <Icon icon="lucide:alert-circle" width={18} />
            </div>
          )}
        </div>
      )}
    />
  );
};

export default InputString;
