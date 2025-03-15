import Link from 'next/link';
export const Navbar = () => {
  return (
    <>
      <header className="bg-orange-500 shadow-lg rounded-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/"><h1 className="text-3xl font-bold text-white">Blog</h1></Link>
          <nav className="space-x-6 gap-4">
            <Link
              href="/"
              className="text-white hover:text-gray-200 transition duration-300"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-white hover:text-gray-200 transition duration-300"
            >
              About
            </Link>
            <Link
              href="/Contact"
              className="text-white hover:text-gray-200 transition duration-300"
            >
              Contact
            </Link>
            <Link
              href="/Login"
              className="text-white hover:text-gray-200 transition duration-300"
            >
              LogIn
            </Link>
          </nav>
        </div>
      </header>
    </>
  );
};
