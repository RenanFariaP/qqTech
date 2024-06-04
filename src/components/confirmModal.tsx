import React from "react";

interface Props {
  label: string;
  onConfirm: () => void;
  onDecline: () => void;
  isOpen: boolean;
  elementType: string;
  name: string;
}

const ConfirmModal = ({
  label,
  onConfirm,
  onDecline,
  isOpen,
  elementType,
  name,
}: Props) => {
  if (isOpen) {
    return (
      <div className="fixed top-0 bottom-0 left-0 right-0 bg-[rgba(0,0,0,0.7)]">
        <div className="w-auto h-auto p-10 rounded-md flex flex-col content-between">
          <h1 className="bg-[#418713] w-full h-10 [border-radius:6px_0_0_6px">Confirmação de exclusão</h1>
          <p className="flex-1">
            Deseja excluir o {elementType} "{name}"?
          </p>
          <div className="flex gap-10 justify-end">
            <button onClick={onDecline}>Cancelar</button>
            <button onClick={onConfirm}>Excluir</button>
          </div>
        </div>
      </div>
    );
  }
};

export default ConfirmModal;
