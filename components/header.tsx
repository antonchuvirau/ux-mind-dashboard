import Link from 'next/link';

const Header = () => {
  return (
    <header>
      <nav className="bg-zinc-800 p-4">
        <div className="container mx-auto flex flex-wrap items-center justify-between">
          <Link
            href="/"
            className="flex items-center text-xl font-bold text-white"
          >
            UXMind Dashboard
          </Link>
          <ul className="flex items-center justify-center gap-8 font-medium">
            <li>
              <Link href="/" className="py-2 pl-3 pr-4 text-white lg:p-0">
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/projects"
                className="py-2 pl-3 pr-4 text-white lg:p-0"
              >
                Projects
              </Link>
            </li>
            <li>
              <Link
                href="/projects/create"
                className="py-2 pl-3 pr-4 text-white lg:p-0"
              >
                Add project
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
