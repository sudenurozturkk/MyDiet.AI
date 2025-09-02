import Image from 'next/image';

const Logo = () => {
  return (
    <div className="flex items-center gap-2 pt-1">
      <Image src="/logo.svg" alt="MyBodyRules Logo" width={120} height={36} />
    </div>
  );
};

export default Logo; 