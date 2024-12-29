"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import spaceInvadersIcon from "@/assets/Space_Invaders_Game.jpeg";
import clickGameIcon from "@/assets/Click_Game_Icon.png";

export default function Home() {
  const [showGrid, setShowGrid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // The games json
  const games = [
    {
      id: 1,
      title: "Space Invaders",
      description:
        "Challenge your students to convert decimal to binary or create chemcial forumlas by shooting enemies.",
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

  const handleButtonClick = () => {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setShowGrid(true);
    }, 600); // Matches animation duration
  };

  return (
    <div className="min-h-screen bg-neutral-white text-text">
      <div className="container mx-auto">
        {/* Welcome Section */}
        {!showGrid && (
          <div
            className={`flex flex-col items-center justify-center h-screen transition-opacity duration-600 ease-in-out ${
              isLoading ? "animate-fadeOut" : "animate-fadeIn"
            }`}
            aria-hidden={showGrid}
          >
            <h1 className="text-5xl font-extrabold text-primary mb-4 text-center">
              Welcome to the Instructor Portal
            </h1>
            <p className="text-neutral-gray text-lg mb-6 text-center">
              Create interactive games to engage and educate your students.
            </p>
            <button
              onClick={handleButtonClick}
              className="bg-secondary hover:bg-accent-green text-neutral-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-300 hover:scale-105"
              aria-label="Click to create a game"
            >
              {isLoading ? "Loading..." : "Create Game"}
            </button>
          </div>
        )}

        {/* Grid Section */}
        {showGrid && (
          <div className="flex items-center justify-center flex-col">
            <h1 className="text-3xl font-bold text-primary mt-2 mb-6 text-center">
              Choose a game to create
            </h1>

            <div
              className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-8 transition-all duration-600 ease-in-out ${
                showGrid ? "animate-fadeIn" : "animate-fadeOut"
              }`}
            >
              {games.map((game, index) => (
                // Game Card
                <Link
                  key={index}
                  href={game.url}
                  className="bg-neutral-white rounded-lg shadow-md p-6 flex items-center justify-center text-lg font-semibold text-primary hover:shadow-lg hover:scale-105 transition-transform duration-300"
                >
                  <div className="flex items-center">
                    <Image
                      className="w-20 h-20 object-cover rounded-lg mr-4"
                      src={game.img}
                      alt={game.title}
                    />
                    <div>
                      <h2 className="text-xl font-bold mb-2">{game.title}</h2>
                      <p className="text-neutral-gray text-sm">
                        {game.description}
                      </p>
                      <div className="flex gap-2 mt-2">
                        {game.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="bg-secondary text-neutral-white px-2 py-1 rounded-md text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
