//* package imports

interface IHeaderProps {
  label: string;
}

const Header = ({ label }: IHeaderProps) => {
  return (
    <div className="w-full flex flex-col gap-y-4 items-center justify-center">
      <h1 className="text-3xl font-semibold">{label}</h1>
    </div>
  );
};

export default Header;
