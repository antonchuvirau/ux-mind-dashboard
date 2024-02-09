import Link from 'next/link';

const Header = () => {
  return (
    <header>
      <nav className='border-gray-200 bg-white p-4 dark:bg-gray-800'>
        <div className='container mx-auto flex flex-wrap items-center justify-between'>
          <Link
            href='/'
            className='fond-semibold flex items-center text-xl text-white'
          >
            UXMind Dashboard
          </Link>
          <ul className='flex items-center justify-center gap-8 font-medium'>
            <li>
              <Link
                href='/'
                className='lg:hover:text-primary-700 block border-b border-gray-100 py-2 pl-3 pr-4 text-gray-700 hover:bg-gray-50 lg:border-0 lg:p-0 lg:hover:bg-transparent dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent lg:dark:hover:text-white'
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href='/projects'
                className='lg:hover:text-primary-700 block border-b border-gray-100 py-2 pl-3 pr-4 text-gray-700 hover:bg-gray-50 lg:border-0 lg:p-0 lg:hover:bg-transparent dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent lg:dark:hover:text-white'
              >
                Projects
              </Link>
            </li>
            <li>
              <Link
                href='/projects/create'
                className='lg:hover:text-primary-700 block border-b border-gray-100 py-2 pl-3 pr-4 text-gray-700 hover:bg-gray-50 lg:border-0 lg:p-0 lg:hover:bg-transparent dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent lg:dark:hover:text-white'
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
