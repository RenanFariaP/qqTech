import React, { useState, useEffect } from "react";
import Pagination from "./pagination";
import SearchInput from "./searchInput";
import IconButton, { Icon } from "./iconButton";
import ConfirmModal from "./confirmModal";
import MoreInfosModal from "./moreInfos";
import { list } from "postcss";

const itemsPerPage = 7;

export interface ListColumn<T> {
  value: string;
}

export interface ListItem<T> {
  value: T;
  uniqueIdentifier: string | number;
  cols: ListColumn<T>[];
  label: string;
}

interface Props<T> {
  data: ListItem<T>[];
  onFilterChange: (value: string) => void;
  onDelete: (value: T) => void;
  listEntity: string;
}

const List = <T,>({ data, onFilterChange, listEntity, onDelete }: Props<T>) => {
  const [selectedEntity, setSelectedEntity] = useState<ListItem<T>|null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  const handleSearchChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const handleDelete = (item: ListItem<T>) =>{
    setIsDeleteModalOpen(true);
    setSelectedEntity(item);
  };

  const handleItemInfos = (item: ListItem<T>) =>{
    setIsInfoModalOpen(true);
    setSelectedEntity(item);
    console.log(item.value);
  }

  const handleDeleteModalCancel = () =>{
    setSelectedEntity(null);
    setIsDeleteModalOpen(false);
  }

  const handleInfosModalCancel = () =>{
    setSelectedEntity(null);
    setIsInfoModalOpen(false);
  }

  const handleDeleteModalConfirm = () =>{
    if(!selectedEntity) return;
    onDelete(selectedEntity.value);
    setIsDeleteModalOpen(false);
    setSelectedEntity(null);
  }

  useEffect(() => {
    onFilterChange(searchQuery);
  }, [searchQuery]);

  
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const paginatedUsers = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  console.log(isInfoModalOpen)
  return (
    <>
      <div className="flex flex-col mt-5 gap-4 w-full h-full">
      <SearchInput
        placeholder={`Nome d${listEntity}`}
        value={searchQuery}
        onChange={handleSearchChange}
      />
      <div className="flex flex-col gap-4 flex-1">
        {paginatedUsers.map((data) => (
          <div
            key={data.uniqueIdentifier}
            className="flex justify-between bg-[#418713] rounded-md text-white font-semibold p-5"
          >
            <div className="flex items-center">
              {data.cols.map((column, index) => (
                <p className="mx-2 text-start text-wrap min-w-80" key={column.value+index}>
                  {column.value}
                </p>
              ))}
            </div>
            <div className="flex gap-3 items-center">
              <IconButton onClick={()=>handleDelete(data)} icon={Icon.delete} />
              <IconButton onClick={()=>handleItemInfos(data)} icon={Icon.more} />
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
    <MoreInfosModal isOpen={isInfoModalOpen} data={selectedEntity} dataType={listEntity} onDecline={handleInfosModalCancel} title={`Informações do ${listEntity}`} />
    <ConfirmModal isOpen={isDeleteModalOpen} text={`Deseja remover ${listEntity} ${selectedEntity? selectedEntity.label : ""}?`} title="Confirmar exclusão" confirmButtonText="Confirmar" onConfirm={handleDeleteModalConfirm} onDecline={handleDeleteModalCancel}/>
    </>
  );
};

export default List;
