import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Award,
  BookHeart,
  CalendarDays,
  Check,
  ChevronRight,
  Clapperboard,
  Flame,
  Gift,
  Home,
  Map,
  Play,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Trophy,
  User,
  Zap,
} from 'lucide-react'
import { HashRouter, NavLink, Route, Routes, useLocation } from 'react-router-dom'
import './App.css'

type MovieType = 'movie' | 'series'
type Genre = 'Action' | 'Sci‑Fi' | 'Drama' | 'Comedy' | 'Thriller' | 'Mystery' | 'Adventure'
type QuestStatus = 'active' | 'complete'
type Status = 'Want to Watch' | 'Watching' | 'Watched' | 'Dropped'

type MovieItem = {
  id: string
  title: string
  type: MovieType
  genre: Genre
  year: number
  rating: number
  runtime: string
  overview: string
  image: string
  backdrop: string
  cast: string[]
  director: string
  popularity: number
}

type QuestItem = {
  id: string
  title: string
  description: string
  reward: number
  progress: number
  goal: number
  badge: string
  status: QuestStatus
}

type Achievement = {
  id: string
  title: string
  description: string
  unlocked: boolean
}

type QuizQuestion = {
  id: number
  prompt: string
  options: string[]
  answer: string
  explanation: string
}

type UserState = {
  name: string
  avatar: string
  xp: number
  streak: number
  lastActive: string
  watchlist: string[]
  history: { date: string; label: string }[]
  favoriteGenres: Genre[]
  achievements: string[]
  questRewards: string[]
  quizScores: number[]
  ratings: Record<string, number>
  statuses: Record<string, Status>
}

const STORAGE_KEY = 'cinequest-demo-v1'

const demoMovies: MovieItem[] = [
  {
    id: 'dune-2',
    title: 'Dune: Part Two',
    type: 'movie',
    genre: 'Sci‑Fi',
    year: 2024,
    rating: 8.7,
    runtime: '2h 46m',
    overview:
      'Paul Atreides joins forces with the Fremen to confront the oppressive empire that stripped his family of power.',
    image:
      'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=900&q=80',
    backdrop:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=80',
    cast: ['Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson'],
    director: 'Denis Villeneuve',
    popularity: 97,
  },
  {
    id: 'inception',
    title: 'Inception',
    type: 'movie',
    genre: 'Mystery',
    year: 2010,
    rating: 8.8,
    runtime: '2h 28m',
    overview:
      'A thief who steals secrets through dreams is offered a chance to erase his past by planting an idea in a target’s mind.',
    image:
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&q=80',
    backdrop:
      'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?auto=format&fit=crop&w=1800&q=80',
    cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Elliot Page'],
    director: 'Christopher Nolan',
    popularity: 95,
  },
  {
    id: 'stranger-things',
    title: 'Stranger Things',
    type: 'series',
    genre: 'Thriller',
    year: 2025,
    rating: 9.1,
    runtime: '8 episodes',
    overview:
      'A group of kids uncover a gateway to a dark alternate dimension while facing government experiments and supernatural forces.',
    image:
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=900&q=80',
    backdrop:
      'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1800&q=80',
    cast: ['Millie Bobby Brown', 'Finn Wolfhard', 'Winona Ryder'],
    director: 'The Duffer Brothers',
    popularity: 93,
  },
  {
    id: 'parasite',
    title: 'Parasite',
    type: 'movie',
    genre: 'Drama',
    year: 2019,
    rating: 8.5,
    runtime: '2h 12m',
    overview:
      'A poor family infiltrates the lives of a wealthy household, setting up a tense and intelligent social thriller.',
    image:
      'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=900&q=80',
    backdrop:
      'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1800&q=80',
    cast: ['Song Kang-ho', 'Lee Sun-kyun', 'Cho Yeo-jeong'],
    director: 'Bong Joon-ho',
    popularity: 91,
  },
  {
    id: 'the-mandalorian',
    title: 'The Mandalorian',
    type: 'series',
    genre: 'Action',
    year: 2023,
    rating: 8.4,
    runtime: '6 episodes',
    overview:
      'A wandering bounty hunter protects a mysterious child while navigating a galaxy shaped by old loyalties and new threats.',
    image:
      'https://images.unsplash.com/photo-1513106580091-1d82408b8cd6?auto=format&fit=crop&w=900&q=80',
    backdrop:
      'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1800&q=80',
    cast: ['Pedro Pascal', 'Gina Carano', 'Carl Weathers'],
    director: 'Jon Favreau',
    popularity: 90,
  },
  {
    id: 'midnight-city',
    title: 'Midnight City',
    type: 'movie',
    genre: 'Action',
    year: 2025,
    rating: 8.2,
    runtime: '1h 52m',
    overview:
      'A former courier races through a neon metropolis to stop a criminal syndicate from hijacking the city grid.',
    image:
      'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=900&q=80',
    backdrop:
      'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1800&q=80',
    cast: ['Alicia Quinn', 'Milo Kline', 'Rhea Vale'],
    director: 'Nadia Shaw',
    popularity: 88,
  },
  {
    id: 'sunset-signal',
    title: 'Sunset Signal',
    type: 'series',
    genre: 'Comedy',
    year: 2024,
    rating: 8.1,
    runtime: '10 episodes',
    overview:
      'A radio host and a reclusive producer discover that every station they touch is broadcasting messages from the future.',
    image:
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80',
    backdrop:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=80',
    cast: ['Mila Harts', 'Jai Romero', 'Nora Bell'],
    director: 'Evan Lark',
    popularity: 84,
  },
  {
    id: 'pixel-kin',
    title: 'Pixel Kin',
    type: 'movie',
    genre: 'Adventure',
    year: 2023,
    rating: 8.3,
    runtime: '1h 46m',
    overview:
      'When a forgotten arcade machine unlocks a map to a hidden world, two siblings cross into a dimension of glowing ruins.',
    image:
      'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=900&q=80',
    backdrop:
      'https://images.unsplash.com/photo-1515736351007-d3d2f26d8d53?auto=format&fit=crop&w=1800&q=80',
    cast: ['Lina Ortiz', 'Theo Blake', 'Ari Gomez'],
    director: 'Claire Nox',
    popularity: 87,
  },
]

