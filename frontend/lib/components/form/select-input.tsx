import { Select, SelectItem, Avatar } from "@heroui/react";

const SelectInput = () => {
  return (
    <Select className="max-w-xs" label="Select country">
      <SelectItem
        key="argentina"
        startContent={<Avatar alt="Argentina" className="h-6 w-6" src="https://flagcdn.com/ar.svg" />}
      >
        Argentina
      </SelectItem>
      <SelectItem
        key="venezuela"
        startContent={<Avatar alt="Venezuela" className="h-6 w-6" src="https://flagcdn.com/ve.svg" />}
      >
        Venezuela
      </SelectItem>
      <SelectItem
        key="brazil"
        startContent={<Avatar alt="Brazil" className="h-6 w-6" src="https://flagcdn.com/br.svg" />}
      >
        Brazil
      </SelectItem>
      <SelectItem
        key="switzerland"
        startContent={<Avatar alt="Switzerland" className="h-6 w-6" src="https://flagcdn.com/ch.svg" />}
      >
        Switzerland
      </SelectItem>
      <SelectItem
        key="germany"
        startContent={<Avatar alt="Germany" className="h-6 w-6" src="https://flagcdn.com/de.svg" />}
      >
        Germany
      </SelectItem>
      <SelectItem
        key="spain"
        startContent={<Avatar alt="Spain" className="h-6 w-6" src="https://flagcdn.com/es.svg" />}
      >
        Spain
      </SelectItem>
      <SelectItem
        key="france"
        startContent={<Avatar alt="France" className="h-6 w-6" src="https://flagcdn.com/fr.svg" />}
      >
        France
      </SelectItem>
      <SelectItem
        key="italy"
        startContent={<Avatar alt="Italy" className="h-6 w-6" src="https://flagcdn.com/it.svg" />}
      >
        Italy
      </SelectItem>
      <SelectItem
        key="mexico"
        startContent={<Avatar alt="Mexico" className="h-6 w-6" src="https://flagcdn.com/mx.svg" />}
      >
        Mexico
      </SelectItem>
    </Select>
  );
};

export default SelectInput;
