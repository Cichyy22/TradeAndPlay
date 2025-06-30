'use client';

import React from 'react';
import { Listing } from '@prisma/client';

interface ListingPopupContentProps {
  listing: Listing;
}

export default function ListingPopupContent({ listing }: ListingPopupContentProps) {
  return (
    <div>
      <strong>{listing.title}</strong>
      <br />
      Typ: {listing.type}
      <br />
      {listing.description && (
        <>
          <em>{listing.description}</em>
          <br />
        </>
      )}
      Dodano: {new Date(listing.createdAt).toLocaleDateString()}
    </div>
  );
}