const questTemplates: QuestItem[] = [
  { id: 'watchlist', title: 'Watchlist Explorer', description: 'Add five titles to your watchlist.', reward: 180, progress: 3, goal: 5, badge: '🎬', status: 'active' },
  { id: 'genre', title: 'Genre Explorer', description: 'Browse three different genres.', reward: 140, progress: 2, goal: 3, badge: '🎧', status: 'active' },
  { id: 'movie-master', title: 'Movie Master', description: 'Complete a movie trivia challenge.', reward: 220, progress: 1, goal: 1, badge: '🧠', status: 'active' },
  { id: 'series-marathon', title: 'Series Marathon', description: 'Explore three TV series.', reward: 160, progress: 2, goal: 3, badge: '📺', status: 'active' },
]

const achievementsList: Achievement[] = [
  { id: 'first-steps', title: 'First Steps', description: 'Complete your first quest.', unlocked: true },
  { id: 'movie-buff', title: 'Movie Buff', description: 'Save five titles to your watchlist.', unlocked: false },
  { id: 'series-addict', title: 'Series Addict', description: 'Binge three series.', unlocked: false },
  { id: 'genre-explorer', title: 'Genre Explorer', description: 'Visit three genres.', unlocked: false },
  { id: 'trivia-champion', title: 'Trivia Champion', description: 'Score 80% in a quiz.', unlocked: false },
  { id: 'seven-day-streak', title: 'Seven-Day Streak', description: 'Maintain a 7-day streak.', unlocked: true },
]

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    prompt: 'Which film features a team infiltrating dreams?',
    options: ['Arrival', 'Inception', 'The Matrix', 'Blade Runner'],
    answer: 'Inception',
    explanation: 'Inception is the mind-bending heist film about entering dreams.',
  },
  {
    id: 2,
    prompt: 'What type of world is explored in Dune: Part Two?',
    options: ['A modern city', 'A desert planet', 'A deep-sea kingdom', 'A moon colony'],
    answer: 'A desert planet',
    explanation: 'The story unfolds on the desert world of Arrakis.',
  },
  {
    id: 3,
    prompt: 'Which title is a sci-fi thriller about alternate dimensions?',
    options: ['Stranger Things', 'Parasite', 'Sunset Signal', 'Pixel Kin'],
    answer: 'Stranger Things',
    explanation: 'The series follows children exploring a mysterious alternate reality.',
  },
  {
    id: 4,
    prompt: 'Which movie centers on a wealthy family and a poor family in tension?',
    options: ['Midnight City', 'Parasite', 'Dune: Part Two', 'Pixel Kin'],
    answer: 'Parasite',
    explanation: 'Parasite is a masterful social thriller about class difference and deception.',
  },
  {
    id: 5,
    prompt: 'Which series follows a bounty hunter protecting a child?',
    options: ['The Mandalorian', 'Sunset Signal', 'Inception', 'The Matrix'],
    answer: 'The Mandalorian',
    explanation: 'The Mandalorian follows a lone provider in a galaxy far, far away.',
  },
]

const leaderboard = [
  { name: 'Ari', xp: 2830 },
  { name: 'Nia', xp: 2510 },
  { name: 'Maya', xp: 2380 },
  { name: 'Leo', xp: 2100 },
]

