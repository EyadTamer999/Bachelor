"use client";

import React, { useEffect, useState } from "react";
import { generateDiagnoseGame, uploadImage } from "@/utils/fetchApi"; // Make sure this is properly implemented.
import Marker from "react-image-marker";
import Tooltip from "@/app/shared/ToolTip";
import GameId from "@/app/shared/GameId";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Plus,
  RefreshCw,
  Trash2,
  Undo,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Slider } from "@/components/ui/slider";
import introjs from "intro.js";
import "intro.js/introjs.css";

export default function DiagnoseCreator() {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [levels, setLevels] = useState([
    {
      level: 1,
      data: {
        dialog: "",
        extraInfo: "",
        img: { src: "", markers: [] },
      },
    },
  ]);

  const [gameId, setGameId] = useState("");
  const [warning, setWarning] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [imgFiles, setImgFiles] = useState<any[]>([]);
  const [marginSize, setMarginSize] = useState(25);

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
                dialog: "",
                extraInfo: "",
                img: { src: "", markers: [] },
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

  const deleteLevel = () => {
    setLevels((prevLevels) => {
      return prevLevels.filter((level) => level.level !== currentLevel);
    });

    setCurrentLevel((prev) => Math.max(1, prev - 1));
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

  const handleAddMarker = (marker: any) => {
    console.log(marker);
    // if a marker check if the top left corner is within the image and not a negative value
    if (
      marker.top < 0 ||
      marker.left < 0 ||
      marker.top > 87 ||
      marker.left > 87
    ) {
      setWarning("Marker should be within the image");
      return;
    }

    setLevels((prevLevels: any) => {
      return prevLevels.map((level: any) => {
        if (level.level === currentLevel) {
          return {
            ...level,
            data: {
              ...level.data,
              img: {
                ...level.data.img,
                markers: [
                  ...level.data.img.markers,
                  { ...marker, marginSize: marginSize },
                ],
              },
            },
          };
        }
        return level;
      });
    });
  };

  const handleResetMarkers = () => {
    setLevels((prevLevels: any) => {
      return prevLevels.map((level: any) => {
        if (level.level === currentLevel) {
          return {
            ...level,
            data: {
              ...level.data,
              img: {
                ...level.data.img,
                markers: [],
              },
            },
          };
        }
        return level;
      });
    });
  };

  const handleUndoMarker = () => {
    setLevels((prevLevels: any) => {
      return prevLevels.map((level: any) => {
        if (level.level === currentLevel) {
          return {
            ...level,
            data: {
              ...level.data,
              img: {
                ...level.data.img,
                markers: level.data.img.markers.slice(0, -1),
              },
            },
          };
        }
        return level;
      });
    });
  };

  const deleteImage = () => {
    setLevels((prevLevels: any) => {
      return prevLevels.map((level: any) => {
        if (level.level === currentLevel) {
          return {
            ...level,
            data: {
              ...level.data,
              img: {
                src: "",
                markers: [],
              },
            },
          };
        }
        return level;
      });
    });
  };

  const handleSetImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileInput = e.target;
    const file = fileInput.files?.[0];
    if (!file) return;

    // Generate a unique Blob URL
    const uniqueBlobUrl = URL.createObjectURL(
      new File([file], `${Date.now()}-${file.name}`, { type: file.type })
    );

    setLevels((prevLevels) =>
      prevLevels.map((level) => {
        if (level.level === currentLevel) {
          return {
            ...level,
            data: {
              ...level.data,
              img: {
                ...level.data.img,
                src: uniqueBlobUrl,
              },
            },
          };
        }
        return level;
      })
    );

    // Resize and process the image
    const img = new Image();
    img.src = uniqueBlobUrl;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 400;
      canvas.height = 400;

      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0, 400, 400);

      ctx?.canvas.toBlob(
        (resizedBlob) => {
          if (!resizedBlob) return;

          // Use the original MIME type of the file
          const resizedFile = new File(
            [resizedBlob],
            `${Date.now()}-${file.name}`,
            {
              type: file.type,
            }
          );
          const resizedBlobUrl = URL.createObjectURL(resizedFile);

          setLevels((prevLevels) =>
            prevLevels.map((level) => {
              if (level.level === currentLevel) {
                return {
                  ...level,
                  data: {
                    ...level.data,
                    img: {
                      ...level.data.img,
                      src: resizedBlobUrl,
                    },
                  },
                };
              }
              return level;
            })
          );

          setImgFiles((prevFiles) => [
            ...prevFiles,
            { level: currentLevel, file: resizedFile },
          ]);

          // Revoke the original Blob URL to free memory
          URL.revokeObjectURL(uniqueBlobUrl);
        },
        file.type, // Preserve the original MIME type
        1
      );
    };

    // Reset the file input to allow selecting the same file again
    fileInput.value = "";
  };

  const handleGenerateGame = async () => {
    try {
      // Set loading state
      setLoading(true);

      // Validate the levels
      validateLevels();

      // Iterate through the image files and upload each to the cloud
      const updatedLevels = await Promise.all(
        levels.map(async (level: any) => {
          if (level.data.img?.src?.startsWith("blob:")) {
            const fileToUpload = imgFiles.find(
              (imgFile) => imgFile.level === level.level
            )?.file;

            if (fileToUpload) {
              // Upload the image to the cloud and get the server URL
              const uploadedUrl = await uploadImage(fileToUpload);

              // Replace the blob URL with the server URL
              return {
                ...level,
                data: {
                  ...level.data,
                  img: {
                    ...level.data.img,
                    src: uploadedUrl,
                  },
                },
              };
            }
          }
          return level; // No changes if not a blob URL
        })
      );

      // Update levels with the new URLs
      setLevels(updatedLevels);

      // Push the updated levels to the database
      let gameId = await generateDiagnoseGame(updatedLevels); // Assume this function handles the database logic
      setSuccess("Game generated successfully!");
      setGameId(gameId);
    } catch (error: any) {
      setWarning("An error occurred. Please try again.\n " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const validateLevels = () => {
    const invalidLevels = levels.filter(
      (level) =>
        !level.data.dialog ||
        !level.data.extraInfo ||
        !level.data.img.src ||
        level.data.img.markers.length === 0
    );

    if (invalidLevels.length > 0) {
      setWarning("Please fill in all fields and upload images for each level.");
      throw new Error("Invalid levels");
    }
  };

  const [hoverPosition, setHoverPosition] = useState({ top: "0%", left: "0%" });

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setHoverPosition({
      top: `${((e.clientY - rect.top) / rect.height) * 100}%`,

      left: `${((e.clientX - rect.left) / rect.width) * 100}%`,
    });
  };

  useEffect(() => {
    showHints();
  }, []);

  const showHints = () => {
    introjs()
      .setOptions({
        steps: [
          {
            intro: "Welcome to the Click Puzzle Game!",
          },
          {
            intro:
              "The goal is to create a game where the student will click on the correct answer based on the dialog text and the image with markers you provide.",
          },
          {
            element: "#my_levels",
            title: "Levels",
            intro:
              "This is where you can see the levels you have created, each level consists of a dialog text, extra information, and an image with markers.",
          },
          {
            element: "#current_level",
            title: "Current Level",
            intro:
              "This is the current level you are working on, you can add dialog text, extra information, and an image with markers.",
          },
          {
            element: "#dialog",
            title: "Dialog Text",
            intro:
              "Enter the dialog text for the character in this level, this will be displayed to the student as the character's speaking.<img src='https://cloud.appwrite.io/v1/storage/buckets/675319790008ed3cf795/files/67782cd9003661c143c8/view?project=6753194800246da32e87&project=6753194800246da32e87&mode=admin' />",
          },
          {
            element: "#extra_info",
            intro: "Enter extra information for the character or the level.",
          },
          {
            element: "#image_upload",
            intro:
              "Upload an image that you will base on the answers, if using an iPhone please upload image from files or using camera.",
          },
          {
            intro:
              "Adjust the marker size as the border limits of the correct answer.",
          },
          {
            intro:
              "Click the button to generate the game with the levels you have created.",
          },
          {
            element: "#decrement_level",
            title: "Previous Level",
            intro:
              "Click here to go to the previous level, you can go back to the previous level to make changes.",
          },
          {
            element: "#increment_level",
            title: "Add Level",
            intro:
              "Click here to add a new level or navigate to the next level, you can add as many levels as you want.",
          },
          {
            element: "#delete_level",
            title: "Delete Level",
            intro: "Click here to delete the current level.",
          },
          {
            element: "#generate_button",
            title: "Generate Game",
            intro:
              "Click here to generate the game with the levels you have created.",
          },
          {
            intro:
              "Once you have generated the game, you will see the game ID, a link to the game, and a QR code to the game.You can share these with your students to play the game. <img src='https://cloud.appwrite.io/v1/storage/buckets/675319790008ed3cf795/files/67782fed00324732e3dc/view?project=6753194800246da32e87&project=6753194800246da32e87&mode=admin' />",
          },
          {
            element: "#help",
            title: "Help",
            intro: "Click here to view these hints again at any time.",
          },
        ],
      })
      .start();
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <Card className="w-full max-w-2xl mx-auto">
        {/* Help button */}
        <div className="flex justify-end">
          <Tooltip content="Help">
            <Button id="help" onClick={showHints} variant="secondary">
              ?
            </Button>
          </Tooltip>
        </div>
        <CardHeader>
          <CardTitle
            id="my_levels"
            className="flex items-center justify-center space-x-2"
          >
            <span>My Level(s): {levels.length}</span>
            <Tooltip content="The Level(s) you have created for the game.">
              <AlertCircle className="h-5 w-5" />
            </Tooltip>
          </CardTitle>
        </CardHeader>
      </Card>

      <div className="flex items-center justify-center space-x-4">
        <Tooltip content="Go to previous level">
          <Button
            id="decrement_level"
            disabled={currentLevel === 1}
            variant="outline"
            size="icon"
            onClick={handleDecrementLevel}
            aria-label="Decrement Level"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Tooltip>

        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle
              id="current_level"
              className="flex items-center justify-center space-x-2"
            >
              <span>Level {currentLevel}</span>
              <Tooltip content="The current level you are working on">
                <AlertCircle className="h-5 w-5" />
              </Tooltip>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div id="dialog" className="space-y-2">
              <Label htmlFor="dialog" className="flex items-center space-x-2">
                <span>Dialog Text</span>
                <Tooltip content="The dialog text for the character in the level">
                  <AlertCircle className="h-4 w-4" />
                </Tooltip>
              </Label>
              <Textarea
                id="dialog"
                placeholder="Enter dialog text for the character"
                value={
                  levels.find((level) => level.level === currentLevel)?.data
                    .dialog || ""
                }
                onChange={(e) => handleChange("dialog", e.target.value)}
              />
            </div>

            <div id="extra_info" className="space-y-2">
              <Label
                htmlFor="extraInfo"
                className="flex items-center space-x-2"
              >
                <span>Extra Info</span>
                <Tooltip content="Extra information for the character or the level">
                  <AlertCircle className="h-4 w-4" />
                </Tooltip>
              </Label>
              <Textarea
                id="extraInfo"
                placeholder="Enter extra information for the character/character's issue"
                value={
                  levels.find((level) => level.level === currentLevel)?.data
                    .extraInfo || ""
                }
                onChange={(e) => handleChange("extraInfo", e.target.value)}
              />
            </div>

            <div id="image_upload" className="space-y-2">
              <Label htmlFor="image" className="flex items-center space-x-2">
                <span>Upload Image</span>
                <Tooltip content="Upload an image that you will base on the answers, if using an iPhone please upload image from files or using camera">
                  <AlertCircle className="h-4 w-4" />
                </Tooltip>
              </Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleSetImage}
              />
            </div>

            {levels.find((level) => level.level === currentLevel)?.data?.img
              ?.src && (
              <div className="space-y-2 mb-4">
                <label className="text-sm font-medium text-neutral-dark">
                  Image Preview
                </label>
                <div className="relative w-full h-full">
                  <div
                    onMouseMove={handleMouseEnter}
                    className="relative mx-auto"
                    style={{
                      width: "400px",
                      height: "400px",
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    <Marker
                      markers={
                        levels.find((level) => level.level === currentLevel)
                          ?.data?.img?.markers || []
                      }
                      onAddMarker={handleAddMarker}
                      src={
                        levels.find((level) => level.level === currentLevel)
                          ?.data?.img?.src || ""
                      }
                      markerComponent={(marker: any) => (
                        <div
                          style={{
                            position: "absolute",
                            top: hoverPosition.top,
                            left: hoverPosition.left,
                            // borderRadius: "50%",
                            width: `${marker.marginSize * 2}px`,
                            height: `${marker.marginSize * 2}px`,
                            border: "2px dashed red", // Visualize the marker area
                            pointerEvents: "none", // Ensure it doesn't block other elements
                          }}
                        />
                      )}
                    />
                    {/* Show placeholder on hover */}
                    <div
                      style={{
                        position: "absolute",
                        top: hoverPosition.top,
                        left: hoverPosition.left,
                        // borderRadius: "50%",
                        width: `${marginSize * 2}px`,
                        height: `${marginSize * 2}px`,
                        border: "2px dashed blue", // Placeholder marker style
                        pointerEvents: "none", // Ensure it doesn't block other elements
                        transform: "translate(-10px, -10px)", // Center the marker on the position
                      }}
                    />
                  </div>

                  {/* Margin Slider */}
                  <div className="space-y-2 mt-3">
                    <Label
                      htmlFor="markerSize"
                      className="flex items-center space-x-2"
                    >
                      <span>Marker Margin</span>
                      <Tooltip content="Adjust the marker size as the border limits of the correct answer">
                        <AlertCircle className="h-4 w-4" />
                      </Tooltip>
                    </Label>
                    <Slider
                      id="markerSize"
                      min={25}
                      max={70}
                      step={1}
                      value={[marginSize]}
                      onValueChange={(value: any) => setMarginSize(value[0])}
                    />
                    <span className="text-sm text-muted-foreground">
                      {marginSize}
                    </span>
                  </div>

                  {/* Buttons */}
                  <div className="flex justify-center space-x-4">
                    <Button variant="destructive" onClick={deleteImage}>
                      <Trash2 className="mr-2 h-4 w-4" /> Delete Image
                    </Button>
                    <Button variant="secondary" onClick={handleResetMarkers}>
                      <RefreshCw className="mr-2 h-4 w-4" /> Reset Markers
                    </Button>
                    <Button variant="secondary" onClick={handleUndoMarker}>
                      <Undo className="mr-2 h-4 w-4" /> Undo Marker
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {currentLevel !== 1 && (
              <div id="delete_level" className="flex justify-center">
                <Button variant="destructive" onClick={deleteLevel}>
                  Delete Level
                </Button>
              </div>
            )}
            <CardContent>
              {warning && !success && (
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
                      //current link + the game id
                      gameLink={`https://bachelor-eight.vercel.app/diagnose/${gameId}`}
                    />
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </CardContent>
        </Card>

        <Tooltip content="Go to next level">
          <Button
            id="increment_level"
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

      <div className="flex flex-col items-center justify-center space-y-4">
        <Button
          id="generate_button"
          onClick={handleGenerateGame}
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Game"}
        </Button>
      </div>
    </div>
  );
}
