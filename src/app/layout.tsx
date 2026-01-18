// src/app/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  // Required: Replace with your actual live URL
  metadataBase: new URL('https://baba-chat.onrender.com'), 
  title: 'Baba Chat',
  description: 'Real-time chat application',
  openGraph: {
    images: [
      {
        url: '/og-image.png', // This looks in your public folder
        width: 1200,
        height: 630,
        alt: 'Baba Chat Preview',
      },
    ],
  },
};