const makeDefaultUser = (): UserState => ({
  name: 'Maya Sparks',
  avatar: 'MS',
  xp: 1420,
  streak: 7,
  lastActive: new Date().toISOString(),
  watchlist: ['dune-2', 'stranger-things'],
  history: [
    { date: '2026-10-09', label: 'Quest cleared' },
    { date: '2026-10-08', label: 'Movie quiz' },
    { date: '2026-10-07', label: 'Saved a title' },
  ],
  favoriteGenres: ['Sci‑Fi', 'Drama', 'Thriller'],
  achievements: ['first-steps', 'seven-day-streak'],
  questRewards: ['watchlist'],
  quizScores: [80, 100],
  ratings: { 'dune-2': 5, 'parasite': 4 },
  statuses: { 'dune-2': 'Watching', 'parasite': 'Watched' },
})

const getLevelFromXp = (xp: number) => Math.max(1, Math.floor(xp / 500) + 1)
const getRemainingXp = (xp: number) => 500 - (xp % 500 || 500)

const getStoredUser = (): UserState => {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return makeDefaultUser()

  try {
    const parsed = JSON.parse(raw) as UserState
    return { ...makeDefaultUser(), ...parsed }
  } catch {
    localStorage.removeItem(STORAGE_KEY)
    return makeDefaultUser()
  }
}

