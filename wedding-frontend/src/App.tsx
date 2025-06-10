// App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import WishList from './WishList';
import AddItems from './AddItems';
import { Toaster } from 'react-hot-toast';
import Home from './Home';
import NavBar from './NavBar';
function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <NavBar />
      <Routes>
        <Route path="/:userShortLink" element={<Home />} />
        <Route path="/wishlist/:userShortLink" element={<WishList />} />
        <Route path="/addItem" element={<AddItems />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
