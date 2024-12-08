"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getDiagnoseGame } from "@/utils/fetchApi";

export default function DiagnoseGame() {
  const { gameId } = useParams();

  // State for the fetched game data
  const [diagnoseGame, setDiagnoseGame] = useState({
    levels: [],
  });

  // State for the current level and its associated data
  const [currentLevel, setCurrentLevel] = useState(0); // Start at level 0 (index)
  const [currentDialog, setCurrentDialog] = useState("");
  const [currentExtraInfo, setCurrentExtraInfo] = useState("");
  const [currentImage, setCurrentImage] = useState({ src: "", markers: [] });

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const data = await getDiagnoseGame(gameId);
        console.log("Fetched Data:", data); // Debugging log

        setDiagnoseGame(data);

        // Ensure levels array exists and contains data
        if (data?.levels?.length > 0) {
          updateCurrentLevelData(0, data.levels[0]); // Initialize with the first level
        } else {
          console.warn("No levels found in game data");
        }
      } catch (error) {
        console.error("Error fetching diagnose game data:", error);
      }
    };

    fetchGame();
  }, [gameId]);

  const updateCurrentLevelData = (levelIndex: any, levelData: any) => {
    console.log("Updating level data:", levelData); // Debugging log
    setCurrentLevel(levelIndex);
    setCurrentDialog(levelData.data.dialog || "Dialog not available");
    setCurrentExtraInfo(levelData.data.extraInfo || "No extra info available");
    setCurrentImage(levelData.data.img || { src: "", markers: [] });
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Level: {currentLevel + 1}</h1>
      </div>
      <div className="flex flex-col lg:flex-row gap-4 p-4">
        {/* Character Container */}
        <div className="flex flex-col w-full lg:w-1/2 bg-gray-100 p-4 rounded-lg shadow-md">
          <div className="text-center mb-4">
            <h1 className="text-xl font-bold">Character</h1>
          </div>
          <div className="flex justify-center">
            <img
              // TODO change to random character image
              src={"https://placehold.co/600x400"}
              alt="character"
              className="w-full h-auto max-w-sm rounded-lg"
            />
          </div>
        </div>

        {/* Information and Dialog Container */}
        <div className="flex flex-col w-full lg:w-1/2 gap-4">
          {/* Dialog Section */}
          <div className="flex flex-col bg-white p-4 rounded-lg shadow-md">
            <div className="text-center mb-4">
              <h1 className="text-xl font-bold">Dialog</h1>
            </div>
            <div className="bg-gray-50 p-4 rounded-md">
              <p>{currentDialog}</p>
            </div>
          </div>

          {/* Extra Info Section */}
          <div className="flex flex-col bg-white p-4 rounded-lg shadow-md">
            <div className="text-center mb-4">
              <h1 className="text-xl font-bold">Extra Info/Patient Data</h1>
            </div>
            <div className="bg-gray-50 p-4 rounded-md">
              <p>{currentExtraInfo}</p>
            </div>
          </div>

          {/* Image Section */}
          <div className="flex flex-col bg-white p-4 rounded-lg shadow-md">
            <div className="text-center mb-4">
              <h1 className="text-xl font-bold">Image</h1>
            </div>
            <div className="flex justify-center">
              {/* TODO change to image marker */}
              <img
                src={currentImage.src || "https://placehold.co/600x400"}
                alt="diagnose"
                className="w-full h-auto max-w-sm rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col w-full lg:w-1/2 gap-4 bg-gray-100 p-4 rounded-lg shadow-md">
        {/* Submit Button */}
        <button className="bg-blue-500 text-white p-4 rounded-lg shadow-md">
          Submit
        </button>

        {/* Next Button */}
        <button
          className="bg-green-500 text-white p-4 rounded-lg shadow-md"
          onClick={() => {
            const nextLevelIndex = currentLevel + 1;
            if (nextLevelIndex < diagnoseGame.levels.length) {
              updateCurrentLevelData(
                nextLevelIndex,
                diagnoseGame.levels[nextLevelIndex]
              );
            } else {
              console.warn("No more levels available");
            }
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
}
