import React from "react";
import { Card } from "@heroui/react";
import { Icon } from "@iconify/react";

interface CreateCollectionButtonProps {
  onClick?: () => void;
  className?: string;
}

const DeployNewCollectionButton = ({ onClick, className = "" }: CreateCollectionButtonProps) => {
  return (
    <Card
      isPressable
      onPress={onClick}
      shadow="md"
      className={`mb-4 w-full max-w-3xl ${className} group overflow-hidden transition-transform duration-300 hover:scale-[1.02]`}
      classNames={{
        base: "border-1 border-default-200",
      }}
    >
      <div className="flex items-center gap-4 p-4 transition-colors">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-white">
          <Icon icon="lucide:plus" className="h-6 w-6" />
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-medium text-default-900 transition-colors group-hover:text-primary">
            Create a new collection
          </span>
          <span className="text-sm text-default-500">Deploy your NFT collection to the blockchain</span>
        </div>
        <div className="ml-auto">
          <Icon
            icon="lucide:chevron-right"
            className="h-5 w-5 text-default-400 transition-all duration-300 group-hover:translate-x-1 group-hover:text-primary"
          />
        </div>
      </div>
    </Card>
  );
};

export default DeployNewCollectionButton;
