import React, { useState } from "react";
import { Profile } from "../types/profile";
import Select, { ActionMeta, MultiValue } from "react-select";
import makeAnimated from "react-select/animated";
import { Module } from "@/types/module";
import { Transaction } from "@/types/transaction";
import { Method } from "@/types/method";

const animatedComponents = makeAnimated();

interface Props {
  options: Profile[] | Module[] | Transaction [] | Method[];
  onChange: () => void;
}

const SelectComponent: React.FC<Props> = ({ options, onChange }) => {
  return (
    <div className="flex flex-col mt-5">
      <label>Perfil</label>
      <Select
        className="w-80"
        closeMenuOnSelect={false}
        components={animatedComponents}
        defaultValue={[]}
        isMulti
        options={options}
         
      />
    </div>
  );
};

export default SelectComponent;
