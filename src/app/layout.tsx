import './globals.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://baba-chat.onrender.com'),
  title: 'Baba Chat',
  description: 'Professional real-time chat application',
  openGraph: {
    images: ['/og-image.png'],
  },
};

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