function App() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const [user, setUser] = useState<UserState>(getStoredUser)
  const [selectedMovie, setSelectedMovie] = useState<MovieItem | null>(null)
  const [filterGenre, setFilterGenre] = useState('All')
  const [filterType, setFilterType] = useState<'All' | 'movie' | 'series'>('All')
  const [search, setSearch] = useState('')
  const [quizIndex, setQuizIndex] = useState(0)
  const [quizScore, setQuizScore] = useState(0)
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null)
  const [quizFinished, setQuizFinished] = useState(false)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
  }, [user])

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    document.body.classList.add('reelr-cursor-active')
    const moveCursor = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || !cursorRef.current) return
      cursorRef.current.style.left = `${event.clientX}px`
      cursorRef.current.style.top = `${event.clientY}px`
    }

    window.addEventListener('pointermove', moveCursor)
    return () => {
      document.body.classList.remove('reelr-cursor-active')
      window.removeEventListener('pointermove', moveCursor)
    }
  }, [])

  const level = getLevelFromXp(user.xp)
  const streakDays = user.streak
  const filteredMovies = useMemo(() => {
    return demoMovies.filter((movie) => {
      const matchesGenre = filterGenre === 'All' || movie.genre === filterGenre
      const matchesType = filterType === 'All' || movie.type === filterType
      const matchesSearch = `${movie.title} ${movie.genre}`
        .toLowerCase()
        .includes(search.toLowerCase())
      return matchesGenre && matchesType && matchesSearch
    })
  }, [filterGenre, filterType, search])

  const addXp = (gain: number) => {
    setUser((prev) => ({ ...prev, xp: prev.xp + gain }))
  }

  const toggleWatchlist = (id: string) => {
    setUser((prev) => {
      const exists = prev.watchlist.includes(id)
      const next = exists ? prev.watchlist.filter((item) => item !== id) : [...prev.watchlist, id]
      return { ...prev, watchlist: next }
    })
  }

  const markQuestComplete = (questId: string) => {
    setUser((prev) => ({
      ...prev,
      questRewards: prev.questRewards.includes(questId) ? prev.questRewards : [...prev.questRewards, questId],
    }))
    addXp(120)
  }

  const handleQuizAnswer = (option: string) => {
    if (selectedChoice) return
    setSelectedChoice(option)
  }

  const continueQuiz = () => {
    if (!selectedChoice) return

    const isCorrect = selectedChoice === quizQuestions[quizIndex].answer
    const nextScore = quizScore + (isCorrect ? 1 : 0)

    if (quizIndex === quizQuestions.length - 1) {
      const finalScore = Math.round((nextScore / quizQuestions.length) * 100)
      setUser((prev) => ({
        ...prev,
        quizScores: [...prev.quizScores, finalScore],
      }))
      addXp(nextScore * 30)
      setQuizScore(nextScore)
      setQuizFinished(true)
      return
    }

    setQuizScore(nextScore)
    setQuizIndex((prev) => prev + 1)
    setSelectedChoice(null)
  }

  const resetQuiz = () => {
    setQuizIndex(0)
    setQuizScore(0)
    setSelectedChoice(null)
    setQuizFinished(false)
  }

  const claimDailyReward = () => {
    addXp(150)
    setUser((prev) => ({
      ...prev,
      lastActive: new Date().toISOString(),
      streak: prev.streak + 1,
      history: [{ date: new Date().toISOString().slice(0, 10), label: 'Daily reward claimed' }, ...prev.history],
    }))
  }

  const resetDemoData = () => {
    const fresh = makeDefaultUser()
    setUser(fresh)
    setSearch('')
    setFilterGenre('All')
    setFilterType('All')
    setQuizIndex(0)
    setQuizScore(0)
    setSelectedChoice(null)
    setQuizFinished(false)
  }

  return (
    <HashRouter>
      <div className="cine-app-shell">
        <aside className="sidebar">
          <div className="brand-wrap">
            <div className="brand-mark">R</div>
            <div>
              <p className="brand-text">REELR</p>
              <span>Your universe of stories</span>
            </div>
          </div>

          <nav className="side-nav" aria-label="Sidebar navigation">
            <NavLink to="/" end className="nav-item">
              <Home size={18} />
              <span>Home</span>
            </NavLink>
            <NavLink to="/discover" className="nav-item">
              <Search size={18} />
              <span>Discover</span>
            </NavLink>
            <NavLink to="/journey" className="nav-item">
              <Map size={18} />
              <span>Path</span>
            </NavLink>
            <NavLink to="/quests" className="nav-item">
              <Target size={18} />
              <span>Missions</span>
            </NavLink>
            <NavLink to="/watchlist" className="nav-item">
              <BookHeart size={18} />
              <span>Watchlist</span>
            </NavLink>
            <NavLink to="/profile" className="nav-item">
              <User size={18} />
              <span>Profile</span>
            </NavLink>
          </nav>

          <div className="sidebar-panel">
            <div className="mini-header">
              <Zap size={15} />
              <span>XP</span>
            </div>
            <strong>{user.xp}</strong>
            <div className="xp-bar">
              <span style={{ width: `${(user.xp % 500) / 5}%` }} />
            </div>
            <small>Level {level}</small>
          </div>
        </aside>

        <div className="app-main">
          <header className="top-header">
            <div className="search-box">
              <Search size={16} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search titles or genres"
                aria-label="Search titles"
              />
            </div>
            <div className="header-actions">
              <button type="button" className="header-pill">Alerts</button>
              <button type="button" className="header-pill">Settings</button>
              <div className="user-badge">
                <span>{user.avatar}</span>
              </div>
            </div>
          </header>

          <main className="content-wrap">
            <Routes>
              <Route path="/" element={<HomePage user={user} level={level} onClaimReward={claimDailyReward} onToggleWatchlist={toggleWatchlist} onSelectMovie={setSelectedMovie} onResetDemo={resetDemoData} streakDays={streakDays} />} />
              <Route path="/discover" element={<DiscoverPage movies={filteredMovies} filterGenre={filterGenre} filterType={filterType} search={search} onSearch={setSearch} onSetGenre={setFilterGenre} onSetType={setFilterType} onToggleWatchlist={toggleWatchlist} onSelectMovie={setSelectedMovie} />} />
              <Route path="/journey" element={<JourneyPage user={user} level={level} movies={demoMovies} onSelectMovie={setSelectedMovie} />} />
              <Route path="/quests" element={<QuestsPage user={user} onClaimQuest={markQuestComplete} />} />
              <Route path="/watchlist" element={<WatchlistPage user={user} onToggleWatchlist={toggleWatchlist} onSelectMovie={setSelectedMovie} />} />
              <Route path="/profile" element={<ProfilePage user={user} level={level} onResetDemo={resetDemoData} />} />
              <Route path="/quiz" element={<QuizPage question={quizQuestions[quizIndex]} questionNumber={quizIndex + 1} totalQuestions={quizQuestions.length} score={quizScore} selectedChoice={selectedChoice} quizFinished={quizFinished} onAnswer={handleQuizAnswer} onContinue={continueQuiz} onReset={resetQuiz} />} />
            </Routes>
          </main>
        </div>

        <OrbitGuide />
        <div ref={cursorRef} className="ufo-cursor" aria-hidden="true"><span>🛸</span></div>

        <nav className="mobile-nav" aria-label="Mobile navigation">
          <NavLink to="/" end className="mobile-item"><Home size={20} /></NavLink>
          <NavLink to="/discover" className="mobile-item"><Search size={20} /></NavLink>
          <NavLink to="/journey" className="mobile-item"><Map size={20} /></NavLink>
          <NavLink to="/quests" className="mobile-item"><Target size={20} /></NavLink>
          <NavLink to="/watchlist" className="mobile-item"><BookHeart size={20} /></NavLink>
        </nav>

        {selectedMovie && (
          <div className="detail-overlay" onClick={() => setSelectedMovie(null)}>
            <div className="detail-modal" onClick={(event) => event.stopPropagation()}>
              <button type="button" className="close-button" onClick={() => setSelectedMovie(null)}>
                ×
              </button>
              <div className="detail-hero" style={{ backgroundImage: `url(${selectedMovie.backdrop})` }}>
                <div className="detail-gradient" />
                <div className="detail-hero-copy">
                  <p className="eyebrow">{selectedMovie.type.toUpperCase()}</p>
                  <h2>{selectedMovie.title}</h2>
                  <div className="detail-meta">
                    <span>{selectedMovie.genre}</span>
                    <span>{selectedMovie.year}</span>
                    <span>{selectedMovie.runtime}</span>
                    <span>⭐ {selectedMovie.rating}</span>
                  </div>
                </div>
              </div>
              <div className="detail-body">
                <div>
                  <p>{selectedMovie.overview}</p>
                  <div className="detail-actions">
                    <button type="button" className="primary-btn" onClick={() => toggleWatchlist(selectedMovie.id)}>
                      {user.watchlist.includes(selectedMovie.id) ? 'Saved to watchlist' : 'Add to watchlist'}
                    </button>
                    <button type="button" className="ghost-btn" onClick={() => setSelectedMovie(null)}>
                      Continue exploring
                    </button>
                  </div>
                </div>
                <div className="detail-info">
                  <div>
                    <small>Director</small>
                    <strong>{selectedMovie.director}</strong>
                  </div>
                  <div>
                    <small>Cast</small>
                    <strong>{selectedMovie.cast.join(', ')}</strong>
                  </div>
                  <div>
                    <small>Status</small>
                    <strong>{user.statuses[selectedMovie.id] ?? 'Want to Watch'}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </HashRouter>
  )
}

function HomePage({
  user,
  level,
  onClaimReward,
  onToggleWatchlist,
  onSelectMovie,
  onResetDemo,
  streakDays,
}: {
  user: UserState
  level: number
  onClaimReward: () => void
  onToggleWatchlist: (id: string) => void
  onSelectMovie: (movie: MovieItem) => void
  onResetDemo: () => void
  streakDays: number
}) {
  const recommended = demoMovies.slice(0, 3)
  const trending = demoMovies.slice(1, 5)

  return (
    <>
      <section className="hero-panel" style={{ backgroundImage: `linear-gradient(90deg, rgba(8, 9, 7, .96) 0%, rgba(8, 9, 7, .76) 48%, rgba(8, 9, 7, .24) 100%), linear-gradient(0deg, rgba(8, 9, 7, .42), transparent 60%), url(${demoMovies[0].backdrop})` }}>
        <div className="hero-copy">
          <p className="eyebrow"><span className="pulse-dot" /> Featured universe · {demoMovies[0].year}</p>
          <h1>Dune: Part Two</h1>
          <p className="subtitle">The spice must flow. Journey back to Arrakis and discover the stories that stay with you long after the credits.</p>
          <div className="cta-row">
            <button type="button" className="primary-btn" onClick={() => { window.location.hash = '#/discover' }}>
              <Play size={16} /> Explore the collection
            </button>
            <button type="button" className="ghost-btn" onClick={() => onSelectMovie(demoMovies[0])}>
              <Clapperboard size={16} /> View film details
            </button>
          </div>
          <div className="featured-meta"><span>{demoMovies[0].genre}</span><span>{demoMovies[0].runtime}</span><span>★ {demoMovies[0].rating}</span></div>
        </div>
        <div className="hero-card">
          <div className="level-chip">LVL {level}</div>
          <div className="hero-stats">
            <div>
              <strong>{user.xp}</strong>
              <span>Total XP</span>
            </div>
            <div>
              <strong>{streakDays}</strong>
              <span>Day streak</span>
            </div>
            <div>
              <strong>{user.watchlist.length}</strong>
              <span>Saved</span>
            </div>
          </div>
          <div className="xp-shell">
            <span style={{ width: `${(user.xp % 500) / 5}%` }} />
          </div>
          <small>{getRemainingXp(user.xp)} XP until level {level + 1}</small>
        </div>
      </section>

      <section className="grid-2 cards-block">
        <div className="panel-card">
          <div className="card-header">
            <h3>Tonight's pick</h3>
            <span className="chip success">Ready</span>
          </div>
          <div className="quest-card">
            <div className="quest-icon">🎬</div>
            <div>
              <strong>Build your watchlist</strong>
              <p>Save five titles that deserve a second look.</p>
            </div>
            <div className="quest-progress">
              <span>3/5</span>
              <div className="mini-bar"><i style={{ width: '60%' }} /></div>
            </div>
          </div>
          <button type="button" className="ghost-btn full" onClick={onClaimReward}>
            <Check size={16} /> Claim nightly bonus +150 XP
          </button>
        </div>

        <div className="panel-card" style={{ background: 'linear-gradient(135deg, rgba(255,186,92,0.12), rgba(72,150,255,0.06))' }}>
          <div className="card-header">
            <h3>Member perks</h3>
            <Gift size={18} />
          </div>
          <div className="reward-box">
            <div className="reward-icon">🎁</div>
            <div>
              <strong>Weekend bonus</strong>
              <p>Keep building your watchlist and unlock a fresh set of standout picks.</p>
            </div>
          </div>
          <button type="button" className="primary-btn full" onClick={onResetDemo}>Reset demo data</button>
        </div>
      </section>

      <section className="section-block">
        <div className="header-row">
          <h2>Recommended titles</h2>
          <button type="button" className="header-link" onClick={() => { window.location.hash = '#/discover' }}>See all <ChevronRight size={15} /></button>
        </div>
        <div className="movie-grid">
          {recommended.map((movie) => (
            <article key={movie.id} className="movie-card">
              <div className="movie-poster" style={{ backgroundImage: `url(${movie.image})` }}>
                <span className="match-pill">{movie.rating.toFixed(1)} ★</span>
              </div>
              <div className="movie-info">
                <h4>{movie.title}</h4>
                <p>{movie.genre} • {movie.year}</p>
                <div className="card-actions">
                  <button type="button" className="small-btn" onClick={() => onSelectMovie(movie)}>Details</button>
                  <button type="button" className="tiny-btn" onClick={() => onToggleWatchlist(movie.id)}>{user.watchlist.includes(movie.id) ? 'Saved' : 'Save'}</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="grid-3">
        <div className="panel-card">
          <div className="card-header"><h3>Trending</h3><Sparkles size={16} /></div>
          <ul className="stack-list">
            {trending.map((item) => (
              <li key={item.id}>
                <span>{item.title}</span>
                <strong>{item.popularity}%</strong>
              </li>
            ))}
          </ul>
        </div>
        <div className="panel-card">
          <div className="card-header"><h3>Milestones</h3><Award size={16} /></div>
          <div className="badge-row">
            {achievementsList.slice(0, 4).map((badge) => (
              <div key={badge.id} className={`badge ${user.achievements.includes(badge.id) ? 'earned' : ''}`}>
                {badge.title.slice(0, 2)}
              </div>
            ))}
          </div>
        </div>
        <div className="panel-card">
          <div className="card-header"><h3>Trending now</h3><Trophy size={16} /></div>
          <ul className="stack-list leaderboard">
            {leaderboard.map((item, index) => (
              <li key={item.name}><span>#{index + 1} {item.name}</span><strong>{item.xp} XP</strong></li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}

function OrbitGuide() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const guideMessage = location.pathname === '/watchlist'
    ? 'Your saved titles live here. Open a title for details or remove it when your mood changes.'
    : location.pathname === '/quests'
      ? 'Take on a movie mission or jump into quick trivia to earn a few more XP.'
      : location.pathname === '/discover'
        ? 'Pick a genre, browse the collection, and save anything that catches your eye.'
        : 'Looking for your next watch? Explore by genre, save a shortlist, and collect badges along the way.'

  return (
    <aside className={`orbit-guide ${isOpen ? 'open' : ''}`} aria-label="Orbit guide">
      {isOpen && (
        <div className="orbit-panel">
          <div className="orbit-panel-heading"><Sparkles size={17} /><strong>Orbit, your guide</strong></div>
          <p>{guideMessage}</p>
          <div className="orbit-links">
            <button type="button" onClick={() => { window.location.hash = '#/discover'; setIsOpen(false) }}>Discover titles</button>
            <button type="button" onClick={() => { window.location.hash = '#/watchlist'; setIsOpen(false) }}>Open watchlist</button>
          </div>
        </div>
      )}
      <button type="button" className="orbit-trigger" aria-expanded={isOpen} onClick={() => setIsOpen((open) => !open)}>
        <Sparkles size={19} />
        <span>{isOpen ? 'Close Orbit' : 'Ask Orbit'}</span>
      </button>
    </aside>
  )
}

function DiscoverPage({
  movies,
  filterGenre,
  filterType,
  search,
  onSearch,
  onSetGenre,
  onSetType,
  onToggleWatchlist,
  onSelectMovie,
}: {
  movies: MovieItem[]
  filterGenre: string
  filterType: 'All' | 'movie' | 'series'
  search: string
  onSearch: (value: string) => void
  onSetGenre: (value: string) => void
  onSetType: (value: 'All' | 'movie' | 'series') => void
  onToggleWatchlist: (id: string) => void
  onSelectMovie: (movie: MovieItem) => void
}) {
  const genres = ['All', 'Action', 'Sci‑Fi', 'Drama', 'Comedy', 'Thriller', 'Mystery', 'Adventure']

  return (
    <>
      <section className="section-block">
        <div className="header-row">
          <h2>Discover</h2>
          <button type="button" className="primary-btn" onClick={() => onSelectMovie(demoMovies[Math.floor(Math.random() * demoMovies.length)])}>Surprise me</button>
        </div>
        <div className="toolbar">
          <div className="filter-row">
            {genres.map((genre) => (
              <button key={genre} type="button" className={filterGenre === genre ? 'filter-chip active' : 'filter-chip'} onClick={() => onSetGenre(genre)}>
                {genre}
              </button>
            ))}
          </div>
          <div className="type-row">
            <button type="button" className={filterType === 'All' ? 'filter-chip active' : 'filter-chip'} onClick={() => onSetType('All')}>All</button>
            <button type="button" className={filterType === 'movie' ? 'filter-chip active' : 'filter-chip'} onClick={() => onSetType('movie')}>Movies</button>
            <button type="button" className={filterType === 'series' ? 'filter-chip active' : 'filter-chip'} onClick={() => onSetType('series')}>Series</button>
          </div>
          <label className="input-inline">
            <Search size={16} />
            <input value={search} onChange={(event) => onSearch(event.target.value)} placeholder="Search titles" />
          </label>
        </div>
      </section>

      <section className="movie-grid discovery-grid">
        {movies.length ? (
          movies.map((movie) => (
            <article key={movie.id} className="movie-card">
              <div className="movie-poster" style={{ backgroundImage: `url(${movie.image})` }}>
                <span className="match-pill">{movie.rating.toFixed(1)} ★</span>
              </div>
              <div className="movie-info">
                <h4>{movie.title}</h4>
                <p>{movie.genre} • {movie.year}</p>
                <div className="card-actions">
                  <button type="button" className="small-btn" onClick={() => onSelectMovie(movie)}>Details</button>
                  <button type="button" className="tiny-btn" onClick={() => onToggleWatchlist(movie.id)}>Save</button>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="empty-state panel-card">No titles match that mix. Try another mood or search term.</div>
        )}
      </section>
    </>
  )
}

function JourneyPage({ user, level, movies, onSelectMovie }: { user: UserState; level: number; movies: MovieItem[]; onSelectMovie: (movie: MovieItem) => void }) {
  const mapNodes = [
    { label: 'Start', active: true },
    { label: 'Quest', active: true },
    { label: 'Level 5', active: true },
    { label: 'Boss', active: false },
    { label: 'Elite', active: false },
  ]

  return (
    <>
      <section className="section-block">
        <div className="header-row">
          <h2>Journey map</h2>
          <span className="chip info">Level {level}</span>
        </div>
        <div className="journey-map">
          {mapNodes.map((node, index) => (
            <div key={node.label} className={node.active ? 'journey-node active' : 'journey-node'}>
              <span>{index + 1}</span>
              <strong>{node.label}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="grid-2">
        <div className="panel-card">
          <div className="card-header"><h3>Daily streak</h3><Flame size={16} /></div>
          <div className="streak-block">
            <strong>{user.streak} days</strong>
            <p>Keep the streak alive with a daily challenge.</p>
          </div>
        </div>
        <div className="panel-card">
          <div className="card-header"><h3>Recent activity</h3><CalendarDays size={16} /></div>
          <ul className="stack-list">
            {user.history.slice(0, 4).map((item) => (
              <li key={`${item.date}-${item.label}`}><span>{item.label}</span><strong>{item.date}</strong></li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-block">
        <div className="header-row">
          <h2>Suggested next picks</h2>
        </div>
        <div className="movie-grid">
          {movies.slice(0, 3).map((movie) => (
            <article key={movie.id} className="movie-card">
              <div className="movie-poster" style={{ backgroundImage: `url(${movie.image})` }} />
              <div className="movie-info">
                <h4>{movie.title}</h4>
                <p>{movie.genre} • {movie.year}</p>
                <button type="button" className="small-btn" onClick={() => onSelectMovie(movie)}>Open details</button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}

function QuestsPage({ user, onClaimQuest }: { user: UserState; onClaimQuest: (id: string) => void }) {
  return (
    <>
      <section className="section-block">
        <div className="header-row">
          <h2>Missions</h2>
          <span className="chip success">{user.questRewards.length} claimed</span>
        </div>
        <div className="quest-list">
          {questTemplates.map((quest) => {
            const completed = user.questRewards.includes(quest.id)
            return (
              <div key={quest.id} className={completed ? 'quest-panel complete' : 'quest-panel'}>
                <div className="quest-icon">{quest.badge}</div>
                <div className="quest-copy">
                  <strong>{quest.title}</strong>
                  <p>{quest.description}</p>
                </div>
                <div className="quest-meta">
                  <span>{quest.progress}/{quest.goal}</span>
                  <button type="button" className={completed ? 'ghost-btn' : 'primary-btn'} onClick={() => onClaimQuest(quest.id)}>
                    {completed ? 'Claimed' : `+${quest.reward} XP`}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <section className="panel-card">
        <div className="card-header"><h3>Quick trivia</h3><Clapperboard size={16} /></div>
        <p className="muted-copy">Test your movie knowledge and keep the streak going with a bonus round.</p>
        <button type="button" className="primary-btn" onClick={() => { window.location.hash = '#/quiz' }}>Start a quick challenge</button>
      </section>
    </>
  )
}

function WatchlistPage({ user, onToggleWatchlist, onSelectMovie }: { user: UserState; onToggleWatchlist: (id: string) => void; onSelectMovie: (movie: MovieItem) => void }) {
  const items = demoMovies.filter((movie) => user.watchlist.includes(movie.id))

  return (
    <>
      <section className="section-block">
        <div className="header-row">
          <h2>Your watchlist</h2>
          <span className="chip info">{items.length} saved</span>
        </div>
        {items.length ? (
          <div className="movie-grid">
            {items.map((movie) => (
              <article key={movie.id} className="movie-card">
                <div className="movie-poster" style={{ backgroundImage: `url(${movie.image})` }} />
                <div className="movie-info">
                  <h4>{movie.title}</h4>
                  <p>{movie.genre} • {movie.year}</p>
                  <div className="card-actions">
                    <button type="button" className="small-btn" onClick={() => onSelectMovie(movie)}>Open</button>
                    <button type="button" className="tiny-btn" onClick={() => onToggleWatchlist(movie.id)}>Remove</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state panel-card">Your watchlist is empty. Save your first title and come back here.</div>
        )}
      </section>
    </>
  )
}

function ProfilePage({ user, level, onResetDemo }: { user: UserState; level: number; onResetDemo: () => void }) {
  const accuracy = user.quizScores.length ? Math.round(user.quizScores.reduce((sum, score) => sum + score, 0) / user.quizScores.length) : 0

  return (
    <>
      <section className="profile-panel panel-card">
        <div className="profile-header">
          <div className="user-avatar large">{user.avatar}</div>
          <div>
            <h2>{user.name}</h2>
            <p>Level {level} • {user.xp} XP</p>
          </div>
        </div>
        <div className="stats-grid">
          <div><strong>{user.streak}</strong><span>Day streak</span></div>
          <div><strong>{user.watchlist.length}</strong><span>Saved</span></div>
          <div><strong>{accuracy}%</strong><span>Accuracy</span></div>
          <div><strong>{user.achievements.length}</strong><span>Badges</span></div>
        </div>
      </section>

      <section className="grid-2">
        <div className="panel-card">
          <div className="card-header"><h3>Favorite genres</h3><Star size={16} /></div>
          <div className="tag-cloud">
            {user.favoriteGenres.map((genre) => (
              <span key={genre} className="tag">{genre}</span>
            ))}
          </div>
        </div>
        <div className="panel-card">
          <div className="card-header"><h3>Activity</h3><ShieldCheck size={16} /></div>
          <ul className="stack-list">
            {user.history.map((entry) => (
              <li key={`${entry.date}-${entry.label}`}><span>{entry.label}</span><strong>{entry.date}</strong></li>
            ))}
          </ul>
        </div>
      </section>

      <section className="panel-card">
        <div className="card-header"><h3>Achievements</h3><Award size={16} /></div>
        <div className="badge-grid">
          {achievementsList.map((badge) => (
            <div key={badge.id} className={user.achievements.includes(badge.id) ? 'badge-card unlocked' : 'badge-card'}>
              <strong>{badge.title}</strong>
              <small>{badge.description}</small>
            </div>
          ))}
        </div>
        <button type="button" className="ghost-btn full" onClick={onResetDemo}>Reset demo user</button>
      </section>
    </>
  )
}

function QuizPage({
  question,
  questionNumber,
  totalQuestions,
  score,
  selectedChoice,
  quizFinished,
  onAnswer,
  onContinue,
  onReset,
}: {
  question: QuizQuestion
  questionNumber: number
  totalQuestions: number
  score: number
  selectedChoice: string | null
  quizFinished: boolean
  onAnswer: (choice: string) => void
  onContinue: () => void
  onReset: () => void
}) {
  if (quizFinished) {
    const percentage = Math.round((score / totalQuestions) * 100)
    return (
      <section className="panel-card quiz-panel">
        <div className="card-header"><h2>Quiz complete</h2><Trophy size={16} /></div>
        <p className="muted-copy">You scored {score}/{totalQuestions} correct.</p>
        <div className="score-ring"><strong>{percentage}%</strong></div>
        <div className="cta-row">
          <button type="button" className="primary-btn" onClick={onReset}>Retry quiz</button>
          <button type="button" className="ghost-btn" onClick={() => { window.location.hash = '#/quests' }}>Back to quests</button>
        </div>
      </section>
    )
  }

  return (
    <section className="panel-card quiz-panel">
      <div className="card-header">
        <h2>Quick movie quiz</h2>
        <span className="chip info">{questionNumber}/{totalQuestions}</span>
      </div>
      <div className="progress-bar"><span style={{ width: `${(questionNumber / totalQuestions) * 100}%` }} /></div>
      <p className="question-text">{question.prompt}</p>
      <div className="answer-grid">
        {question.options.map((option) => {
          const isSelected = selectedChoice === option
          const isCorrect = option === question.answer
          const revealState = selectedChoice ? (isCorrect ? 'correct' : isSelected ? 'wrong' : '') : ''
          return (
            <button key={option} type="button" className={`answer-btn ${revealState}`} onClick={() => onAnswer(option)} disabled={Boolean(selectedChoice)}>
              {option}
              {selectedChoice && isCorrect && <Check size={16} />}
            </button>
          )
        })}
      </div>
      {selectedChoice && (
        <p className="answer-explanation">
          {selectedChoice === question.answer ? 'Nice one!' : `Correct answer: ${question.answer}`}
        </p>
      )}
      <div className="cta-row">
        <button type="button" className="primary-btn" onClick={onContinue} disabled={!selectedChoice}>
          {questionNumber === totalQuestions ? 'See results' : 'Next question'}
        </button>
        <button type="button" className="ghost-btn" onClick={onReset}>Reset</button>
      </div>
    </section>
  )
}

export default App
