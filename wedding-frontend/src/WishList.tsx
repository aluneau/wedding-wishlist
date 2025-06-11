import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from 'react-hot-toast';

function WishList() {
  type User = {
    name: string;
    shortLink: string;
  };

  type Items = {
    id: string,
    name: string,
    description: string,
    amazonUrl: string,
    imageUrl: string,
    reserved: boolean,
    reservedBy: string,
  }

  const [items, setItems] = useState<Items[] | []>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState<User | null>(null);
  const { userShortLink } = useParams<{ userShortLink: string }>();

  // Fetch from backend
  useEffect(() => {
    if (userShortLink) {
      loadUser(userShortLink);
    }
    else {
      console.log("no user found");
    }
    loadItems();
  }, [userShortLink]);

  function loadItems() {
    fetch("https://wishlist.luneau.me/api/items")
      .then((res) => res.json())
      .then(setItems)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  function loadUser(shortLink: string) {
    fetch(`https://wishlist.luneau.me/api/users/getByShortLink/${shortLink}`)
      .then((res) => res.json())
      .then(setUser)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))

  }

  function toggleReservation(id: string) {
    if (user != null) {
      fetch(`https://wishlist.luneau.me/api/items/reserve/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          shortLink: user.shortLink
        }),
      }).then((res) => {
        if (!res.ok) {
          toast.error("You can't unreserve an item you didn't reserve.");
        }
        else {
          toast.success("Reservation updated!");
        }
        loadItems();

      })
    }
  }

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="flex min-h-screen flex-col items-center pt-8 bg-base-100 px-4">

      <div className="card w-full max-w-lg bg-white shadow-lg rounded-xl p-6 mb-4 sm:p-8">
        <h2 className="text-center mb-3 text-5xl font-semibold text-lys-100 text-center font-creamcake">
          Idées de cadeaux
        </h2>

        <ul className="space-y-6">
          {items.map(({ id, name, description, imageUrl, amazonUrl, reserved }) => (
            <li
              key={id}
              className={`flex flex-col flex-row items-center space-y-3 space-y-0 space-x-4 transition-all duration-300 ${reserved ? "opacity-60" : ""
                }`}
            >
              <input
                type="checkbox"
                id={`item-${id}`}
                checked={reserved}
                onChange={() => toggleReservation(id)}
                className="checkbox checkbox-primary checkbox-md flex-shrink-0"
              />
              <div className="flex-1">
                <label
                  htmlFor={`item-${id}`}
                  className={`select-none cursor-pointer block text-lg font-medium transition-all duration-300 ${reserved ? "line-through text-gray-400 italic" : "text-saumon-100"
                    }`}
                >
                  {name}
                </label>

                <div className="mt-1 flex items-center space-x-3 opacity-80">
                  {imageUrl && (
                    <img
                      src={`../pictures/${imageUrl}`}
                      alt={name}
                      className="w-16 h-16 rounded-lg object-cover border border-gray-200 flex-shrink-0"
                    />
                  )}
                  <div className="flex flex-col text-sm text-bleufonce-100">
                    <p>{description}</p>
                    {amazonUrl && (
                      <a
                        href={amazonUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-800  underline hover:text-primary-focus"
                      >
                        Lien
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default WishList;
