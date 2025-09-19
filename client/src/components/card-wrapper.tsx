//* package imports
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

//* file imports
import Header from "@/components/header";

interface ICardWrapperProps {
  children: React.ReactNode;
  headerLabel?: string | undefined;
  className?: string;
}

const CardWrapper = ({
  children,
  headerLabel,
  className,
}: ICardWrapperProps) => {
  return (
    <Card
      className={cn(
        "w-[450px] shadow-md bg-white text-black border-none rounded-2xl",
        className
      )}
    >
      <CardHeader>
        {headerLabel ? <Header label={headerLabel} /> : ""}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export default CardWrapper;
