import React, { ChangeEvent } from "react";

interface Props {
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
}

const SearchInput = (props: Props) => {
  return (
    <div className="flex items-center">
      <input
          type="text"
          placeholder={props.placeholder}
          value={props.value}
          onChange={props.onChange}
          className="p-2 [border-radius:6px_0_0_6px] outline-none w-full px-2"
        />
      <div className="[border-left:1px_solid_#BBB] flex justify-center items-center bg-white [border-radius:0_6px_6px_0] w-10 h-10 outline-none">
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
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </div>
    </div>
  );
};

export default SearchInput;
