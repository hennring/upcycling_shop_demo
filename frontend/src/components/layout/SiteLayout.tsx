import { Outlet } from 'react-router-dom';
import { AdminEntry } from './AdminEntry';
import { SiteHeader } from './SiteHeader';
import { SiteFooter } from './SiteFooter';

/** Frame shared by every public page: header, routed content, footer. */
export function SiteLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-stone-50 text-stone-900">
      <div className="sticky top-0 z-20 flex">
        <AdminEntry />
        <SiteHeader />
      </div>
      <main className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
}
