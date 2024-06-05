import React from 'react'
import TextInput from './textInput';

interface Props {
    isUserRegister: boolean;
    haveTag: boolean;
    haveSelect: boolean;
    quantitySelect: number;
    typeRegister: string;
}

const RegisterForm = ({typeRegister, isUserRegister, haveTag, haveSelect, quantitySelect}: Props) => {
  return (
    <form>
        <TextInput isRequired={true} label='Nome' name='' />
        {

        }
    </form>
  )
}

export default RegisterForm