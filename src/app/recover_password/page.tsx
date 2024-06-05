import ButtonInput from "@/components/buttonInput";
import TextInput from "@/components/textInput";
import React from "react";

const page = () => {
  const handleSubmit = () => {};
  return (
    <div className="w-full">
      <div className="bg-[#F2F2F2] flex flex-col items-center shadow-md w-96 rounded-md pb-5">
        <p className="bg-[#418713] py-5 px-8 w-full text-white [text-shadow:_1px_1px_rgba(53,16,56,0.5)] [border-radius:_6px_6px_0_0]">
          Recuperar senha
        </p>
        <p className="text-justify px-8 pt-5">
          Utilize o e-mail cadastrado para recuperar sua senha, para onde enviaremos sua senha!
        </p>
        <div>
          <TextInput label="E-mail" type="email" />
        </div>
        <div>
          <ButtonInput label="Enviar" handleButton={handleSubmit} />
        </div>
      </div>
    </div>
  );
};

export default page;
