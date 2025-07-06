'use client';

import React from 'react';
import {useTranslations} from 'next-intl';
import { Listing } from '../generated/prisma';

interface ListingPopupContentProps {
  listing: Listing;
}

export default function ListingPopupContent({ listing }: ListingPopupContentProps) {
  const t = useTranslations('listing');
  return (
    <div>
      <strong>{listing.title}</strong>
      <br />
     {t('type')}: {listing.type === 'BOOK' ? `${t('book')}` : listing.type === 'GAME' ? `${t('game')}` : listing.type}
      <br />
      {listing.description && (
        <>
          <em>{listing.description}</em>
          <br />
        </>
      )}
      {t('contact')}: {listing.contact}
      <br />
      {t('added')}: {new Date(listing.createdAt).toLocaleDateString()}
    </div>
  );
}