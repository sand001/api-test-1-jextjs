'use client';
import { useEffect } from 'react';

export default function Notification({ message, isVisible, onClose }) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // La notificación se cerrará después de 3 segundos

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 flex items-center bg-green-600 text-white px-4 py-2 rounded-md shadow-lg">
      <span className="mr-2">✓</span>
      {message}
      <button
        onClick={onClose}
        className="ml-4 text-white hover:text-gray-200"
      >
        ×
      </button>
    </div>
  );
}
