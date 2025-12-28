
import React, { useState, useEffect } from 'react';
import { Movie, CATEGORIES } from './types';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MovieGrid from './components/MovieGrid';
import MoviePlayer from './components/MoviePlayer';
import UploadModal from './components/UploadModal';
import LoginModal from './components/LoginModal';

const INITIAL_MOVIES: Movie[] = [
  {
    id: '1',
    title: 'Interstellar Odyssey',
    description: 'A journey beyond the stars to save humanity from a dying Earth.',
    thumbnailUrl: 'https://picsum.photos/seed/interstellar/800/450',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    category: 'Sci-Fi',
    year: 2024,
    duration: '2h 45m',
    rating: 4.8,
    aiReview: 'A visual masterpiece that redefines the boundaries of space exploration cinema.'
  },
  {
    id: '2',
    title: 'The Silent Echo',
    description: 'In a world where sound is deadly, one family must survive in total silence.',
    thumbnailUrl: 'https://picsum.photos/seed/echo/800/450',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    category: 'Thriller',
    year: 2023,
    duration: '1h 38m',
    rating: 4.5,
    aiReview: 'Tense, gripping, and masterfully paced. A masterclass in suspense.'
  },
  {
    id: '3',
    title: 'Neon Nights',
    description: 'A detective unravels a conspiracy in a cyberpunk metropolis.',
    thumbnailUrl: 'https://picsum.photos/seed/neon/800/450',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    category: 'Action',
    year: 2024,
    duration: '2h 12m',
    rating: 4.2,
    aiReview: 'Visually stunning with a heartbeat of pure adrenaline.'
  }
];

const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [ownerPin, setOwnerPin] = useState('Roin$king03054738790..');
  const [modalMode, setModalMode] = useState<'login' | 'change'>('login');

  useEffect(() => {
    const savedMovies = localStorage.getItem('roinmovies_data');
    if (savedMovies) {
      setMovies(JSON.parse(savedMovies));
    } else {
      setMovies(INITIAL_MOVIES);
    }
    
    const savedPin = localStorage.getItem('roinmovies_pin');
    if (savedPin) {
      setOwnerPin(savedPin);
    } else {
      localStorage.setItem('roinmovies_pin', 'Roin$king03054738790..');
      setOwnerPin('Roin$king03054738790..');
    }

    const wasAdmin = sessionStorage.getItem('roinmovies_admin') === 'true';
    setIsAdmin(wasAdmin);
  }, []);

  useEffect(() => {
    if (movies.length > 0) {
      localStorage.setItem('roinmovies_data', JSON.stringify(movies));
    }
  }, [movies]);

  const handleToggleAdmin = () => {
    if (isAdmin) {
      setIsAdmin(false);
      sessionStorage.setItem('roinmovies_admin', 'false');
    } else {
      setModalMode('login');
      setIsLoginOpen(true);
    }
  };

  const handleOpenPinChange = () => {
    setModalMode('change');
    setIsLoginOpen(true);
  };

  const handleLoginSuccess = () => {
    setIsAdmin(true);
    setIsLoginOpen(false);
    sessionStorage.setItem('roinmovies_admin', 'true');
  };

  const handleUpdatePin = (newPin: string) => {
    setOwnerPin(newPin);
    localStorage.setItem('roinmovies_pin', newPin);
    setIsLoginOpen(false);
    alert("Security code updated successfully!");
  };

  const handleAddMovie = (newMovie: Movie) => {
    setMovies(prev => [newMovie, ...prev]);
    setIsUploadOpen(false);
  };

  const filteredMovies = movies.filter(m => {
    const matchesCategory = activeCategory === 'All' || m.category === activeCategory;
    const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar 
        isAdmin={isAdmin} 
        onToggleAdmin={handleToggleAdmin} 
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenSettings={handleOpenPinChange}
        onSearch={setSearchQuery}
      />

      <main className="pb-20">
        {!selectedMovie ? (
          <>
            <Hero movie={movies[0]} onPlay={() => setSelectedMovie(movies[0])} />
            
            <div className="px-6 md:px-12 mt-12">
              <div className="flex items-center space-x-4 mb-8 overflow-x-auto no-scrollbar pb-2">
                <button 
                  onClick={() => setActiveCategory('All')}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                    activeCategory === 'All' ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                  }`}
                >
                  All Movies
                </button>
                {CATEGORIES.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                      activeCategory === cat ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <MovieGrid 
                movies={filteredMovies} 
                onSelectMovie={setSelectedMovie} 
              />
            </div>
          </>
        ) : (
          <div className="animate-in fade-in duration-500">
             <button 
                onClick={() => setSelectedMovie(null)}
                className="fixed top-24 left-6 z-50 p-3 bg-black/60 hover:bg-red-600 rounded-full text-white backdrop-blur-md transition-all border border-white/10 shadow-2xl"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <MoviePlayer movie={selectedMovie} />
          </div>
        )}
      </main>

      {isUploadOpen && (
        <UploadModal 
          onClose={() => setIsUploadOpen(false)} 
          onUpload={handleAddMovie} 
        />
      )}

      {isLoginOpen && (
        <LoginModal 
          mode={modalMode}
          correctPin={ownerPin} 
          onClose={() => setIsLoginOpen(false)} 
          onSuccess={handleLoginSuccess}
          onUpdatePin={handleUpdatePin}
        />
      )}

      {isAdmin && (
        <div className="fixed bottom-6 left-6 z-50 animate-bounce">
          <div className="bg-red-600 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest shadow-2xl flex items-center space-x-2 border border-white/20">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span>Owner Studio Active</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
