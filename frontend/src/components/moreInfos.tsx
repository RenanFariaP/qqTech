import { MethodInfos } from "@/types/infos/methodInfo";
import { ModuleInfos } from "@/types/infos/moduleInfos";
import { ProfileInfos } from "@/types/infos/profileInfos";
import { TransactionInfos } from "@/types/infos/transactionInfo";
import { UserInfos } from "@/types/infos/userInfos";
import React, { useEffect, useState } from "react";

export interface Item<T> {
  value: UserInfos | ProfileInfos | ModuleInfos | MethodInfos | TransactionInfos;
  label: string;
}

interface Props<T> {
  data: Item<T> | null;
  title: string;
  onDecline: () => void;
  isOpen: boolean;
  dataType: string;
}

const MoreInfosModal = <T,>({
  title,
  onDecline,
  isOpen,
  dataType,
  data,
}: Props<T>) => {
  const [isModalOpen, setIsModalOpen] = useState(isOpen);
  if(data){
    console.log(data.value)
  }

  const handleCancel = () => {
    setIsModalOpen(false);
    onDecline();
  };

  const handleUpdate = () => {
    setIsModalOpen(false);
    console.log(data)
    onDecline();
  };

  useEffect(() => {
    setIsModalOpen(isOpen);
  }, [isOpen]);

  const dataResponse = data;
  switch (dataType) {
    case 'usuário':
        
        break;
  
    default:
        break;
  }

  if (isModalOpen) {
    return (
      <div
        onClick={handleCancel}
        className="fixed top-0 bottom-0 left-0 right-0 bg-[rgba(0,0,0,0.7)] flex justify-center items-center"
      >
        <div className="w-80 h-96 rounded-md flex flex-col content-between bg-white">
          <h1 className="bg-[#418713] w-full h-14 [border-radius:6px_6px_0_0] text-white text-center content-center font-bold mb-5">
            {title}
          </h1>
          <p className="flex-1 text-center content-center p-10">
            
          </p>
          <div className="flex gap-5 justify-end m-5">
            <button
              className="bg-red-900 px-5 py-2 rounded-md text-white font-bold"
              onClick={handleCancel}
            >
              Cancelar
            </button>
            <button
              className="bg-green-900 px-5 py-2 rounded-md text-white font-bold"
              onClick={handleUpdate}
            >
              Alterar as informações
            </button>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default MoreInfosModal;
