'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const SidebarItem = ({ icon: Icon, label, href, isSubmenu = false }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href}>
      <div
        className={`flex items-center px-4 py-2 text-sm ${
          isActive
            ? 'text-blue-600 bg-blue-50'
            : 'text-gray-700 hover:bg-gray-100'
        } ${isSubmenu ? 'pl-10' : ''}`}
      >
        {Icon && <Icon className="w-5 h-5 mr-3" />}
        <span>{label}</span>
      </div>
    </Link>
  );
};

export default SidebarItem; 