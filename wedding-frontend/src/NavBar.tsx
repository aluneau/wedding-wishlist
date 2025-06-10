import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

function NavBar() {

  const { userShortLink } = useParams<{ userShortLink: string }>();
  return (
    <nav className="bg-white shadow-md px-4 py-3 mb-1 justify-end">
      <div className="container mx-auto flex justify-end">
        {/* Nav Links */}
        <div className=" space-x-4">
          <Link
            to="/"
            className="block inline-block px-3 py-2 text-gray-700 hover:text-blue-600 "
          >
            Accueil
          </Link>
          <Link
            to="/about"
            className="block inline-block px-3 py-2 text-gray-700 hover:text-blue-600 "
          >
            Informations
          </Link>
          <Link
            to={`/wishlist/${userShortLink}`}
            className="block inline-block px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 "
          >
            WishList
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default NavBar;
