import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { User1 } from './pages/User1';
import { User2 } from './pages/User2';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/user1" element={<User1 />} />
        <Route path="/user2" element={<User2 />} />
      </Routes>
    </BrowserRouter>
  );
}