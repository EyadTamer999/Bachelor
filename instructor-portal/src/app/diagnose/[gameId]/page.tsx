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
  const [loading, setLoading] = useState<boolean>(true);

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

  const handleAddMarker = (marker: MarkerType) =>
    setMarkers([...markers, marker]);
  const handleClearMarkers = () => setMarkers([]);
  const handleUndoMarker = () => setMarkers(markers.slice(0, -1));
  const handleLevelSubmit = () => console.log("Submitting markers:", markers);

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
        <CharacterDisplay character={character} />
        <div className="flex flex-col w-full lg:w-1/2 gap-4">
          <LevelInfo dialog={currentDialog} extraInfo={currentExtraInfo} />
          <ImageMarkerSection
            image={currentImage}
            markers={markers}
            onAddMarker={handleAddMarker}
          />
          <ControlButtons
            markers={markers}
            onClear={handleClearMarkers}
            onUndo={handleUndoMarker}
            onSubmit={handleLevelSubmit}
            onNext={() => {
              const nextLevel = currentLevel + 1;
              if (nextLevel < diagnoseGame.levels.length) {
                updateCurrentLevelData(
                  nextLevel,
                  diagnoseGame.levels[nextLevel]
                );
              }
            }}
            hasNext={currentLevel + 1 < diagnoseGame.levels.length}
          />
        </div>
      </div>
    </div>
  );
}
