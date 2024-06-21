import { toast } from "react-toastify";
import { Bounce } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

interface Props {
    type: string,
    message: string
}

export const notify = (type: string, message: string) => {
    switch (type) {
      case "error":
        toast.error(`${message}`, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
        break;
      case "sucess":
        toast.success(`${message}`, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
        break;
      default:
        break;
    }
  };
