'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import EditListingModal from './EditListingModal';
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

export default function ListingsTable({ userId }: { userId: string }) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const t = useTranslations('listing');
  const fetchListings = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/listing?userId=${userId}`);
      if (!res.ok) throw new Error(`${t('error-downlad')}`);
      const data = await res.json();
      setListings(data);
    } catch (error) {
      alert(`${t('error-downlad')}: ` + error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [userId]);

  const handleDelete = async (id: string) => {
    if (!confirm(`${t('delete-accept')}`)) return;

    try {
      const res = await fetch(`/api/listing/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`${t('error-deleting')}`);
      fetchListings();
    } catch (error) {
      alert(`${t('error-delete')}: ` + error);
    }
  };

  const handleUpdate = async (updatedListing: Partial<Listing> & { id: string }) => {
    try {
      const res = await fetch(`/api/listing/${updatedListing.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedListing),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `${t('error-updating')}`);
      }
      setEditingListing(null);
      fetchListings();
    } catch (error) {
      alert(`${t('error-update')}` + error);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">{t('exchange')}</h2>

      <div className="overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap">{t('title')}</TableHead>
              <TableHead className="whitespace-nowrap">{t('type')}</TableHead>
              <TableHead className="whitespace-nowrap">{t('contact')}</TableHead>
              <TableHead className="whitespace-nowrap">{t('desc')}</TableHead>
              <TableHead className="text-right whitespace-nowrap">{t('action')}</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  {t('load')}
                </TableCell>
              </TableRow>
            ) : listings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                   {t('empty')}
                </TableCell>
              </TableRow>
            ) : (
              listings.map((listing) => (
                <TableRow key={listing.id}>
                  <TableCell className="max-w-[160px] truncate">{listing.title}</TableCell>
                  <TableCell>{listing.type === 'BOOK' ? `${t('book')}` : `${t('game')}`}</TableCell>
                  <TableCell className="max-w-[160px] truncate">{listing.contact}</TableCell>
                  <TableCell className="max-w-[240px] truncate">{listing.description}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingListing(listing)}
                    >
                      {t('edit-btn')}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(listing.id)}
                    >
                      {t('delete')}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {editingListing && (
        <EditListingModal
          isOpen={!!editingListing}
          listing={editingListing}
          onClose={() => setEditingListing(null)}
          onSave={handleUpdate}
        />
      )}
    </div>
  );
}
