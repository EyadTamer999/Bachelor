"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import spaceInvadersIcon from "@/assets/Space_Invaders_Game.jpeg";
import clickGameIcon from "@/assets/Click_Game_Icon.png";

const games = [
  {
    id: 1,
    title: "Space Invaders",
    description:
      "Challenge your students to convert decimal to binary or create chemical formulas by shooting enemies.",
    tags: ["Computer Science", "Chemistry", "Math"],
    img: spaceInvadersIcon,
    url: "/space-invaders",
  },
  {
    id: 2,
    title: "Puzzle Click Game",
    description:
      "Challenge your students to find all the hidden markers in the image.",
    tags: ["Biology", "Business/HR", "Automotive"],
    img: clickGameIcon,
    url: "/diagnose",
  },
];

export default function Home() {
  const [showGrid, setShowGrid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleButtonClick = () => {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setShowGrid(true);
    }, 600); // Matches animation duration
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      {!showGrid && (
        <div
          className={`flex flex-col items-center justify-center h-screen transition-opacity duration-600 ease-in-out ${
            isLoading ? "opacity-0" : "opacity-100"
          }`}
          aria-hidden={showGrid}
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold text-primary mb-4 text-center">
            Welcome to the Instructor Portal
          </h1>
          <p className="text-muted-foreground text-lg mb-6 text-center max-w-2xl">
            Create interactive games to engage and educate your students.
          </p>
          <Button
            onClick={handleButtonClick}
            size="lg"
            className="text-lg"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Create Game"}
          </Button>
        </div>
      )}

      {showGrid && (
        <div className="space-y-8">
          <h1 className="text-3xl font-bold text-primary text-center">
            Choose a game to create
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {games.map((game) => (
              <Card key={game.id} className="overflow-hidden">
                <Link href={game.url} className="block h-full">
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-4">
                      <Image
                        className="w-20 h-20 object-cover rounded-lg"
                        src={game.img}
                        alt={game.title}
                      />
                      <div>
                        <CardTitle>{game.title}</CardTitle>
                        <CardDescription className="mt-2">
                          {game.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {game.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
