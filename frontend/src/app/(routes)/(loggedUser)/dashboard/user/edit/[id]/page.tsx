"use client";

import { ListItem } from "@/components/list";
import { Icon } from "@/components/genericButton";
import React, { FormEvent, useEffect, useMemo, useState } from "react";
import { UserWithRelation } from "@/types/user";
import TextInput from "@/components/textInput";
import ButtonInput from "@/components/buttonInput";
import GenericButton from "@/components/genericButton";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import axios from "axios";
import { ToastContainer } from "react-toastify";

import { Notify } from "@/components/toast";
import { Error } from "@/types/error";
import { useRouter } from "next/navigation";
import { ProfileInfos } from "@/types/infos/profileInfos";

interface UpdateUserForm {
  username: string;
  email: string;
  registration: string;
  password: string;
}

interface GetUserForm {
    username: string;
    email: string;
    registration: string;
    profile_id: number | null;
  }

interface SelectOptions<T> {
  value: T;
  label: string;
}

const UserUpdate = ({ params }: { params: { id: string } }) => {
  const [profileOptions, setProfileOptions] = useState<SelectOptions<ProfileInfos>[]>([]);
  const [profileSelectedOption, setProfileSelectedOption] = useState<SelectOptions<ProfileInfos> | null>(null);
  const [entityID, setEntityID] = useState<number>();
  const [disabled, setDisabled] = useState(false);

  const profileUnselectedOptions: SelectOptions<ProfileInfos>[] = useMemo(() => {
    const selectedOptionId = profileSelectedOption?.value.id;
  
    const result = profileOptions.filter((profile) => {
      return profile.value.id !== selectedOptionId;
    });
  
    return result;
  }, [profileSelectedOption, profileOptions]);

  const router = useRouter();
  const [formData, setFormData] = useState<UpdateUserForm>({
    username: "",
    email: "",
    registration: "",
    password: "",
  });

  const [getUserForm, setGetUserForm] = useState<GetUserForm>({
    username: "",
    email: "",
    registration: "",
    profile_id: null
  });

  const handleChange = (_name: keyof UpdateUserForm, _value: any) => {
    setGetUserForm((prev) => ({ ...prev, [_name]: _value }));
  };

  const handleSelectChange = (profileSelectedOption: any) => {
    setProfileSelectedOption(profileSelectedOption);
  };

  const formatProfileOptions = (data: ProfileInfos[]): SelectOptions<ProfileInfos>[] => {
    const options: SelectOptions<ProfileInfos>[] = data.map((profile) => ({
      value: profile,
      label: profile.name,
    }));
    return options;
  };

  const formatProfileSelected = (data: ProfileInfos): SelectOptions<ProfileInfos> =>{
    const option: SelectOptions<ProfileInfos> = {
      value: data,
      label: data.name
    }
    return option;
  }

  const fetchProfileList = async () => {
    try {
      const response = await axios.get<ProfileInfos[]>(
        `http://localhost:8000/dashboard/profile/`
      );
      const { data } = response;
      const formatted = formatProfileOptions(data);
      setProfileOptions(formatted);
    } catch (error) {
      const e = error as Error;
      const message = e.response.data.detail;
      Notify('error', message);
    }
  };

  const handleGetUser = async (id: number) =>{
    try {
        const response = await axios.get<UserWithRelation>(`http://localhost:8000/dashboard/user/${id}`)
        const userDetails = {
            username: response.data.username,
            email: response.data.email,
            registration: response.data.registration,
            password: response.data.password,
            profile_id: response.data.profile_id
        }
        if(response.data.profile){
          setProfileSelectedOption(formatProfileSelected(response.data.profile));
        }
        setGetUserForm(userDetails);
    } catch (error) {
      const e = error as Error;
      const message = e.response.data.detail;
      Notify("error", message);
    }
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const form = {
        username: getUserForm.username,
        email: getUserForm.email,
        registration: getUserForm.registration,
        profile_id: profileSelectedOption?.value.id,
      };
      const response = await axios.put(
        `http://localhost:8000/dashboard/user/${entityID}`,
        form
      );
      Notify('success', 'Usuário atualizado com sucesso!');
      setDisabled(true);
      setTimeout(()=>router.replace('/dashboard/user'), 3000);
    } catch (error) {
      const e = error as Error;
      const message = e.response.data.detail;
      Notify('error', message);
    } 
  };

  useEffect(() => {
    if(!params.id){
      return;
    };
    const id = parseInt(params.id);
    setEntityID(id);
    fetchProfileList();
    handleGetUser(id);
  }, [params.id]);

  const animatedComponents = makeAnimated();
  return (
    <div className="flex flex-col p-10 gap-5 w-full h-full">
      <ToastContainer />
      <div className="flex gap-16 items-center justify-between">
        <h1 className="font-bold lg:text-xl text-lg">
          Gerenciamento de usuário
        </h1>
        <GenericButton onClick={() => router.push('/dashboard/user')} text="Voltar" icon={Icon.return} />
      </div>
      <form onSubmit={handleSubmit}>
        <h1></h1>
        <TextInput
          label="Nome do usuário"
          type="text"
          name="username"
          isRequired={true}
          value={getUserForm.username}
          onChange={(e) => handleChange("username", e.target.value)}
        />
        <TextInput
          label="E-mail"
          type="email"
          name="email"
          isRequired={true}
          value={getUserForm.email}
          onChange={(e) => handleChange("email", e.target.value)}
        />
        <TextInput
          label="Matrícula"
          type="text"
          name="registration"
          isRequired={true}
          value={getUserForm.registration}
          onChange={(e) => handleChange("registration", e.target.value)}
        />
        <div className="flex flex-col mt-5">
          <div>Perfil:</div>
          <Select
                className="w-80"
                closeMenuOnSelect={true}
                components={animatedComponents}
                defaultValue={[]}
                name="options"
                options={profileUnselectedOptions}
                onChange={handleSelectChange}
                value={profileSelectedOption}
              />
        </div>
        {disabled ? (
          <div>
            <button type='submit' className='flex justify-center items-center bg-zinc-400 py-2 px-7 rounded-md text-white my-5 shadow-sm' disabled>Enviar</button>
          </div>
        ) : (
          <ButtonInput label="Enviar" onSubmit={() => {}}/>
        )}
      </form>
    </div>
  );
};

export default UserUpdate;
