//* package imports
import { TiTickOutline } from "react-icons/ti";

interface IFormSuccessProps {
  message?: string;
}

const FormSuccess = ({ message }: IFormSuccessProps) => {
  if (!message) return null;

  return (
    <div className="bg-green-300/40 p-3 rounded-md flex items-center gap-x-2 text-sm text-green-500">
      <TiTickOutline className="h-4 w-4" />
      <p>{message}</p>
    </div>
  );
};

export default FormSuccess;
