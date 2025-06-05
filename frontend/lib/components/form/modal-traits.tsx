import React, { FC } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@heroui/react";

interface Trait {
  type: string;
  value: string;
}

interface ModalComponentProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newTrait: Trait;
  setNewTrait: React.Dispatch<React.SetStateAction<Trait>>;
  handleAddTrait: () => void;
  handleSaveTrait: () => void;
  edit: boolean;
  editTrait: Trait;
}

const ModalComponent: FC<ModalComponentProps> = ({
  isOpen,
  onOpenChange,
  newTrait,
  setNewTrait,
  handleAddTrait,
  handleSaveTrait,
  edit,
  editTrait,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      classNames={{
        body: "py-6",
        backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
        base: "border-[#292f46] bg-[#19172c] dark:bg-[#19172c] text-[#a8b0d3]",
        header: "border-b-[1px] border-[#292f46]",
        footer: "border-t-[1px] border-[#292f46]",
        closeButton: "hover:bg-white/5 active:bg-white/10",
      }}
      radius="lg"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">{edit ? "Edit Trait" : "Add Trait"}</ModalHeader>
            <ModalBody className="space-y-4">
              <Input
                label="Trait Type"
                value={newTrait.type}
                onChange={(e) => setNewTrait({ ...newTrait, type: e.target.value })}
              />
              <Input
                label="Trait Value"
                value={newTrait.value}
                onChange={(e) => setNewTrait({ ...newTrait, value: e.target.value })}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button
                className="bg-[#6f4ef2] shadow-lg shadow-indigo-500/20"
                onPress={() => {
                  if (edit) {
                    handleSaveTrait(); // Save the edited trait
                  } else {
                    handleAddTrait(); // Add new trait
                  }
                  onClose();
                }}
              >
                {edit ? "Save Trait" : "Add Trait"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalComponent;
