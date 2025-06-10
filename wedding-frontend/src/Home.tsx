import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

function Home() {
 const { userShortLink } = useParams<{ userShortLink: string }>();
  return (

    <div className="flex min-h-screen flex-col items-center bg-base-100 px-4">

      <div className="max-w-3xl mx-auto px-4 py-6">

        <div className="text-center mb-2">
          <h1 className="text-6xl text-blue-900 font-extrabold font-creamcake ">
            Liste de mariage
          </h1>
          <p className="text-3xl text-saumon-100 text-seconmt-2 font-medium font-hellovalentina">
            Faustine & Adrien
          </p>
        </div>

        <div className="bg-base-100 shadow-xl rounded-2xl p-8 prose prose-lg mx-auto text-beaubleau-100 font-perfectday text-3xl ">
          <div className="flex justify-center mb-6">
            <img
              src="./pictures/faustineadrien.png"
              alt="Faustine et Adrien"
              className="max-w-[175px] sm:max-w-[300px] md:max-w-[400px] w-full h-auto rounded-xl shadow-md"
            />
          </div>
          <p>Bonjour à tous,</p>

          <p className="py-2">
            Voici quelques petites idées de cadeaux possibles au cas où vous souhaiteriez
            nous en offrir à l'occasion de notre mariage. Ceci, évidemment, n'est pas
            obligatoire, mais simplement indicatif.
          </p>

          <p className="py-2">
            Nous avons hâte de partager avec vous ce moment.
          </p>

          <p className="py-2">
            Les idées sont listées avec des liens / références. Si vous optez pour l’un des
            cadeaux, merci de le cocher afin d’éviter les doublons auprès de nos invités.
            Si l’un des objets est déjà coché, c’est qu’il a été choisi par quelqu’un d’autre.
          </p>
          <p className="py-2">
            Merci à tous
          </p>
          <div className = "flex justify-center">
            <Link
              to={`/wishlist/${userShortLink}`}
              className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow transition duration-300"
            >
              Voir la WishList
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Home;
