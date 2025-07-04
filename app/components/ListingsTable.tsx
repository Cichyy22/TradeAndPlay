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

import { toast } from 'react-toastify';

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
  const t = useTranslations();
  const fetchListings = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/listing?userId=${userId}`);
      if (!res.ok) throw new Error(`${t('listing.error-downlad')}`);
      const data = await res.json();
      setListings(data);
    } catch (error) {
       toast.error(`${t('listing.error-downlad')}: ` + error, {
            position: 'bottom-left',
          });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [userId]);

  const handleDelete = async (id: string) => {
    if (!confirm(`${t('listing.delete-accept')}`)) return;

    try {
      const res = await fetch(`/api/listing/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`${t('listing.error-deleting')}`);
       toast.success(`${t('toast.success')}`, {
            position: 'bottom-left',
          });
      fetchListings();
    } catch (error) {
       toast.error(`${t('listing.error-delete')}: ` + error, {
            position: 'bottom-left',
          });
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
        toast.error(`${t('listing.error-delete')}: `, {
            position: 'bottom-left',
          });
        throw new Error(errorData.error || `${t('listing.error-updating')}`);
      }
      setEditingListing(null);
      toast.success(`${t('toast.success')}`, {
            position: 'bottom-left',
          });
      fetchListings();
    } catch (error) {
      toast.error(`${t('listing.error-delete')}: ` + error, {
            position: 'bottom-left',
          });
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">{t('listing.exchange')}</h2>

      <div className="overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap">{t('listing.title')}</TableHead>
              <TableHead className="whitespace-nowrap">{t('listing.type')}</TableHead>
              <TableHead className="whitespace-nowrap">{t('listing.contact')}</TableHead>
              <TableHead className="whitespace-nowrap">{t('listing.desc')}</TableHead>
              <TableHead className="text-right whitespace-nowrap">{t('listing.action')}</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  {t('listing.load')}
                </TableCell>
              </TableRow>
            ) : listings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                   {t('listing.empty')}
                </TableCell>
              </TableRow>
            ) : (
              listings.map((listing) => (
                <TableRow key={listing.id}>
                  <TableCell className="max-w-[160px] truncate">{listing.title}</TableCell>
                  <TableCell>{listing.type === 'BOOK' ? `${t('listing.book')}` : `${t('listing.game')}`}</TableCell>
                  <TableCell className="max-w-[160px] truncate">{listing.contact}</TableCell>
                  <TableCell className="max-w-[240px] truncate">{listing.description}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingListing(listing)}
                    >
                      {t('listing.edit-btn')}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(listing.id)}
                    >
                      {t('listing.delete')}
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
