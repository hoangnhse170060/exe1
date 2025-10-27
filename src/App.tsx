import { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import History from './pages/History';
import Shop from './pages/Shop';
import Forum from './pages/Forum';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';

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
      case 'login':
        return <Login onNavigate={setCurrentPage} />;
      case 'register':
        return <Register onNavigate={setCurrentPage} />;
      default:
        return <Home onNavigate={setCurrentPage} />;
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen">
        <Header currentPage={currentPage} onNavigate={setCurrentPage} onSidebarToggle={setIsSidebarOpen} />
        <main className={`relative transition-all duration-500 ${isSidebarOpen ? 'lg:ml-[340px]' : 'lg:ml-0'}`}>{renderPage()}</main>
        <Footer isSidebarOpen={isSidebarOpen} />
      </div>
    </AuthProvider>
  );
}

export default App;
