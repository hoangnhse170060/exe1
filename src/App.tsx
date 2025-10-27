import { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import History from './pages/History';
import Shop from './pages/Shop';
import Forum from './pages/Forum';
import Services from './pages/Services';
import Contact from './pages/Contact';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
    <div className="min-h-screen">
      <Header currentPage={currentPage} onNavigate={setCurrentPage} onSidebarToggle={setIsSidebarOpen} />
      <main className={`relative transition-all duration-300 ${isSidebarOpen ? 'lg:ml-[320px]' : 'lg:ml-0'}`}>{renderPage()}</main>
      <Footer isSidebarOpen={isSidebarOpen} />
    </div>
  );
}

export default App;
