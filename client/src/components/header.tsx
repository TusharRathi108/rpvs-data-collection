//* package imports

interface IHeaderProps {
  label: string;
}

const Header = ({ label }: IHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <h1 className="flex flex-1 text-2xl font-semibold">{label}</h1>
      <p className="w-[220px] text-center border border-yellow-900 text-lg bg-yellow-200 py-2 rounded-2xl">
        Financial Year: 2025-26
      </p>
    </div>
  );
};

export default Header;
