import React from "react";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";

interface SubmitButtonProps {
  label?: string;
  isLoading?: boolean;
  disabled?: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ label = "Submit", isLoading = false, disabled = false }) => {
  return (
    <Button
      type="submit"
      disabled={disabled || isLoading}
      color="primary"
      className="w-full py-6 font-medium tracking-wide"
      size="lg"
      startContent={!isLoading && <Icon icon="lucide:rocket" width={18} />}
      endContent={!isLoading && <Icon icon="lucide:arrow-right" width={18} />}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <Icon icon="lucide:loader-2" className="animate-spin" width={18} />
          <span>Processing...</span>
        </div>
      ) : (
        label
      )}
    </Button>
  );
};

export default SubmitButton;
