import React, { useState } from "react";
import { Profile } from "../types/profile";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

interface Props {
  options: Profile[];
}

const SelectComponent: React.FC<Props> = ({ options }) => {

  return (
    <Select className="w-80 mt-5"
      closeMenuOnSelect={false}
      components={animatedComponents}
      defaultValue={[]}
      isMulti
      options={options}
      
    />
  );
};

export default SelectComponent;
