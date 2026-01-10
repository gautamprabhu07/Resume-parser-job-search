import { Outlet, Link } from 'react-router-dom';
import { APP_NAME } from '../utils/constants';

const MainLayout = () => (
  <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
    <header className="p-6 bg-white shadow flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2">
        <span className="text-2xl font-bold text-indigo-600">{APP_NAME}</span>
      </Link>
      <span className="text-sm text-gray-500 hidden sm:inline">
        AI-powered resume parsing & job recommendations
      </span>
    </header>
    <main className="flex-1 p-4 sm:p-8">
      <Outlet />
    </main>
    <footer className="p-4 text-center text-gray-500 text-sm bg-white border-t">
      Built with NLP, AI & Jooble API
    </footer>
  </div>
);

export default MainLayout;
