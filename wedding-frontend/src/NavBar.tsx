import { Link, matchPath } from 'react-router-dom';
function NavBar() {
  const userShortLink =
    matchPath('/wishlist/:userShortLink', location.pathname)?.params?.userShortLink ??
    matchPath('/:userShortLink', location.pathname)?.params?.userShortLink ??
    'default-user';

  return (
    <nav className="bg-white shadow-md px-4 py-3 mb-1 justify-end">
      <div className="container mx-auto flex justify-end">
        {/* Nav Links */}
        <div className=" space-x-4">
          <Link
            to={`/${userShortLink}`}
            className="block inline-block px-3 py-2 text-lys-100 hover:text-lys-200 "
          >
            Accueil
          </Link>
          <Link
            to={`/wishlist/${userShortLink}`}
            className="block inline-block px-3 py-2 bg-lys-100 text-white rounded-md hover:bg-lys-200 "
          >
            WishList
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default NavBar;
