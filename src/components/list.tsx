import React, { useState, useEffect } from "react";
import Pagination from "./pagination";
import { users as mockUsers } from "../mocks/users";
import { User } from "@/types/user";
import SearchInput from "./searchInput";

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
  searchLabel: string;
}

const List = <T,>({ data, onFilterChange, searchLabel }: Props<T>) => {
  const [value, setValue] = useState<T[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

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
  useEffect(() => {
    console.log(data);
  }, [data]);
  return (
    <div className="flex flex-col mt-5 gap-4 w-full h-full">
      <SearchInput
        placeholder={searchLabel}
        value={searchQuery}
        onChange={handleSearchChange}
      />
      <div className="grid grid-cols-1 gap-4 flex-1">
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                <line x1="10" x2="10" y1="11" y2="17" />
                <line x1="14" x2="14" y1="11" y2="17" />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="12" cy="12" r="1" />
                <circle cx="12" cy="5" r="1" />
                <circle cx="12" cy="19" r="1" />
              </svg>
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
