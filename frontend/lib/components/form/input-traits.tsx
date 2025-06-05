import React, { useState } from "react";
import { Control, useFieldArray } from "react-hook-form";
import { Button, useDisclosure } from "@heroui/react";
import ModalComponent from "./modal-traits";

interface Trait {
  type: string;
  value: string;
}

interface InputTraitsProps {
  control: Control<any>;
  name: string;
  label?: string;
}

const InputTraits: React.FC<InputTraitsProps> = ({ control, name, label = "Traits" }) => {
  const { append } = useFieldArray({
    control,
    name,
  });

  const [newTrait, setNewTrait] = useState<Trait>({ type: "", value: "" });
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleAddTrait = () => {
    if (newTrait.type && newTrait.value) {
      append(newTrait);
      setNewTrait({ type: "", value: "" });
      onOpenChange();
    }
  };

  return (
    <div className="space-y-4">
      <Button className="flex items-center gap-2" onPress={onOpen} color="secondary">
        + Add trait
      </Button>

      {/* Pass the necessary props to the ModalComponent */}
      <ModalComponent
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        newTrait={newTrait}
        setNewTrait={setNewTrait}
        handleAddTrait={handleAddTrait}
        edit={false}
        editTrait={newTrait}
        handleSaveTrait={() => {}}
      />
    </div>
  );
};

export default InputTraits;
