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

import EditListingModal from './EditListingModal'; // importuj modal z pliku, gdzie go zapisałeś

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

  const fetchListings = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/listing?userId=${userId}`);
      if (!res.ok) throw new Error('Błąd pobierania');
      const data = await res.json();
      setListings(data);
    } catch (error) {
      alert('Błąd pobierania listy: ' + error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [userId]);

  const handleDelete = async (id: string) => {
    if (!confirm('Na pewno chcesz usunąć to ogłoszenie?')) return;

    try {
      const res = await fetch(`/api/listing/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Błąd usuwania');
      fetchListings();
    } catch (error) {
      alert('Błąd podczas usuwania: ' + error);
    }
  };

  // Aktualizacja ogłoszenia (PATCH)
  const handleUpdate = async (updatedListing: Partial<Listing> & { id: string }) => {
    try {
      const res = await fetch(`/api/listing/${updatedListing.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedListing),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Błąd aktualizacji');
      }
      setEditingListing(null);
      fetchListings();
    } catch (error) {
      alert('Błąd podczas aktualizacji: ' + error);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Ogłoszenia wymiany</h2>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tytuł</TableHead>
            <TableHead>Typ</TableHead>
            <TableHead>Kontakt</TableHead>
            <TableHead>Opis</TableHead>
            <TableHead className="text-right">Akcje</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">
                Ładowanie...
              </TableCell>
            </TableRow>
          ) : listings.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">
                Brak ogłoszeń
              </TableCell>
            </TableRow>
          ) : (
            listings.map((listing) => (
              <TableRow key={listing.id}>
                <TableCell>{listing.title}</TableCell>
                <TableCell>{listing.type === 'BOOK' ? 'Książka' : 'Gra'}</TableCell>
                <TableCell>{listing.contact}</TableCell>
                <TableCell className="truncate max-w-xs">{listing.description}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button size="sm" variant="outline" onClick={() => setEditingListing(listing)}>
                    Edytuj
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(listing.id)}>
                    Usuń
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

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
