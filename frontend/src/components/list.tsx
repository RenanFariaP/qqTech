import React, { useState, useEffect } from "react";
import Pagination from "./pagination";
import SearchInput from "./searchInput";
import IconButton, { Icon } from "./iconButton";
import ConfirmModal from "./confirmModal";

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
  onSeeMore: (value: string) => void;
  listEntity: string;
}

const List = <T,>({ data, onFilterChange, listEntity, onDelete, onSeeMore }: Props<T>) => {
  const [selectedEntity, setSelectedEntity] = useState<ListItem<T>|null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSearchChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const handleDelete = (item: ListItem<T>) =>{
    setIsOpen(true);
    setSelectedEntity(item);
  }

  const handleModalCancel = () =>{
    setSelectedEntity(null);
    setIsOpen(false);
  }

  const handleModalConfirm = () =>{
    console.log(selectedEntity)
    if(!selectedEntity) return;
    onDelete(selectedEntity.value);
    setIsOpen(false);
    setSelectedEntity(null);
  }

  useEffect(() => {
    onFilterChange(searchQuery);
  }, [searchQuery]);

  
  const totalPages = Math.ceil(data.length / itemsPerPage);
  
  // useEffect(()=>{
  //   if(currentPage>totalPages){
  //     setCurrentPage(totalPages);
  //   } else if(currentPage === 1){
  //     setCurrentPage(1);
  //   }
  // }, [handleDelete]);

  const paginatedUsers = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
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
              {data.cols.map((column) => (
                <p className="mx-2 text-start text-wrap min-w-80" key={column.value}>
                  {column.value}
                </p>
              ))}
            </div>
            <div className="flex gap-3 items-center">
              <IconButton onClick={()=>handleDelete(data)} icon={Icon.delete} />
              <IconButton onClick={()=>{}} icon={Icon.more} />
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
    <ConfirmModal isOpen={isOpen} text={`Deseja remover ${listEntity} ${selectedEntity? selectedEntity.label : ""}?`} title="Confirmar exclusão" confirmButtonText="Confirmar" onConfirm={handleModalConfirm} onDecline={handleModalCancel}/>
    </>
  );
};

export default List;
