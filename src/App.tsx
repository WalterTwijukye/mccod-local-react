import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import Home from './pages/Home';
import MedFormDeath from './components/MedFormDeath';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home Page */}
        {/* <Route path="/" element={<Home />} /> */}

        {/* Medical Form Page */}
        <Route path="/" element={<MedFormDeath />} />

        {/* Add more routes as needed */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;