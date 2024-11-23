"use client";

import React, { useState } from "react";

export default function Home() {
  // State for the current level
  const [currentLevel, setCurrentLevel] = useState(1);

  const [levels, setLevels] = useState([
    { level: 1, data: { text: "", characters: "", turns: 0 } },
  ]);

  // Function to handle the increment of the level
  const handleIncrementLevel = () => {
    setCurrentLevel((prev) => {
      const newLevel = prev + 1;

      // Use the latest state of levels to avoid adding duplicates
      setLevels((prevLevels: any) => {
        // Check if the new level exists before adding it
        if (!prevLevels.find((item: any) => item.level === newLevel)) {
          return [
            ...prevLevels,
            {
              level: newLevel,
              data: {}, // Initialize empty data for the new level
            },
          ];
        }
        return prevLevels; // If it exists, just return the current state
      });

      return newLevel;
    });
  };

  const handleDecrementLevel = () => {
    if (currentLevel === 1) return;

    setLevels((prevLevels) => {
      // Remove the last level if data is empty
      if (Object.keys(prevLevels[prevLevels.length - 1].data).length === 0) {
        return prevLevels.slice(0, -1); // Remove the last level if data is empty
      }
      return prevLevels;
    });

    setCurrentLevel((prev) => prev - 1);
  };

  const handleChange = (key: string, value: string) => {
    setLevels((prevLevels) => {
      return prevLevels.map((level) => {
        if (level.level === currentLevel) {
          return {
            ...level,
            data: {
              ...level.data,
              [key]: value,
            },
          };
        }
        return level;
      });
    });
  };

  const handleGenerateGame = () => {
    console.log(levels);
  };

  return (
    <div className="flex flex-col items-center bg-neutral-white min-h-screen px-4 py-8 lg:px-16">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-primary bg-secondary px-6 py-4 rounded-xl shadow-lg md:text-3xl lg:px-12 lg:py-6">
          Project Title
        </h1>
      </div>

      <div className="mb-6 w-full max-w-md text-center">
        <h2 className="bg-secondary text-neutral-white px-5 py-3 rounded-lg shadow-md text-lg font-semibold md:text-xl lg:px-8 lg:py-4">
          My Level(s): {levels.length || 1}
        </h2>
      </div>

      <div className="flex items-center w-full justify-center space-x-4">
        <div>
          <button
            onClick={handleDecrementLevel}
            className="bg-accent-orange text-neutral-white px-3 py-3 rounded-xl shadow-md hover:bg-accent-orange/90 focus:ring focus:ring-accent-orange/50 transition-all md:px-10 md:py-4"
          >
            ⬅️
          </button>
        </div>

        <div className="bg-neutral-gray rounded-2xl p-6 w-full max-w-md shadow-md">
          <div className="mb-4">
            <h3 className="text-center text-primary font-semibold text-xl md:text-2xl">
              Level {currentLevel}
            </h3>
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-text">
                Challenge Text
              </label>
            </div>
            <input
              type="text"
              placeholder="e.g., Convert To Binary"
              className="w-full px-4 py-2 border border-secondary rounded-lg bg-neutral-white text-text focus:outline-none focus:ring focus:ring-secondary/50"
              value={
                levels.find((level) => level.level === currentLevel)?.data
                  .text || ""
              }
              onChange={(e) => handleChange("text", e.target.value)}
            />
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-text">
                Characters
              </label>
            </div>
            <input
              type="text"
              placeholder="1-10 or A,B,C or a-z"
              className="w-full px-4 py-2 border border-secondary rounded-lg bg-neutral-white text-text focus:outline-none focus:ring focus:ring-secondary/50"
              value={
                levels.find((level) => level.level === currentLevel)?.data
                  .characters || ""
              }
              onChange={(e) => handleChange("characters", e.target.value)}
            />
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-text">
                Number Of Turns
              </label>
            </div>
            <input
              type="text"
              placeholder="Enter an odd number of turns"
              className="w-full px-4 py-2 border border-secondary rounded-lg bg-neutral-white text-text focus:outline-none focus:ring focus:ring-secondary/50"
              value={
                levels.find((level) => level.level === currentLevel)?.data
                  .turns || ""
              }
              onChange={(e) => handleChange("turns", e.target.value)}
            />
          </div>

          {/* Delete Level Button */}
          <div className="flex justify-center">
            <button className="bg-accent-green text-neutral-white px-6 py-3 rounded-xl shadow-md hover:bg-error focus:ring focus:ring-error transition-all">
              Delete Level
            </button>
          </div>
        </div>

        <div>
          <button
            onClick={handleIncrementLevel}
            className="bg-accent-orange text-neutral-white px-3 py-3 rounded-xl shadow-md hover:bg-accent-orange/90 focus:ring focus:ring-accent-orange/50 transition-all md:px-10 md:py-4"
          >
            {currentLevel === levels.length ? "➕" : "➡️"}
          </button>
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={handleGenerateGame}
          className="bg-accent-orange text-neutral-white px-8 py-3 rounded-xl shadow-md hover:bg-accent-orange/90 focus:ring focus:ring-accent-orange/50 transition-all md:px-10 md:py-4"
        >
          Generate Game
        </button>
      </div>
    </div>
  );
}
