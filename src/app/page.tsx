import ButtonInput from "@/components/buttonInput";
import TextInput from "@/components/textInput";

export default function Login() {
  function handleSubmit (){

  }

  return (
    <div className="bg-[#F2F2F2] flex flex-col items-center shadow-md w-96 rounded-md pb-10">
      <p className="bg-[#418713] py-5 px-8 w-full text-white [text-shadow:_1px_1px_rgba(53,16,56,0.5)] [border-radius:_6px_6px_0_0]">Login</p>
      <div>
        <TextInput label="Usuário" type="text"/>
      </div>
      <div>
        <TextInput label="Senha" type="password"/>
      </div>
      <div>
        <ButtonInput label="Entrar" handleButton={handleSubmit}/>
      </div>
      <div className="">Esqueceu a senha?</div>
    </div>
  );
}
