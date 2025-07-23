import type { FC, ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  children?: ReactNode;
}

export const PageHeader: FC<PageHeaderProps> = ({ title, children }) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
      <h2 className="text-3xl font-bold tracking-tight font-headline">{title}</h2>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
};
