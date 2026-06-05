import PublicLayout from '@/components/PublicLayout';
import ScrollRestore from '@/components/ScrollRestore';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <PublicLayout>
      <ScrollRestore />
      {children}
    </PublicLayout>
  );
}
