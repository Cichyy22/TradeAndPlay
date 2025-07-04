'use client';

import { useState, useEffect } from 'react';
import {useTranslations} from 'next-intl';
import { listingSchema } from '@/lib/schema';

import { toast } from 'react-toastify';

interface Listing {
  id: string;
  title: string;
  description: string;
  type: 'BOOK' | 'GAME';
  contact: string;
}

interface EditListingModalProps {
  listing: Listing;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: Partial<Listing>) => void;
}

export default function EditListingModal({ listing, isOpen, onClose, onSave }: EditListingModalProps) {
  const t = useTranslations();

  const [title, setTitle] = useState(listing.title);
  const [description, setDescription] = useState(listing.description);
  const [type, setType] = useState<'BOOK' | 'GAME'>(listing.type);
  const [contact, setContact] = useState(listing.contact);
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

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

    const dataToValidate = {
      id: listing.id,
      title,
      description: description || undefined,
      type,
      contact: contact || undefined
    };

    const result = listingSchema.partial().safeParse(dataToValidate);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach(({ path, message }) => {
        if (path.length > 0) fieldErrors[path[0]] = message;
      });

      setErrors(fieldErrors);
      setLoading(false);
      return;
    }

    setErrors({});

    try {
      await onSave({
        id: listing.id,
        title,
        description,
        type,
        contact
      });
      setLoading(false);
       toast.success(`${t('toast.success-edit')}`, {
            position: 'bottom-left',
          });
      onClose();
    } catch (error) {
      toast.error(`${t('listing.error')}: ` + (error as Error).message, {
            position: 'bottom-left',
          });
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-md shadow-lg max-w-lg w-full p-6">
        <h2 className="text-xl font-semibold mb-4">{t('listing.edit')}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">{t('listing.title')}</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className={`w-full border border-gray-300 rounded px-3 py-2 ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.title && <p className="text-red-600 text-sm mt-1">{t(`${errors.title}`)}</p>}
          </div>

          <div>
            <label className="block mb-1 font-medium">{t('listing.desc')}</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className={`w-full border border-gray-300 rounded px-3 py-2 resize-none ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
              rows={4}
            />
            {errors.description && <p className="text-red-600 text-sm mt-1">{t(`${errors.description}`)}</p>}
          </div>

          <div>
            <label className="block mb-1 font-medium">{t('listing.type')}</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as 'BOOK' | 'GAME')}
              className={`w-full border border-gray-300 rounded px-3 py-2 ${errors.type ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="BOOK">{t('listing.book')}</option>
              <option value="GAME">{t('listing.game')}</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">{t('listing.contact')}</label>
            <input
              type="text"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              required
              className={`w-full border border-gray-300 rounded px-3 py-2 ${errors.contact ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.contact && <p className="text-red-600 text-sm mt-1">{t(`${errors.contact}`)}</p>}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              {t('listing.cancel')}
            </button>

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {loading ?  `${t('listing.in-progress')}` :  `${t('listing.save')}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}