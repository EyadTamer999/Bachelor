"use client";

import React, { useState } from "react";
import { generateGame } from "@/utils/fetchApi";

export default function Home() {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [levels, setLevels] = useState([
    {
      level: 1,
      data: { text: "", characters: "", turns: "", challengeGoals: "" },
    },
  ]);
  const [gameId, setGameId] = useState("");

  const [warning, setWarning] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleIncrementLevel = () => {
    setCurrentLevel((prev) => {
      const newLevel = prev + 1;
      setLevels((prevLevels) => {
        if (!prevLevels.find((item) => item.level === newLevel)) {
          return [
            ...prevLevels,
            {
              level: newLevel,
              data: { text: "", characters: "", turns: "", challengeGoals: "" },
            },
          ];
        }
        return prevLevels;
      });
      return newLevel;
    });
  };

  const handleDecrementLevel = () => {
    if (currentLevel === 1) return;

    setLevels((prevLevels) => {
      if (
        prevLevels[prevLevels.length - 1].level === currentLevel &&
        Object.keys(prevLevels[prevLevels.length - 1].data).length === 0
      ) {
        return prevLevels.slice(0, -1);
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

  const deleteLevel = () => {
    setLevels((prevLevels) => {
      return prevLevels.filter((level) => level.level !== currentLevel);
    });

    setCurrentLevel((prev) => Math.max(1, prev - 1));
  };

  const handleGenerateGame = async () => {
    const incompleteLevels = levels.filter(
      (level) =>
        !level.data.text ||
        !level.data.characters ||
        !level.data.turns ||
        !level.data.challengeGoals
    );

    if (incompleteLevels.length > 0) {
      setWarning(
        `Please fill out all fields for level(s): ${incompleteLevels
          .map((level) => level.level)
          .join(", ")}`
      );
      return;
    }

    setLoading(true); // Set loading state

    // Process the updated levels with parsed characters
    const updatedLevels = levels.map((level) => {
      const { characters } = level.data;
      const { challengeGoals } = level.data;

      if (!characters || !challengeGoals) return level;

      let parsedCharacters: string[] = parseInput(characters);
      let parsedChallengeGoals: string[] = parseInput(challengeGoals);

      return {
        ...level,
        data: {
          ...level.data,
          characters: parsedCharacters,
          challengeGoals: parsedChallengeGoals,
        },
      };
    });

    // Proceed with further logic after state update
    setWarning(""); // Clear any warnings
    setGameId(await generateGame(updatedLevels)); // Pass the updated levels to generateGame)
    setSuccess("Game generated successfully!"); // Set success message
    setLoading(false); // Reset loading state
  };

  const parseInput = (plainText: string) => {
    let parsedString: string[] = [];

    const segments = plainText.split(",");

    segments.forEach((segment) => {
      segment = segment.trim();

      if (segment.includes("-")) {
        const [start, end] = segment.split("-");

        if (!start || !end) return;

        if (!isNaN(Number(start)) && !isNaN(Number(end))) {
          const startNum = Number(start);
          const endNum = Number(end);

          for (let i = startNum; i <= endNum; i++) {
            parsedString.push(i.toString());
          }
        } else if (
          start.length === 1 &&
          end.length === 1 &&
          /[A-Za-z]/.test(start) &&
          /[A-Za-z]/.test(end)
        ) {
          const startCharCode = start.charCodeAt(0);
          const endCharCode = end.charCodeAt(0);

          if (startCharCode <= endCharCode) {
            for (let i = startCharCode; i <= endCharCode; i++) {
              parsedString.push(String.fromCharCode(i));
            }
          }
        }
      } else {
        parsedString.push(segment);
      }
    });

    return parsedString;
  };

  return (
    <div className="flex flex-col items-center bg-neutral-white min-h-screen px-4 py-8 lg:px-16">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-primary bg-secondary px-6 py-4 rounded-xl shadow-lg md:text-3xl lg:px-12 lg:py-6">
          Project Title
        </h1>
      </div>

      <div className="mb-6 w-full max-w-md text-center space-y-2">
        <h2 className="bg-secondary text-neutral-white px-5 py-3 rounded-lg shadow-md text-lg font-semibold md:text-xl lg:px-8 lg:py-4">
          My Level(s): {levels.length || 1}
        </h2>

        {warning && (
          <div className="text-red-500 font-medium text-center bg-red-100 p-3 rounded-lg">
            {warning}
          </div>
        )}

        {success && (
          <div className="text-green-500 font-medium text-center bg-green-100 p-3 rounded-lg">
            {success} <br />
            <span className="text-accent-green font-semibold">
              {" "}
              Game ID: {gameId}
            </span>
            <div className="mt-4">
              <a
                href={`https://bachelor-project.itch.io/space-invaders`}
                target="_blank"
                rel="noreferrer"
                className="bg-accent-green text-neutral-white px-6 py-3 rounded-xl shadow-md hover:bg-accent-green/90 focus:ring focus:ring-accent-green/50 transition-all"
              >
                View Game
              </a>
            </div>
          </div>
        )}
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
            <label className="text-sm font-medium text-text">
              Challenge Text
            </label>
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
            <label className="text-sm font-medium text-text">Characters</label>
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

          <div className="mb-4">
            <label className="text-sm font-medium text-text">
              Challenge Goals
            </label>
            <input
              type="text"
              placeholder="Enter the possible goals: 1-10 or A,B,C or a-z"
              className="w-full px-4 py-2 border border-secondary rounded-lg bg-neutral-white text-text focus:outline-none focus:ring focus:ring-secondary/50"
              value={
                levels.find((level) => level.level === currentLevel)?.data
                  .challengeGoals || ""
              }
              onChange={(e) => handleChange("challengeGoals", e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label className="text-sm font-medium text-text">
              Number Of Turns
            </label>
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

          {currentLevel !== 1 && (
            <div className="flex justify-center">
              <button
                onClick={deleteLevel}
                className="bg-accent-green text-neutral-white px-6 py-3 rounded-xl shadow-md hover:bg-error focus:ring focus:ring-error transition-all"
              >
                Delete Level
              </button>
            </div>
          )}
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
          className={`bg-accent-green text-neutral-white px-6 py-3 rounded-xl shadow-md hover:bg-accent-green/90 focus:ring focus:ring-accent-green/50 transition-all ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Generating..." : "Generate Game"}
        </button>
      </div>
    </div>
  );
}
