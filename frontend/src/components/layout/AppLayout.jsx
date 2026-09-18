import { Outlet } from 'react-router-dom';
import AppHeader from './AppHeader';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-pg-canvas">
      <AppHeader />
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
