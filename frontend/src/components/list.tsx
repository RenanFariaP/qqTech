import React, { useState, useEffect } from "react";
import Pagination from "./pagination";
import SearchInput from "./searchInput";
import IconButton, { Icon } from "./iconButton";
import ConfirmModal from "./confirmModal";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Notify } from "./toast";

const itemsPerPage = 7;

export interface ListColumn<T> {
  value: string;
}

export interface ListItem<T> {
  value: T;
  uniqueIdentifier: number;
  cols: ListColumn<T>[];
  label: string;
}

interface Props<T> {
  data: ListItem<T>[];
  onFilterChange: (value: string) => void;
  onDelete: (value: T) => void;
  listEntity: string;
  searchPlaceHolder: string;
  entityType: string;
}

const List = <T,>({
  data,
  onFilterChange,
  listEntity,
  onDelete,
  searchPlaceHolder,
  entityType,
}: Props<T>) => {
  const [selectedEntity, setSelectedEntity] = useState<ListItem<T> | null>(
    null
  );
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const {user} = useAuth();


  const handleSearchChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const handleDeleteConfirmation = (item: ListItem<T>) => {
    if(parseInt(user.userId) === item.uniqueIdentifier){
      Notify('error', "Não é possível fazer auto-exclusão!");
      return;
    }
    setIsDeleteModalOpen(true);
    setSelectedEntity(item);
  };

  const handleItemInfo = (item: ListItem<T>) => {
    router.push(`/dashboard/${entityType}/get/${item.uniqueIdentifier}`);
  };

  const handleDeleteModalCancel = () => {
    setSelectedEntity(null);
    setIsDeleteModalOpen(false);
  };

  const handleDeleteModalConfirm = () => {
    if (!selectedEntity) return;
    onDelete(selectedEntity.value);
    setIsDeleteModalOpen(false);
    setSelectedEntity(null);
  };

  useEffect(() => {
    onFilterChange(searchQuery);
  }, [searchQuery]);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const paginatedEntity = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  return (
    <>
      <div className="flex flex-col mt-5 gap-4 w-full h-full">
        <SearchInput
          placeholder={`Buscar ${searchPlaceHolder}`}
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <div className="lg:flex flex-col gap-4 flex-1">
          {paginatedEntity.map((data) => (
            <div key={data.uniqueIdentifier}>
              <div className="lg:hidden flex flex-col items-center bg-[#418713] rounded-md mb-5 w-auto p-4 text-white">
                <div className="text-center w-full font-bold">{data.label}</div>
                <div className="flex flex-col items-center py-2 ">
                  {data.cols.map((column, index) => (
                    <p
                      className="mx-2 text-center text-wrap min-w-80 [border-top:1px_solid_#FFF] p-1"
                      key={column.value + index}
                    >
                      {column.value}
                    </p>
                  ))}
                </div>
                <div className="flex gap-3 items-center justify-between w-full pt-2">
                    <div className="bg-red-700 w-full flex justify-center items-center py-1 rounded-md">
                      <IconButton
                        onClick={() => handleDeleteConfirmation(data)}
                        icon={Icon.delete}
                      />
                    </div>
                  <div className="bg-green-500 w-full text-center flex justify-center items-center py-1 rounded-md">
                    <IconButton
                      onClick={() => handleItemInfo(data)}
                      icon={Icon.more}
                    />
                  </div>
                </div>
              </div>
              <div className="hidden lg:flex justify-between bg-[#418713] rounded-md text-white font-semibold p-5">
                <div className="flex items-center">
                  <p className="w-32">{data.label}</p>
                  {data.cols.map((column, index) => (
                    <p
                      className="mx-2 text-start text-wrap min-w-80"
                      key={column.value + index}
                    >
                      {column.value}
                    </p>
                  ))}
                </div>
                <div className="flex gap-3 items-center">
                  <IconButton
                    onClick={() => handleDeleteConfirmation(data)}
                    icon={Icon.delete}
                  />
                  <IconButton
                    onClick={() => handleItemInfo(data)}
                    icon={Icon.more}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        text={`Deseja remover ${listEntity} ${
          selectedEntity ? selectedEntity.label : ""
        }?`}
        title="Confirmar exclusão"
        confirmButtonText="Confirmar"
        onConfirm={handleDeleteModalConfirm}
        onDecline={handleDeleteModalCancel}
      />
    </>
  );
};

export default List;
