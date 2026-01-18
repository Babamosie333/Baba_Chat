// src/app/layout.tsx
import { Metadata } from 'next';

// 1. Keep your metadata here
export const metadata: Metadata = {
  metadataBase: new URL('https://baba-chat.onrender.com'),
  title: 'Baba Chat',
  description: 'Real-time chat application',
  openGraph: {
    images: [{ url: '/og-image.png' }],
  },
};

// 2. THIS IS THE FIX: You MUST have "export default" here
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
