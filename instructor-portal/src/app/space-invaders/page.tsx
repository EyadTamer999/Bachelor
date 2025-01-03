"use client";

import React, { useState } from "react";
import { generateSpaceInvaderGame } from "@/utils/fetchApi";
import Tooltip from "@/app/shared/ToolTip";
import GameId from "@/app/shared/GameId";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AlertCircle, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SpaceInvaders() {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [levels, setLevels] = useState([
    {
      level: 1,
      data: {
        text: "",
        characters: "",
        turns: "",
        challengeGoals: "",
        conversionGame: "",
      },
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
              data: {
                text: "",
                characters: "",
                turns: "",
                challengeGoals: "",
                conversionGame: "",
              },
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
    setGameId(await generateSpaceInvaderGame(updatedLevels)); // Pass the updated levels to generateGame)
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
    <div className="container mx-auto px-4 py-8 space-y-8">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center justify-center space-x-2">
            <span>My Level(s): {levels.length}</span>
            <Tooltip content="The Level(s) you have created for the game.">
              <AlertCircle className="h-5 w-5" />
            </Tooltip>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {warning && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{warning}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert variant="default" className="mb-4">
              <AlertDescription>
                {success} <br />
                <GameId
                  gameId={gameId}
                  gameLink={"https://bachelor-project.itch.io/space-invaders"}
                />
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-center space-x-4">
        <Tooltip content="Go to previous level">
          <Button
            variant="outline"
            size="icon"
            disabled={currentLevel === 1}
            onClick={handleDecrementLevel}
            aria-label="Decrement Level"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Tooltip>

        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="flex items-center justify-center space-x-2">
              <span>Current Level: {currentLevel}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="text" className="flex items-center space-x-2">
                <span>Challenge Text</span>
                <Tooltip content="The objective text that will be displayed in the game">
                  <AlertCircle className="h-4 w-4" />
                </Tooltip>
              </Label>
              <Textarea
                id="text"
                placeholder="e.g., Convert To Binary"
                value={
                  levels.find((level) => level.level === currentLevel)?.data
                    .text || ""
                }
                onChange={(e) => handleChange("text", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="conversionGame"
                className="flex items-center space-x-2"
              >
                <span>Conversion Game</span>
                <Tooltip content="The conversion game that will be displayed in the game">
                  <AlertCircle className="h-4 w-4" />
                </Tooltip>
              </Label>
              <Select
                value={
                  levels.find((level) => level.level === currentLevel)?.data
                    .conversionGame || "none"
                }
                onValueChange={(value) => handleChange("conversionGame", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select conversion game" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="binary">Binary</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                *Currently only binary conversion is supported
              </p>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="characters"
                className="flex items-center space-x-2"
              >
                <span>Characters</span>
                <Tooltip content="The letters/numbers that will be displayed in the game. Use a comma to separate multiple characters. You can also use a range (e.g., 1-10 or A-Z)">
                  <AlertCircle className="h-4 w-4" />
                </Tooltip>
              </Label>
              <Input
                id="characters"
                placeholder="1-10 or A,B,C or a-z"
                value={
                  levels.find((level) => level.level === currentLevel)?.data
                    .characters || ""
                }
                onChange={(e) => handleChange("characters", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="challengeGoals"
                className="flex items-center space-x-2"
              >
                <span>Challenge Goals</span>
                <Tooltip content="The possible answers for the challenge. Use a comma to separate multiple goals. You can also use a range (e.g., 1-10 or A-Z)">
                  <AlertCircle className="h-4 w-4" />
                </Tooltip>
              </Label>
              <Input
                id="challengeGoals"
                placeholder="Enter the possible goals: 1-10 or A,B,C or a-z"
                value={
                  levels.find((level) => level.level === currentLevel)?.data
                    .challengeGoals || ""
                }
                onChange={(e) => handleChange("challengeGoals", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="turns" className="flex items-center space-x-2">
                <span>Number Of Turns</span>
                <Tooltip content="The number of challenges the player has to complete within level, must be an odd number: 1, 3, 5, 7, etc.">
                  <AlertCircle className="h-4 w-4" />
                </Tooltip>
              </Label>
              <Input
                id="turns"
                placeholder="Enter an odd number of turns"
                value={
                  levels.find((level) => level.level === currentLevel)?.data
                    .turns || ""
                }
                onChange={(e) => handleChange("turns", e.target.value)}
              />
            </div>

            {currentLevel !== 1 && (
              <div className="flex justify-center">
                <Button variant="destructive" onClick={deleteLevel}>
                  Delete Level
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Tooltip content="Go to next level">
          <Button
            variant="outline"
            size="icon"
            onClick={handleIncrementLevel}
            aria-label={
              currentLevel === levels.length ? "Add Level" : "Increment Level"
            }
          >
            {currentLevel === levels.length ? (
              <Plus className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </Tooltip>
      </div>

      <div className="flex justify-center">
        <Button onClick={handleGenerateGame} disabled={loading}>
          {loading ? "Generating..." : "Generate Game"}
        </Button>
      </div>
    </div>
  );
}
