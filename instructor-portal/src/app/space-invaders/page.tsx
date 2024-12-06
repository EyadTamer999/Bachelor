"use client";

import React, { useState } from "react";
import { generateGame } from "@/utils/fetchApi";

export default function SpaceInvaders() {
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
      <div className="mb-6 w-full max-w-md text-center space-y-2">
        <h2 className="bg-primary text-neutral-white px-5 py-3 rounded-lg shadow-md text-lg font-semibold md:text-xl lg:px-8 lg:py-4">
          My Level(s): {levels.length > 0 ? levels.length : 1}
        </h2>

        {warning && (
          <div className="text-error font-medium text-center bg-error-light p-3 rounded-lg">
            {warning}
          </div>
        )}

        {success && (
          <div className="text-accent-green font-medium text-center bg-accent-green-light p-3 rounded-lg">
            {success} <br />
            <span className="text-success font-semibold">
              Game ID: {gameId}
            </span>
            <div className="mt-4">
              <a
                href="https://bachelor-project.itch.io/space-invaders"
                target="_blank"
                rel="noreferrer"
                className="bg-success text-neutral-white px-6 py-3 rounded-xl shadow-md hover:bg-success/90 focus:ring focus:ring-success/50 transition-all"
              >
                View Game
              </a>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center w-full justify-center space-x-4">
        <button
          onClick={handleDecrementLevel}
          className="bg-secondary hover:bg-accent-green text-neutral-white px-3 py-3 rounded-xl shadow-md focus:ring focus:ring-secondary-light transition-transform md:px-10 md:py-4"
          aria-label="Decrement Level"
        >
          ⬅️
        </button>

        <div className="bg-neutral-light rounded-2xl p-6 w-full max-w-md shadow-md">
          <div className="mb-4">
            <h3 className="text-center text-primary font-semibold text-xl md:text-2xl">
              Level {currentLevel}
            </h3>
          </div>

          <div className="mb-4">
            <label className="text-sm font-medium text-neutral-dark">
              Challenge Text
            </label>
            <input
              type="text"
              placeholder="e.g., Convert To Binary"
              className="w-full px-4 py-2 border border-primary rounded-lg bg-neutral-white text-primary focus:outline-none focus:ring focus:ring-primary-light"
              value={
                levels.find((level) => level.level === currentLevel)?.data
                  ?.text || ""
              }
              onChange={(e) => handleChange("text", e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="text-sm font-medium text-neutral-dark">
              Characters
            </label>
            <input
              type="text"
              placeholder="1-10 or A,B,C or a-z"
              className="w-full px-4 py-2 border border-primary rounded-lg bg-neutral-white text-primary focus:outline-none focus:ring focus:ring-primary-light"
              value={
                levels.find((level) => level.level === currentLevel)?.data
                  ?.characters || ""
              }
              onChange={(e) => handleChange("characters", e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="text-sm font-medium text-neutral-dark">
              Challenge Goals
            </label>
            <input
              type="text"
              placeholder="Enter the possible goals: 1-10 or A,B,C or a-z"
              className="w-full px-4 py-2 border border-primary rounded-lg bg-neutral-white text-primary focus:outline-none focus:ring focus:ring-primary-light"
              value={
                levels.find((level) => level.level === currentLevel)?.data
                  ?.challengeGoals || ""
              }
              onChange={(e) => handleChange("challengeGoals", e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label className="text-sm font-medium text-neutral-dark">
              Number Of Turns
            </label>
            <input
              type="text"
              placeholder="Enter an odd number of turns"
              className="w-full px-4 py-2 border border-primary rounded-lg bg-neutral-white text-primary focus:outline-none focus:ring focus:ring-primary-light"
              value={
                levels.find((level) => level.level === currentLevel)?.data
                  ?.turns || ""
              }
              onChange={(e) => handleChange("turns", e.target.value)}
            />
          </div>

          {currentLevel !== 1 && (
            <div className="flex justify-center">
              <button
                onClick={deleteLevel}
                className="bg-error hover:bg-error-dark text-neutral-white px-6 py-3 rounded-xl shadow-md focus:ring focus:ring-error-light transition-transform"
              >
                Delete Level
              </button>
            </div>
          )}
        </div>

        <button
          onClick={handleIncrementLevel}
          className="bg-secondary hover:bg-accent-green text-neutral-white px-3 py-3 rounded-xl shadow-md focus:ring focus:ring-secondary-light transition-transform md:px-10 md:py-4"
          aria-label={
            currentLevel === levels.length ? "Add Level" : "Increment Level"
          }
        >
          {currentLevel === levels.length ? "➕" : "➡️"}
        </button>
      </div>

      <div className="mt-6">
        <button
          onClick={handleGenerateGame}
          className={`bg-accent-green text-neutral-white px-6 py-3 rounded-xl shadow-md hover:bg-accent-green-dark focus:ring focus:ring-accent-green-light transition-transform ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Game"}
        </button>
      </div>
    </div>
  );
}
