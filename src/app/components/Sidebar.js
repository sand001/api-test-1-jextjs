'use client';

import { useState } from 'react';
import SidebarLogo from './SidebarLogo';
import SidebarItem from './SidebarItem';
import { 
  HomeIcon, 
  UserIcon, 
  BeakerIcon, 
  DocumentTextIcon, 
  CodeBracketIcon,
  BookOpenIcon 
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const [isPersonalOpen, setIsPersonalOpen] = useState(false);

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col">
      <SidebarLogo />
      
      {/* Selector Personal */}
      <div className="px-4 mb-4">
        <button
          onClick={() => setIsPersonalOpen(!isPersonalOpen)}
          className="w-full flex items-center justify-between p-2 text-sm text-gray-700 bg-white border rounded-lg hover:bg-gray-50"
        >
          <span>Personal</span>
          <svg
            className={`w-4 h-4 transition-transform ${
              isPersonalOpen ? 'transform rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Navegación principal */}
      <nav className="flex-1">
        <SidebarItem icon={HomeIcon} label="Overview" href="/dashboard" />
        <SidebarItem icon={UserIcon} label="My Account" href="/dashboard/account" />
        <SidebarItem icon={BeakerIcon} label="Research Assistant" href="/dashboard/assistant" />
        <SidebarItem icon={DocumentTextIcon} label="Research Reports" href="/dashboard/reports" />
        <SidebarItem icon={CodeBracketIcon} label="API Playground" href="/dashboard/playground" />
        <SidebarItem icon={BookOpenIcon} label="Documentation" href="/dashboard/docs" />
      </nav>

      {/* Perfil de usuario */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            <UserIcon className="w-5 h-5 text-gray-500" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700">Usuario</p>
            <p className="text-xs text-gray-500">usuario@email.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 