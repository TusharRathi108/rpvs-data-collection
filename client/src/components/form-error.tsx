//* package imports
import { LuTriangleAlert } from "react-icons/lu";

interface IFormErrorProps {
  message?: string;
}

const FormError = ({ message }: IFormErrorProps) => {
  if (!message) return null;

  return (
    <div className="bg-red-400/30 p-3 rounded-md flex items-center gap-x-2 text-sm text-red-500">
      <LuTriangleAlert className="h-4 w-4" />
      <p>{message}</p>
    </div>
  );
};

export default FormError;
