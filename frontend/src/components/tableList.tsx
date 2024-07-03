import React from "react";
import { ListItem } from "./list";
import { useRouter } from "next/navigation";

interface Props<T> {
  data: ListItem<T>[];
  title: string;
  route: string;
}
const TableList = <T,>({ data, title, route }: Props<T>) => {
  const router = useRouter();
  console.log(data);
  if (data.length === 0) {
    return null;
  }
  return (
    <div className="w-full flex flex-col [border-top:1px_solid_#DDD]">
      <div className="text-center font-bold [border-bottom:1px_solid_#DDD]">
        {title}
      </div>
      <div>
        <div className="flex w-full">
          <div className="flex-1 text-center [border-bottom:1px_solid_#DDD] font-bold">
            Nome
          </div>
          <div className="flex-1 text-center [border-bottom:1px_solid_#DDD] font-bold">
            TAG
          </div>
        </div>
        {data.map((item, index) => (
          <div
            key={item.uniqueIdentifier + index}
            className="flex w-full cursor-pointer hover:bg-zinc-100"
            onClick={() =>
              router.push(`/dashboard${route}/get/${item.uniqueIdentifier}`)
            }
          >
            <div className="flex-1 text-center [border-bottom:1px_solid_#DDD]">
              {item.cols[0].value}
            </div>
            <div className="flex-1 text-center [border-bottom:1px_solid_#DDD]">
              {item.cols[1].value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableList;
