"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getDiagnoseGame } from "@/utils/fetchApi";
import CharacterDisplay from "./CharacterDisplay";
import LevelInfo from "./LevelInfo";
import ImageMarkerSection from "./ImageMarkerSection";
import ControlButtons from "./ControlButtons";

type DiagnoseGameLevel = {
  data: {
    dialog?: string;
    extraInfo?: string;
    img?: { src: string; markers: any[] };
  };
};

type DiagnoseGameType = {
  levels: DiagnoseGameLevel[];
};

type MarkerType = {
  x: number;
  y: number;
  left: number; // Add this
  top: number; // Add this
  [key: string]: any;
};

type CharacterType = {
  name?: string;
  [key: string]: any;
};

export default function DiagnoseGame() {
  const { gameId } = useParams();
  const [diagnoseGame, setDiagnoseGame] = useState<DiagnoseGameType>({
    levels: [],
  });
  const [character, setCharacter] = useState<CharacterType>({});
  const [currentLevel, setCurrentLevel] = useState<number>(0);
  const [currentDialog, setCurrentDialog] = useState<string>("");
  const [currentExtraInfo, setCurrentExtraInfo] = useState<string>("");
  const [currentImage, setCurrentImage] = useState<{
    src: string;
    markers: MarkerType[];
  }>({
    src: "",
    markers: [],
  });
  const [markers, setMarkers] = useState<MarkerType[]>([]);
  const [markersCount, setMarkersCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<string>("");

  const [isLevelWon, setIsLevelWon] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const fetchGame = async () => {
          const data = await getDiagnoseGame(gameId);
          setDiagnoseGame(data);
          if (data?.levels?.length > 0) {
            updateCurrentLevelData(0, data.levels[0]);
          }
        };
        const fetchCharacter = async () => {
          const response = await fetch("https://randomuser.me/api/");
          const data = await response.json();
          setCharacter(data.results[0]);
        };
        await Promise.all([fetchGame(), fetchCharacter()]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [gameId]);

  const updateCurrentLevelData = (
    levelIndex: number,
    levelData: DiagnoseGameLevel
  ) => {
    setCurrentLevel(levelIndex);
    setCurrentDialog(levelData.data.dialog || "Dialog not available");
    setCurrentExtraInfo(levelData.data.extraInfo || "No extra info available");
    setCurrentImage(levelData.data.img || { src: "", markers: [] });
  };

  const handleAddMarker = (marker: MarkerType) => {
    // if markers more than the limit, return
    if (markersCount >= currentImage.markers.length) {
      setModalContent("You have reached the maximum number of markers.");
      setModalVisible(true);

      return;
    }

    setMarkers([...markers, marker]);
    setMarkersCount(markersCount + 1);
  };

  const handleClearMarkers = () => {
    setMarkers([]);
    setMarkersCount(0);
  };
  const handleUndoMarker = () => {
    setMarkers(markers.slice(0, -1));
    setMarkersCount(markersCount - 1);
  };

  const handleLevelSubmit = () => {
    const correctMarkers = currentImage.markers;
    const userMarkers = markers;

    if (!correctMarkers || correctMarkers.length === 0) {
      setModalContent("No correct markers available to validate against.");
      setModalVisible(true);
      return;
    }

    const marginOfError = 10;
    const usedUserMarkers = new Set<number>();

    // Helper function to calculate if two markers are within range
    const isWithinRange = (
      correctMarker: { left: number; top: number },
      userMarker: MarkerType
    ) => {
      const distance = Math.sqrt(
        Math.pow(correctMarker.left - (userMarker.left ?? userMarker.x), 2) +
          Math.pow(correctMarker.top - (userMarker.top ?? userMarker.y), 2)
      );
      return distance <= marginOfError;
    };

    // Iterate through all correct markers and find a unique matching user marker for each
    const allCorrect = correctMarkers.every((correctMarker) => {
      const matchingIndex = userMarkers.findIndex((userMarker, index) => {
        if (usedUserMarkers.has(index)) return false; // Skip already matched user markers
        return isWithinRange(correctMarker, userMarker);
      });

      if (matchingIndex !== -1) {
        usedUserMarkers.add(matchingIndex); // Mark this user marker as used
        return true; // Match found
      }
      return false; // No match found
    });

    // Feedback to the user
    if (allCorrect) {
      setModalContent("Correct! You found all the markers.");
      setIsLevelWon(true);
    } else {
      setModalContent("Incorrect! Please try again.");
    }

    setModalVisible(true);
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
      <h1 className="text-2xl font-bold text-center">
        Level: {currentLevel + 1}
      </h1>
      <div className="flex flex-col lg:flex-row gap-4 p-4">
        <CharacterDisplay character={character} dialog={currentDialog} />
        <div className="flex flex-col w-full lg:w-1/2 gap-4">
          <LevelInfo extraInfo={currentExtraInfo} />
          <ImageMarkerSection
            markersAllowed={currentImage.markers.length - markersCount}
            image={currentImage}
            markers={markers}
            onAddMarker={handleAddMarker}
          />
          <ControlButtons
            markers={markers}
            onClear={handleClearMarkers}
            onUndo={handleUndoMarker}
            onSubmit={handleLevelSubmit}
          />
        </div>
      </div>

      {/* Modal */}
      {modalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded-lg">
            <p>{modalContent}</p>

            {currentLevel + 1 === diagnoseGame.levels.length && isLevelWon && (
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4"
                onClick={() => window.location.reload()}
              >
                Play Again!
              </button>
            )}

            {currentLevel + 1 === diagnoseGame.levels.length && !isLevelWon && (
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4"
                onClick={() => setModalVisible(false)}
              >
                Try Again!
              </button>
            )}

            {/* don't show if game is won at last level*/}
            {currentLevel + 1 !== diagnoseGame.levels.length && (
              <div className="flex flex-row gap-4">
                {/* Close Button */}
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4"
                  onClick={() => setModalVisible(false)}
                >
                  Close
                </button>

                {/* Next Level Button */}
                {currentLevel + 1 < diagnoseGame.levels.length &&
                  isLevelWon && (
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4"
                      onClick={() => {
                        console.log("Next Level");
                        const nextLevel = currentLevel + 1;
                        if (nextLevel < diagnoseGame.levels.length) {
                          updateCurrentLevelData(
                            nextLevel,
                            diagnoseGame.levels[nextLevel]
                          );

                          handleClearMarkers();
                        }
                        setModalVisible(false);

                        setIsLevelWon(false);
                      }}
                    >
                      Next Level
                    </button>
                  )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
