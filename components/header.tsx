import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';

const Header = () => {
  return (
    <header>
      <nav className="bg-zinc-800 p-4">
        <div className="container flex items-center justify-between max-[700px]:flex-col max-[700px]:gap-3">
          <Link href="/" className="text-xl font-bold text-white">
            UXMind Dashboard
          </Link>
          <ul className="flex gap-8">
            <li>
              <Link href="/" className="px-4 py-2 text-white">
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/projects" className="px-4 py-2 text-white">
                Projects
              </Link>
            </li>
            <li>
              <Link href="/projects/add" className="px-4 py-2 text-white">
                Add project
              </Link>
            </li>
            <li>
              <UserButton />
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
