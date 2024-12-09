"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getDiagnoseGame } from "@/utils/fetchApi";

import Marker from "react-image-marker";

export default function DiagnoseGame() {
  const { gameId } = useParams();

  // State for the fetched game data
  const [diagnoseGame, setDiagnoseGame] = useState({
    levels: [],
  });

  // State for the current level and its associated data
  const [character, setCharacter] = useState({});
  const [currentLevel, setCurrentLevel] = useState(0); // Start at level 0 (index)
  const [currentDialog, setCurrentDialog] = useState("");
  const [currentExtraInfo, setCurrentExtraInfo] = useState("");
  const [currentImage, setCurrentImage] = useState({ src: "", markers: [] });

  // State for user added markers
  const [markers, setMarkers] = useState([]);

  // State for managing loading state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Start loading

        // Fetch game data
        const fetchGame = async () => {
          const data = await getDiagnoseGame(gameId);
          console.log("Fetched Game Data:", data); // Debugging log

          setDiagnoseGame(data);

          if (data?.levels?.length > 0) {
            updateCurrentLevelData(0, data.levels[0]); // Initialize with the first level
          } else {
            console.warn("No levels found in game data");
          }
        };

        // Fetch character data
        const fetchCharacter = async () => {
          const response = await fetch("https://randomuser.me/api/");
          const data = await response.json();
          console.log("Fetched Character Data:", data); // Debugging log
          setCharacter(data.results[0]);
        };

        // Wait for both fetch operations to complete
        await Promise.all([fetchGame(), fetchCharacter()]);
      } catch (error) {
        console.error("Error during data fetching:", error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchData();
  }, [gameId]);

  const handleLevelSubmit = () => {
    // TODO: Implement logic for checking the markers for the current level
    console.log("Submitting markers:", markers); // Debugging log
    console.log("Level data:", diagnoseGame.levels[currentLevel]); // Debugging log
  };

  const handleAddMarker = (marker: any) => {
    console.log("Adding marker:", marker); // Debugging log
    setMarkers([...markers, marker]);
  };

  const updateCurrentLevelData = (levelIndex: any, levelData: any) => {
    console.log("Updating level data:", levelData); // Debugging log
    setCurrentLevel(levelIndex);
    setCurrentDialog(levelData.data.dialog || "Dialog not available");
    setCurrentExtraInfo(levelData.data.extraInfo || "No extra info available");
    setCurrentImage(levelData.data.img || { src: "", markers: [] });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl font-bold">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Level: {currentLevel + 1}</h1>
      </div>
      <div className="flex flex-col lg:flex-row gap-4 p-4">
        {/* Character Container */}
        <div className="flex flex-col w-full lg:w-1/2 bg-gray-100 p-4 rounded-lg shadow-md">
          <div className="text-center mb-4">
            <h1 className="text-xl font-bold">
              Name: {character.name?.first + " " + character.name?.last}
            </h1>
          </div>
          <div className="flex justify-center">
            <img
              src={character.picture?.large}
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
              <Marker
                src={currentImage.src}
                onAddMarker={handleAddMarker}
                markers={markers || []}
                // markers={currentImage.markers || []}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-row justify-center gap-4 bg-gray-100 p-4 rounded-lg shadow-md">
            {/* Clear Button */}
            <button
              className="bg-red-500 text-white p-4 rounded-lg shadow-md duration-300 hover:bg-red-600"
              onClick={() => setMarkers([])}
            >
              Clear
            </button>

            {/* Undo Button */}
            <button
              className="bg-yellow-500 text-white p-4 rounded-lg shadow-md duration-300 hover:bg-yellow-600"
              onClick={() => {
                const newMarkers = [...markers];
                newMarkers.pop();
                setMarkers(newMarkers);
              }}
            >
              Undo
            </button>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col w-full lg:w-1/2 gap-4 bg-gray-100 p-4 rounded-lg shadow-md">
        {/* Submit Button */}
        {/* disable if there are no markers */}
        <button
          className={`bg-blue-500 text-white p-4 rounded-lg shadow-md ${
            markers.length === 0
              ? "cursor-not-allowed bg-gray-500"
              : "duration-300 hover:bg-blue-600"
          }`}
          disabled={markers.length === 0}
          onClick={handleLevelSubmit}
        >
          Submit
        </button>

        {/* Next Button */}
        {currentLevel + 1 < diagnoseGame.levels.length ? (
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
        ) : null}
      </div>
    </div>
  );
}
