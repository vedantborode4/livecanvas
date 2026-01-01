import './globals.css';

export const metadata = {
  title: 'LiveCanvas',
  description: 'Realtime drawing canvas for ideas and collaboration',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-neutral-950 text-neutral-100 antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
