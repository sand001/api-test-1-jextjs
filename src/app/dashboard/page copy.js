'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { supabase } from '@/app/lib/supabaseClient';
import Notification from '../components/Notification';

export default function ApiKeysDashboard() {
  const [apiKeys, setApiKeys] = useState([]);
  const [newKeyName, setNewKeyName] = useState('');
  const [monthlyLimit, setMonthlyLimit] = useState('1000');
  const [limitEnabled, setLimitEnabled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visibleKeyId, setVisibleKeyId] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [showCopyNotification, setShowCopyNotification] = useState(false);
  const [showDeleteNotification, setShowDeleteNotification] = useState(false);
  const [showEditNotification, setShowEditNotification] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingKey, setEditingKey] = useState(null);
  const [editKeyName, setEditKeyName] = useState('');
  
  // Simulación de datos - Reemplazar con llamadas reales a tu API
  const dummyData = [
    { id: 1, name: 'Producción', key: 'pk_live_123...', created: '2024-03-20', status: 'active' },
    { id: 2, name: 'Desarrollo', key: 'pk_test_456...', created: '2024-03-19', status: 'active' },
  ];

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    try {
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApiKeys(data);
    } catch (error) {
      console.error('Error fetching API keys:', error);
      // Aquí podrías agregar una notificación de error
    }
  };

  const handleCreateKey = async () => {
    if (!newKeyName.trim()) return;
    
    try {
      const newKey = {
        name: newKeyName,
        key: `tvly_${Math.random().toString(36).substr(2, 9)}`,
        monthly_limit: limitEnabled ? parseInt(monthlyLimit) : null,
        status: 'active'
      };

      const { data, error } = await supabase
        .from('api_keys')
        .insert([newKey])
        .select()
        .single();

      if (error) throw error;
      
      setApiKeys([data, ...apiKeys]);
      setNewKeyName('');
    } catch (error) {
      console.error('Error creating API key:', error);
    }
  };

  const handleDeleteKey = async (keyId) => {
    try {
      const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('id', keyId);

      if (error) throw error;
      
      setApiKeys(apiKeys.filter(key => key.id !== keyId));
      setShowDeleteNotification(true);
    } catch (error) {
      console.error('Error al eliminar la clave:', error);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewKeyName('');
  };

  const toggleKeyVisibility = (id) => {
    setVisibleKeyId(visibleKeyId === id ? null : id);
  };

  const handleCopyKey = async (key) => {
    try {
      await navigator.clipboard.writeText(key);
      setShowCopyNotification(true);
    } catch (error) {
      console.error('Error al copiar la clave:', error);
    }
  };

  const handleEditKey = (key) => {
    setEditingKey(key);
    setEditKeyName(key.name);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    try {
      const { error } = await supabase
        .from('api_keys')
        .update({ name: editKeyName })
        .eq('id', editingKey.id);

      if (error) throw error;

      setApiKeys(apiKeys.map(key => 
        key.id === editingKey.id ? { ...key, name: editKeyName } : key
      ));
      
      setShowEditNotification(true);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error al editar la clave:', error);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Header con breadcrumbs */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Pages</span>
            <span>/</span>
            <span>Overview</span>
          </div>
          <h1 className="text-2xl font-semibold mt-2">Overview</h1>
        </div>

        {/* Plan Card con gradiente */}
        <div className="bg-gradient-to-r from-pink-300 via-purple-300 to-blue-400 rounded-xl p-6 mb-8 text-white">
          <div className="flex justify-between items-start mb-8">
            <div>
              <div className="text-sm mb-4">CURRENT PLAN</div>
              <h2 className="text-3xl font-semibold">Researcher</h2>
            </div>
            <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg backdrop-blur-sm">
              Manage Plan
            </button>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <span>API Usage</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="mb-2">0/1,000 Credits</div>
            <div className="w-full bg-white/30 rounded-full h-2">
              <div className="w-0 bg-white rounded-full h-2"></div>
            </div>
            
            <div className="flex items-center gap-2 mt-4">
              <div className="w-8 h-4 bg-white/30 rounded-full">
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </div>
              <span>Pay as you go</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* API Keys Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">API Keys</h2>
              <button 
                onClick={handleOpenModal}
                className="text-gray-600 hover:bg-gray-100 p-1 rounded-full">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-4">
            The key is used to authenticate your requests to the Research API. To learn more, see the documentation page.
          </p>

          {/* Tabla con nuevo diseño */}
          <div className="bg-white rounded-lg shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">NAME</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">USAGE</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">KEY</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">OPTIONS</th>
                </tr>
              </thead>
              <tbody>
                {apiKeys.map((key) => (
                  <tr key={key.id} className="border-b last:border-0">
                    <td className="px-6 py-4 text-sm">{key.name}</td>
                    <td className="px-6 py-4 text-sm">{key.usage || '0'}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <code className="text-sm font-mono">
                          {visibleKeyId === key.id ? key.key : 'tvly-********************************'}
                        </code>
                        <button 
                          onClick={() => toggleKeyVisibility(key.id)} 
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleCopyKey(key.key)} 
                          className="text-gray-400 hover:text-gray-600"
                          title="Copiar API key"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => handleEditKey(key)} 
                          className="text-gray-400 hover:text-gray-600"
                          title="Editar API key"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => handleDeleteKey(key.id)} 
                          className="text-gray-400 hover:text-gray-600"
                          title="Eliminar API key"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-gray-600">
            Have any questions, feedback or need support? We'd love to hear from you!
          </p>
          <button className="mt-4 px-6 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50">
            Contact us
          </button>
        </div>

        {/* Modal para crear nueva API key */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold mb-6">Create a new API key</h2>
              <p className="text-gray-600 mb-6">Enter a name and limit for the new API key.</p>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Key Name — A unique name to identify this key
                </label>
                <input
                  type="text"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="Key Name"
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div className="mb-6">
                <label className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={limitEnabled}
                    onChange={(e) => setLimitEnabled(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium text-gray-700">Limit monthly usage*</span>
                </label>
                {limitEnabled && (
                  <input
                    type="number"
                    value={monthlyLimit}
                    onChange={(e) => setMonthlyLimit(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                  />
                )}
                <p className="text-xs text-gray-500 mt-2">
                  * If the combined usage of all your keys exceeds your plan's limit, all requests will be rejected.
                </p>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleCreateKey();
                    handleCloseModal();
                  }}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal para editar el nombre de la API key */}
        {isEditModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold mb-6">Editar API key</h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de la API key
                </label>
                <input
                  type="text"
                  value={editKeyName}
                  onChange={(e) => setEditKeyName(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Notification 
        message="Copied API Key to clipboard"
        isVisible={showCopyNotification}
        onClose={() => setShowCopyNotification(false)}
      />
      <Notification 
        message="API Key deleted successfully"
        isVisible={showDeleteNotification}
        onClose={() => setShowDeleteNotification(false)}
      />
      <Notification 
        message="Editando API Key"
        isVisible={showEditNotification}
        onClose={() => setShowEditNotification(false)}
      />
    </div>
  );
}
