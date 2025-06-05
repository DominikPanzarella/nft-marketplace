import React from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Tooltip } from "@heroui/react";
import { DeleteIcon, EditIcon } from "../common/icons";

interface Trait {
  type: string;
  value: string;
}

interface TraitsTableProps {
  traits: Trait[];
  onEdit?: (index: number) => void;
  onDelete?: (index: number) => void;
}

const columns = [
  { name: "Key", uid: "type" },
  { name: "Value", uid: "value" },
  { name: "Action", uid: "action" },
];

const TraitsTable: React.FC<TraitsTableProps> = ({ traits, onEdit, onDelete }) => {
  const renderCell = React.useCallback(
    (trait: Trait, columnKey: string, index: number) => {
      const cellValue = trait[columnKey as keyof Trait];

      switch (columnKey) {
        case "type":
          return <span className="font-medium">{cellValue}</span>;

        case "value":
          return <span>{cellValue}</span>;

        case "action":
          return (
            <div className="flex items-center gap-2">
              <Tooltip content="Edit Trait">
                <span
                  className="cursor-pointer text-lg text-blue-500 active:opacity-50"
                  onClick={() => onEdit && onEdit(index)}
                >
                  <EditIcon />
                </span>
              </Tooltip>
              <Tooltip color="danger" content="Delete Trait">
                <span
                  className="cursor-pointer text-lg text-red-500 active:opacity-50"
                  onClick={() => onDelete && onDelete(index)}
                >
                  <DeleteIcon />
                </span>
              </Tooltip>
            </div>
          );

        default:
          return cellValue;
      }
    },
    [onEdit, onDelete]
  );

  return (
    <Table aria-label="NFT Traits Table">
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.uid}>{column.name}</TableColumn>}
      </TableHeader>
      <TableBody items={traits}>
        {(trait) => (
          <TableRow key={trait.type}>
            {columns.map((col) => (
              <TableCell key={col.uid}>{renderCell(trait, col.uid, traits.indexOf(trait))}</TableCell>
            ))}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default TraitsTable;
