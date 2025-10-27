import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Home from './pages/Home';
import History from './pages/History';
import Shop from './pages/Shop';
import Forum from './pages/Forum';
import Services from './pages/Services';
import Contact from './pages/Contact';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={setCurrentPage} />;
      case 'history':
        return <History />;
      case 'shop':
        return <Shop />;
      case 'forum':
        return <Forum />;
      case 'services':
        return <Services />;
      case 'contact':
        return <Contact />;
      default:
        return <Home onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-vietnam-black">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <main>{renderPage()}</main>
      <Footer />
    </div>
  );
}

export default App;
