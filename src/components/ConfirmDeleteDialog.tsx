import * as AlertDialog from "@radix-ui/react-alert-dialog";
import {
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Image from "next/image";
import deleteIcon from "@/assets/trash-outline.svg";

interface ConfirmDeleteDialogProps {
  item: any;
  onConfirm: (item: any) => void;
  itemName: string;
  description: string;
  additionalInfo?: string; // Hacer que additionalInfo sea opcional
}

const ConfirmDeleteDialog: React.FC<ConfirmDeleteDialogProps> = ({
  item,
  onConfirm,
  itemName,
  description,
  additionalInfo,
}) => {
  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    onConfirm(item);
    setOpen(false);
  };

  const formattedAdditionalInfo = additionalInfo
    ? additionalInfo.split("-").reverse().join("-")
    : null;

  return (
    <AlertDialog.Root open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <button className="p-2 bg-red-600 text-white rounded hover:bg-red-700">
          <Image src={deleteIcon} alt="Eliminar" className="w-5 h-5" />
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar Eliminación</AlertDialogTitle>
          <AlertDialogDescription>
            {description} {itemName}
            {formattedAdditionalInfo && ` para el ${formattedAdditionalInfo}`}?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button variant="destructive" onClick={handleConfirm}>
              Eliminar
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog.Root>
  );
};

export default ConfirmDeleteDialog;
