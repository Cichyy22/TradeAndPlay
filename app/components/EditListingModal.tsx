'use client';

import { useState, useEffect } from 'react';
import {useTranslations} from 'next-intl';

interface Listing {
  id: string;
  title: string;
  description: string;
  type: 'BOOK' | 'GAME';
  contact: string;
  lat?: number;
  lng?: number;
}

interface EditListingModalProps {
  listing: Listing;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: Partial<Listing>) => void;
}

export default function EditListingModal({ listing, isOpen, onClose, onSave }: EditListingModalProps) {
  const t = useTranslations('listing');

  const [title, setTitle] = useState(listing.title);
  const [description, setDescription] = useState(listing.description);
  const [type, setType] = useState<'BOOK' | 'GAME'>(listing.type);
  const [contact, setContact] = useState(listing.contact);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTitle(listing.title);
      setDescription(listing.description);
      setType(listing.type);
      setContact(listing.contact);
      setLoading(false);
    }
  }, [isOpen, listing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSave({
        id: listing.id,
        title,
        description,
        type,
        contact,
      });
      setLoading(false);
      onClose();
    } catch (error) {
      alert(`${t('error')}: ` + error);
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-md shadow-lg max-w-lg w-full p-6">
        <h2 className="text-xl font-semibold mb-4">{t('edit')}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">{t('title')}</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">{t('desc')}</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 resize-none"
              rows={4}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">{t('type')}</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as 'BOOK' | 'GAME')}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="BOOK">{t('book')}</option>
              <option value="GAME">{t('game')}</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">{t('contact')}</label>
            <input
              type="text"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              {t('cancel')}
            </button>

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {loading ?  `${t('in-progress')}` :  `${t('save')}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}