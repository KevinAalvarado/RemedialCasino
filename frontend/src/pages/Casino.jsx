import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Users, Gamepad2, Search, Filter, Eye, EyeOff } from 'lucide-react';

const API_BASE_URL_CUSTOMERS = 'http://localhost:4000/api/customers';
const API_BASE_URL_GAMES = 'http://localhost:4000/api/games';

const Casino = () => {
  const [activeTab, setActiveTab] = useState('games');
  const [games, setGames] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [gameForm, setGameForm] = useState({
    name: '',
    category: '',
    minimunBet: '',
    maximunBet: ''
  });

  const [clientForm, setClientForm] = useState({
    fullName: '',
    email: '',
    password: '',
    age: '',
    country: ''
  });

  const gameCategories = ['Mesa', 'Electronico', 'Lotería', 'Cartas', 'Dados'];

  // API calls
  const apiCallGames = async (endpoint, options = {}) => {
    try {
      const response = await fetch(`${API_BASE_URL_GAMES}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (err) {
      console.error('API call (games) error:', err);
      throw err;
    }
  };

  const apiCallCustomers = async (endpoint, options = {}) => {
    try {
      const response = await fetch(`${API_BASE_URL_CUSTOMERS}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (err) {
      console.error('API call (customers) error:', err);
      throw err;
    }
  };

  // Fetch data
  const fetchGames = async () => {
    try {
      setLoading(true);
      const data = await apiCallGames('/');
      setGames(data);
    } catch (err) {
      setError('Error fetching games: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      setLoading(true);
      const data = await apiCallCustomers('/');
      setClients(data);
    } catch (err) {
      setError('Error fetching clients: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Game CRUD operations
  const handleGameSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const gameData = {
        name: gameForm.name,
        category: gameForm.category,
        minimunBet: parseFloat(gameForm.minimunBet),
        maximunBet: parseFloat(gameForm.maximunBet)
      };

      if (editingItem) {
        await apiCallGames(`/${editingItem._id}`, {
          method: 'PUT',
          body: JSON.stringify(gameData)
        });
      } else {
        await apiCallGames('/', {
          method: 'POST',
          body: JSON.stringify(gameData)
        });
      }

      resetGameForm();
      setShowModal(false);
      fetchGames();
    } catch (err) {
      setError('Error saving game: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteGame = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este juego?')) return;

    try {
      setLoading(true);
      await apiCallGames(`/${id}`, { method: 'DELETE' });
      fetchGames();
    } catch (err) {
      setError('Error deleting game: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Client CRUD operations
  const handleClientSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const clientData = {
        fullName: clientForm.fullName,
        email: clientForm.email,
        ...(clientForm.password && { password: clientForm.password }),
        age: parseInt(clientForm.age),
        country: clientForm.country
      };

      if (editingItem) {
        // Remove email from update data as it's unique and shouldn't be updated
        const { email, ...updateData } = clientData;
        await apiCallCustomers(`/${editingItem._id}`, {
          method: 'PUT',
          body: JSON.stringify(updateData)
        });
      } else {
        await apiCallCustomers('/', {
          method: 'POST',
          body: JSON.stringify(clientData)
        });
      }

      resetClientForm();
      setShowModal(false);
      fetchClients();
    } catch (err) {
      setError('Error saving client: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteClient = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este cliente?')) return;

    try {
      setLoading(true);
      await apiCallCustomers(`/${id}`, { method: 'DELETE' });
      fetchClients();
    } catch (err) {
      setError('Error deleting client: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Form handlers
  const resetGameForm = () => {
    setGameForm({ name: '', category: '', minimunBet: '', maximunBet: '' });
    setEditingItem(null);
  };

  const resetClientForm = () => {
    setClientForm({ fullName: '', email: '', password: '', age: '', country: '' });
    setEditingItem(null);
  };

  const openGameModal = (game = null) => {
    if (game) {
      setGameForm({
        name: game.name || '',
        category: game.category || '',
        minimunBet: game.minimunBet != null ? String(game.minimunBet) : '',
        maximunBet: game.maximunBet != null ? String(game.maximunBet) : ''
      });
      setEditingItem(game);
    } else {
      resetGameForm();
    }
    setModalType('game');
    setShowModal(true);
  };

  const openClientModal = (client = null) => {
    if (client) {
      setClientForm({
        fullName: client.fullName || '',
        email: client.email || '',
        password: '',
        age: client.age != null ? String(client.age) : '',
        country: client.country || ''
      });
      setEditingItem(client);
    } else {
      resetClientForm();
    }
    setModalType('client');
    setShowModal(true);
  };

  // Filter data
  const filteredGames = games.filter(game => {
    const matchesSearch = game.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || game.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const filteredClients = clients.filter(client =>
  (client?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client?.email?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Effects
  useEffect(() => {
    if (activeTab === 'games') {
      fetchGames();
    } else {
      fetchClients();
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black relative overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-32 h-32 border-4 border-cyan-500 rounded-full animate-pulse"></div>
        <div className="absolute top-32 right-20 w-24 h-24 border-4 border-pink-500 rounded-lg rotate-45 animate-bounce"></div>
        <div className="absolute bottom-20 left-32 w-40 h-40 border-4 border-yellow-500 rounded-full animate-pulse"></div>
        <div className="absolute bottom-32 right-16 w-28 h-28 border-4 border-green-500 rounded-lg rotate-12 animate-bounce"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 bg-gradient-to-r from-purple-900/90 to-pink-900/90 backdrop-blur-sm border-b-4 border-cyan-400 shadow-2xl">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-400 to-yellow-400 flex items-center gap-4 filter drop-shadow-lg">
              ♠️ CASINO COLONIAL ♦️
            </h1>
            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab('games')}
                className={`px-8 py-4 rounded-2xl font-black text-lg transition-all transform hover:scale-105 flex items-center gap-3 border-4 ${
                  activeTab === 'games'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-cyan-300 shadow-cyan-500/50 shadow-2xl'
                    : 'bg-gradient-to-r from-gray-800 to-gray-900 text-gray-300 border-gray-600 hover:border-cyan-400'
                }`}
              >
                <Gamepad2 size={24} />
                JUEGOS
              </button>
              <button
                onClick={() => setActiveTab('clients')}
                className={`px-8 py-4 rounded-2xl font-black text-lg transition-all transform hover:scale-105 flex items-center gap-3 border-4 ${
                  activeTab === 'clients'
                    ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white border-pink-300 shadow-pink-500/50 shadow-2xl'
                    : 'bg-gradient-to-r from-gray-800 to-gray-900 text-gray-300 border-gray-600 hover:border-pink-400'
                }`}
              >
                <Users size={24} />
                CLIENTES
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 py-8">
        {error && (
          <div className="bg-gradient-to-r from-red-500/20 to-pink-500/20 border-4 border-red-400 text-red-200 px-6 py-4 rounded-2xl mb-8 shadow-2xl">
            <div className="font-black text-lg">{error}</div>
            <button onClick={() => setError('')} className="float-right font-black text-2xl hover:text-white">×</button>
          </div>
        )}

        {/* Controls */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cyan-400" size={24} />
            <input
              type="text"
              placeholder={`BUSCAR ${activeTab.toUpperCase()}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-gradient-to-r from-gray-900/80 to-purple-900/80 border-4 border-cyan-400 rounded-2xl text-white placeholder-cyan-200 focus:outline-none focus:ring-4 focus:ring-cyan-300 font-bold text-lg shadow-2xl"
            />
          </div>

          {activeTab === 'games' && (
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-pink-400" size={24} />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="pl-14 pr-10 py-4 bg-gradient-to-r from-gray-900/80 to-purple-900/80 border-4 border-pink-400 rounded-2xl text-white focus:outline-none focus:ring-4 focus:ring-pink-300 font-bold text-lg shadow-2xl"
              >
                <option value="">TODAS LAS CATEGORÍAS</option>
                {gameCategories.map(category => (
                  <option key={category} value={category} className="bg-gray-900 font-bold">{category}</option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={() => activeTab === 'games' ? openGameModal() : openClientModal()}
            className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl font-black text-lg hover:from-green-400 hover:to-emerald-400 transition-all transform hover:scale-105 flex items-center gap-3 shadow-2xl border-4 border-green-300"
          >
            <Plus size={24} />
            AGREGAR {activeTab === 'games' ? 'JUEGO' : 'CLIENTE'}
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="relative">
              <div className="animate-spin rounded-full h-20 w-20 border-8 border-cyan-500 border-t-transparent shadow-2xl"></div>
              <div className="absolute inset-0 animate-ping rounded-full h-20 w-20 border-4 border-pink-400 opacity-30"></div>
            </div>
          </div>
        ) : (
          <div className="grid gap-8">
            {activeTab === 'games' ? (
              // Games Grid
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredGames.map(game => (
                  <div key={game._id} className="bg-gradient-to-br from-gray-900/90 to-purple-900/90 backdrop-blur-sm border-4 border-cyan-400 rounded-3xl p-8 hover:border-pink-400 transition-all transform hover:scale-105 shadow-2xl hover:shadow-cyan-500/50">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-400 mb-3">{game.name}</h3>
                        <span className="px-4 py-2 bg-gradient-to-r from-purple-500/50 to-pink-500/50 text-yellow-300 rounded-full text-sm font-black border-2 border-yellow-400">
                          {game.category}
                        </span>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => openGameModal(game)}
                          className="p-3 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 text-blue-300 rounded-xl hover:from-blue-400/50 hover:to-cyan-400/50 transition-all border-2 border-blue-400 transform hover:scale-110"
                        >
                          <Edit2 size={20} />
                        </button>
                        <button
                          onClick={() => deleteGame(game._id)}
                          className="p-3 bg-gradient-to-r from-red-500/30 to-pink-500/30 text-red-300 rounded-xl hover:from-red-400/50 hover:to-pink-400/50 transition-all border-2 border-red-400 transform hover:scale-110"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-4 text-gray-300">
                      <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-900/50 to-emerald-900/50 rounded-xl border-2 border-green-400">
                        <span className="font-black text-green-300">APUESTA MIN:</span>
                        <span className="font-black text-2xl text-green-400">${game.minimunBet}</span>
                      </div>
                      <div className="flex justify-between items-center p-4 bg-gradient-to-r from-red-900/50 to-pink-900/50 rounded-xl border-2 border-red-400">
                        <span className="font-black text-red-300">APUESTA MAX:</span>
                        <span className="font-black text-2xl text-red-400">${game.maximunBet}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Clients Grid
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredClients.map(client => (
                  <div key={client._id} className="bg-gradient-to-br from-gray-900/90 to-purple-900/90 backdrop-blur-sm border-4 border-pink-400 rounded-3xl p-8 hover:border-cyan-400 transition-all transform hover:scale-105 shadow-2xl hover:shadow-pink-500/50">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-cyan-400 mb-3">{client.fullName}</h3>
                        <p className="text-gray-300 text-sm font-bold bg-gradient-to-r from-gray-800/80 to-purple-800/80 px-3 py-1 rounded-full border border-gray-600">{client.email}</p>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => openClientModal(client)}
                          className="p-3 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 text-blue-300 rounded-xl hover:from-blue-400/50 hover:to-cyan-400/50 transition-all border-2 border-blue-400 transform hover:scale-110"
                        >
                          <Edit2 size={20} />
                        </button>
                        <button
                          onClick={() => deleteClient(client._id)}
                          className="p-3 bg-gradient-to-r from-red-500/30 to-pink-500/30 text-red-300 rounded-xl hover:from-red-400/50 hover:to-pink-400/50 transition-all border-2 border-red-400 transform hover:scale-110"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-4 text-gray-300">
                      <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-900/50 to-cyan-900/50 rounded-xl border-2 border-blue-400">
                        <span className="font-black text-blue-300">EDAD:</span>
                        <span className="font-black text-xl text-blue-400">{client.age}</span>
                      </div>
                      <div className="flex justify-between items-center p-4 bg-gradient-to-r from-yellow-900/50 to-orange-900/50 rounded-xl border-2 border-yellow-400">
                        <span className="font-black text-yellow-300">PAÍS:</span>
                        <span className="font-black text-xl text-yellow-400">{client.country}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-gray-900 to-purple-900 rounded-3xl p-10 w-full max-w-md border-4 border-cyan-400 shadow-2xl shadow-cyan-500/50">
            <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-400 mb-8 text-center">
              {editingItem ? 'EDITAR' : 'AGREGAR'} {modalType === 'game' ? 'JUEGO' : 'CLIENTE'}
            </h2>

            {modalType === 'game' ? (
              <div className="space-y-6">
                <div>
                  <label className="block text-cyan-300 mb-3 font-black">NOMBRE DEL JUEGO</label>
                  <input
                    type="text"
                    required
                    value={gameForm.name}
                    onChange={(e) => setGameForm({ ...gameForm, name: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800/80 border-2 border-cyan-400 rounded-xl text-white focus:outline-none focus:ring-4 focus:ring-cyan-300 font-bold"
                    placeholder="ej. Blackjack"
                  />
                </div>

                <div>
                  <label className="block text-pink-300 mb-3 font-black">CATEGORÍA</label>
                  <select
                    required
                    value={gameForm.category}
                    onChange={(e) => setGameForm({ ...gameForm, category: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800/80 border-2 border-pink-400 rounded-xl text-white focus:outline-none focus:ring-4 focus:ring-pink-300 font-bold"
                  >
                    <option value="">Seleccionar Categoría</option>
                    {gameCategories.map(category => (
                      <option key={category} value={category} className="bg-gray-800 font-bold">{category}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-green-300 mb-3 font-black">APUESTA MIN ($)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={gameForm.minimunBet}
                      onChange={(e) => setGameForm({ ...gameForm, minimunBet: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800/80 border-2 border-green-400 rounded-xl text-white focus:outline-none focus:ring-4 focus:ring-green-300 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-red-300 mb-3 font-black">APUESTA MAX ($)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={gameForm.maximunBet}
                      onChange={(e) => setGameForm({ ...gameForm, maximunBet: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800/80 border-2 border-red-400 rounded-xl text-white focus:outline-none focus:ring-4 focus:ring-red-300 font-bold"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-6 py-4 bg-gradient-to-r from-gray-600 to-gray-800 text-white rounded-xl hover:from-gray-500 hover:to-gray-700 transition-all font-black border-2 border-gray-500"
                  >
                    CANCELAR
                  </button>
                  <button
                    type="button"
                    onClick={handleGameSubmit}
                    disabled={loading}
                    className="flex-1 px-6 py-4 bg-gradient-to-r from-cyan-500 to-pink-500 text-white rounded-xl hover:from-cyan-400 hover:to-pink-400 transition-all disabled:opacity-50 font-black border-2 border-cyan-300"
                  >
                    {loading ? 'GUARDANDO...' : 'GUARDAR'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <label className="block text-cyan-300 mb-3 font-black">NOMBRE COMPLETO</label>
                  <input
                    type="text"
                    required
                    value={clientForm.fullName}
                    onChange={(e) => setClientForm({ ...clientForm, fullName: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800/80 border-2 border-cyan-400 rounded-xl text-white focus:outline-none focus:ring-4 focus:ring-cyan-300 font-bold"
                    placeholder="Juan Pérez"
                  />
                </div>

                <div>
                  <label className="block text-pink-300 mb-3 font-black">EMAIL</label>
                  <input
                    type="email"
                    required={!editingItem}
                    disabled={editingItem}
                    value={clientForm.email}
                    onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800/80 border-2 border-pink-400 rounded-xl text-white focus:outline-none focus:ring-4 focus:ring-pink-300 disabled:opacity-50 font-bold"
                    placeholder="juan@ejemplo.com"
                  />
                  {editingItem && (
                    <p className="text-gray-400 text-sm mt-2 font-bold">El email no se puede cambiar</p>
                  )}
                </div>

                <div>
                  <label className="block text-yellow-300 mb-3 font-black">
                    CONTRASEÑA {editingItem && '(dejar vacío para mantener actual)'}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required={!editingItem}
                      value={clientForm.password}
                      onChange={(e) => setClientForm({ ...clientForm, password: e.target.value })}
                      className="w-full px-4 py-3 pr-12 bg-gray-800/80 border-2 border-yellow-400 rounded-xl text-white focus:outline-none focus:ring-4 focus:ring-yellow-300 font-bold"
                      placeholder="Ingresa contraseña"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-blue-300 mb-3 font-black">EDAD</label>
                    <input
                      type="number"
                      required
                      min="18"
                      max="120"
                      value={clientForm.age}
                      onChange={(e) => setClientForm({ ...clientForm, age: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800/80 border-2 border-blue-400 rounded-xl text-white focus:outline-none focus:ring-4 focus:ring-blue-300 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-green-300 mb-3 font-black">PAÍS</label>
                    <input
                      type="text"
                      required
                      value={clientForm.country}
                      onChange={(e) => setClientForm({ ...clientForm, country: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800/80 border-2 border-green-400 rounded-xl text-white focus:outline-none focus:ring-4 focus:ring-green-300 font-bold"
                      placeholder="El Salvador"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-6 py-4 bg-gradient-to-r from-gray-600 to-gray-800 text-white rounded-xl hover:from-gray-500 hover:to-gray-700 transition-all font-black border-2 border-gray-500"
                  >
                    CANCELAR
                  </button>
                  <button
                    type="button"
                    onClick={handleClientSubmit}
                    disabled={loading}
                    className="flex-1 px-6 py-4 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-xl hover:from-pink-400 hover:to-red-400 transition-all disabled:opacity-50 font-black border-2 border-pink-300"
                  >
                    {loading ? 'GUARDANDO...' : 'GUARDAR'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Casino;