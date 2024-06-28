import React, { useState, useEffect } from "react";
import Pagination from "./pagination";
import { profiles as mockProfiles } from "../mocks/profile";
import SearchInput from "./searchInput";
import { Profile } from "@/types/profile";

const itemsPerPage = 5;

const ProfilesList: React.FC = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchProfiles = () => {
      setProfiles(mockProfiles);
    };
    fetchProfiles();
  }, []);

  const handleSearchChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const filteredProfiles = profiles.filter(
    (profile) =>
        profile.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProfiles.length / itemsPerPage);

  const paginatedProfiles = filteredProfiles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex flex-col mt-5 gap-5">
      <SearchInput
        placeholder="Nome do perfil"
        value={searchQuery}
        onChange={handleSearchChange}
      />
      <div className="grid grid-cols-1 gap-4">
        {paginatedProfiles.map((profile) => (
          <div
            key={profile.id}
            className="flex justify-between bg-[#418713] rounded-md text-white font-semibold p-5"
          >
            <p>{profile.name}</p>
            <p>{profile.description}</p>
            <div className="flex gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
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
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
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

export default ProfilesList;
