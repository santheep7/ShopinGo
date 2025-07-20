import { FaShoppingCart, FaSearch, FaUserCircle } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import { useState } from 'react';

export default function UserNavbar({ searchquery }) {
  const username = localStorage.getItem("username");
  const token = localStorage.getItem("token");
  const role = localStorage.getItem('role')
  const navigate = useNavigate();
  const [input, setInput] = useState("");

  const isLoggedIn = !!token;

  const searchChange = (e) => {
    const val = e.target.value;
    setInput(val);
    searchquery?.(val);
  };



  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem('role');
    navigate("/");
  };

  return (
    <nav className="bg-gradient-to-r from-blue-800 to-indigo-900 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-indigo-700 font-bold text-xl mr-2">
                SG
              </div>
              <span className="text-white font-bold text-xl hidden sm:inline-block">ShopinGO</span>
            </Link>
          </div>

          {/* Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <Link to="/" className="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Home
              </Link>
              {isLoggedIn && (
                <Link to="/order" className="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  My Orders
                </Link>
              )}
            </div>
          </div>

          {/* Right Section: Search + Cart + Profile */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative hidden sm:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-black-400" />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                value={input}
                onChange={searchChange}
                className="block w-full pl-10 pr-3 py-2 border border-transparent rounded-md leading-5 bg-blue-500 bg-opacity-30 text-black placeholder-blue-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-white focus:text-gray-900 sm:text-sm transition-all duration-200"
              />

            </div>

            {/* Cart */}
            <Link to="/cart" className="p-2 rounded-full text-white hover:bg-blue-700 transition" title="Cart">
              <FaShoppingCart size={20} />
            </Link>

            {/* User Section */}
            <div className="flex items-center space-x-2">
              {isLoggedIn && (
                <span className="text-white text-sm font-medium hidden md:block">
                  {username}
                </span>
              )}
              <Menu as="div" className="relative">
                <Menu.Button className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-white">
                  <span className="sr-only">Open user menu</span>
                  {isLoggedIn ? (
                    <div className="h-8 w-8 rounded-full bg-blue-800 flex items-center justify-center text-white font-medium">
                      {username?.charAt(0).toUpperCase()}
                    </div>
                  ) : (
                    <FaUserCircle className="h-8 w-8 text-white" />
                  )}
                </Menu.Button>

                <Transition
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                    {isLoggedIn ? (
                      <>
                        <Menu.Item disabled>
                          <div className="px-4 py-2 text-sm text-gray-600 font-semibold">
                            Hello, {username}
                          </div>
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={handleLogout}
                              className={`w-full text-left px-4 py-2 text-sm ${active ? 'bg-gray-100' : ''
                                } text-gray-700`}
                            >
                              Logout
                            </button>
                          )}
                        </Menu.Item>
                      </>
                    ) : (
                      <>
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/Login"
                              className={`block px-4 py-2 text-sm ${active ? 'bg-gray-100' : ''
                                } text-gray-700`}
                            >
                              Sign In
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/reg"
                              className={`block px-4 py-2 text-sm ${active ? 'bg-gray-100' : ''
                                } text-gray-700`}
                            >
                              Sign Up
                            </Link>
                          )}
                        </Menu.Item>
                      </>
                    )}
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}