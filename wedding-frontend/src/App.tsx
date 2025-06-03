// App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import WishList from './WishList';
import AddItems from './AddItems';
import { Toaster } from 'react-hot-toast';
function App() {
  return (
    <BrowserRouter>
            <Toaster position="top-right" />
      <Routes>
        <Route path="/:userShortLink" element={<WishList />} />
        <Route path="/addItem" element={<AddItems />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
