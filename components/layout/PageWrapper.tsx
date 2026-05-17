import { ReactNode } from "react";

interface Props {
  title: string;
  children: ReactNode;
}

export default function PageWrapper({ title, children }: Props) {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">{title}</h1>

      {children}
    </div>
  );
}
