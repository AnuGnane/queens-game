// src/app/components/GameSelectionScreen.tsx
import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const GameSelectionScreen: React.FC = () => {
  const games = [
    { id: 'queens', name: 'Advanced Queens Game', path: '/queens' },
    { id: 'murdle', name: 'Murdle Grid', path: '/murdle' },
    { id: 'quest', name: 'QUEST', path: '/quest' },
    // Add more games here as you create them
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Choose a Game</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {games.map((game) => (
              <Link key={game.id} href={game.path}>
                <Button variant="outline" className="w-full h-24 text-lg">
                  {game.name}
                </Button>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GameSelectionScreen;