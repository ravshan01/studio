
import type { ReactNode } from 'react';
import { Header } from "@/components/layout/header";

export default function FavoritesLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header showSearch={false} /> {/* Search might not be relevant on favorites page */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
