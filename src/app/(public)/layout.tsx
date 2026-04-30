import PublicLayout from '@/components/PublicLayout';
import ScrollToTop from '@/components/ScrollToTop';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <PublicLayout>
      <ScrollToTop />
      {children}
    </PublicLayout>
  );
}
