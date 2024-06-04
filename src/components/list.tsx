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
}

interface Props<T> {
  data: ListItem<T>[];
  onFilterChange: (value: string) => void;
  onDelete: (value: string | number) => void;
  onSeeMore: (value: string) => void;
  searchLabel: string;

}

const List = <T,>({ data, onFilterChange, searchLabel, onDelete, onSeeMore }: Props<T>) => {
  const [value, setValue] = useState<T[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSearchChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  useEffect(() => {
    onFilterChange(searchQuery);
  }, [searchQuery]);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const paginatedUsers = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  return (
    <div className="flex flex-col mt-5 gap-4 w-full h-full">
      <SearchInput
        placeholder={`Nome do ${searchLabel}`}
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
                <p className="mx-2 text-start text-wrap min-w-40" key={column.value}>
                  {column.value}
                </p>
              ))}
            </div>
            <div className="flex gap-3 items-center">
              <IconButton onClick={()=>onDelete(data.uniqueIdentifier)} icon={Icon.delete} />
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
  );
};

export default List;
