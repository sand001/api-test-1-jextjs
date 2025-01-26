import Image from 'next/image';

const SidebarLogo = () => {
  return (
    <div className="px-4 py-6">
      <div className="flex items-center">
        <Image
          src="/logo.svg"  // Asegúrate de tener el logo en la carpeta public
          alt="Logo"
          width={120}
          height={40}
          className="h-8"
        />
      </div>
    </div>
  );
};

export default SidebarLogo; 