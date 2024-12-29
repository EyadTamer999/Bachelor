"use client";

import React, { useState } from "react";
import { generateDiagnoseGame, uploadImage } from "@/utils/fetchApi"; // Make sure this is properly implemented.
import Marker from "react-image-marker";
import Tooltip from "@/app/shared/ToolTip";
import GameId from "@/app/shared/GameId";

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
  const [marginSize, setMarginSize] = useState(20);

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

  return (
    <div className="flex flex-col items-center bg-neutral-white min-h-screen px-4 py-8 lg:px-16">
      <div className="mb-6 w-full max-w-md text-center space-y-2">
        <Tooltip
          content="The Level(s) you have created for the game."
          position="bottom"
        >
          <h2 className="bg-primary text-neutral-white px-5 py-3 rounded-lg shadow-md text-lg font-semibold md:text-xl lg:px-8 lg:py-4 ">
            My Level(s): {levels.length > 0 ? levels.length : 1}
            {"  ℹ️"}
          </h2>
        </Tooltip>

        {warning && (
          <div className="text-error font-medium text-center bg-error-light p-3 rounded-lg">
            {warning}
          </div>
        )}

        {success && (
          <div className="text-accent-green font-medium text-center bg-accent-green-light p-3 rounded-lg">
            {success} <br />
            <GameId gameName={"diagnose"} gameId={gameId} />
          </div>
        )}
      </div>

      <div className="flex items-center w-full justify-center space-x-4">
        <Tooltip content="Go to previous level" position="bottom">
          <button
            onClick={handleDecrementLevel}
            className="bg-secondary hover:bg-accent-green text-neutral-white px-3 py-3 rounded-xl shadow-md focus:ring focus:ring-secondary-light transition-transform md:px-10 md:py-4"
            aria-label="Decrement Level"
          >
            ⬅️
          </button>
        </Tooltip>

        <div className="bg-neutral-light rounded-2xl p-6 w-full max-w-md shadow-md">
          <div className="mb-4">
            <Tooltip
              content="The current level you are working on"
              position="top"
            >
              <h3 className="text-center text-primary font-semibold text-xl md:text-2xl">
                Level {currentLevel}
                <span className="text-lg md:text-xl">{"  ℹ️"}</span>
              </h3>
            </Tooltip>
          </div>

          <div className="mb-4">
            <Tooltip
              content="The dialog text for the character in the level"
              position="top"
            >
              <label className="text-sm font-medium text-neutral-dark">
                Dialog Text
                <span className="text-xs text-error">*</span>
                <span className="text-xs text-neutral-dark">{"  ℹ️"}</span>
              </label>
            </Tooltip>
            <textarea
              placeholder="Enter dialog text for the character"
              className="resize-y w-full px-4 py-2 border border-primary rounded-lg bg-neutral-white text-primary focus:outline-none focus:ring focus:ring-primary-light"
              value={
                levels.find((level) => level.level === currentLevel)?.data
                  ?.dialog || ""
              }
              onChange={(e) => handleChange("dialog", e.target.value)}
            />
          </div>

          <div className="mb-4">
            <Tooltip
              content="Extra information for the character or the level"
              position="top"
            >
              <label className="text-sm font-medium text-neutral-dark">
                Extra Info
                <span className="text-xs text-error">*</span>
                <span className="text-xs text-neutral-dark">{"  ℹ️"}</span>
              </label>
            </Tooltip>
            <textarea
              placeholder="Enter extra information for the character/character's issue"
              className="resize-y w-full px-4 py-2 border border-primary rounded-lg bg-neutral-white text-primary focus:outline-none focus:ring focus:ring-primary-light"
              value={
                levels.find((level) => level.level === currentLevel)?.data
                  ?.extraInfo || ""
              }
              onChange={(e) => handleChange("extraInfo", e.target.value)}
            />
          </div>

          <div className="mb-4">
            <Tooltip
              content="Upload an image that you will base on the answers, if using an iPhone please upload image from files or using camera"
              position="top"
            >
              <label className="text-sm font-medium text-neutral-dark">
                Upload Image
                <span className="text-xs text-error">*</span>
                <span className="text-xs text-neutral-dark">{"  ℹ️"}</span>
              </label>
            </Tooltip>
            <input
              type="file"
              accept="image/*"
              onChange={handleSetImage}
              className="block w-full text-sm text-primary border border-primary rounded-lg bg-neutral-white focus:outline-none focus:ring focus:ring-primary-light"
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
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <Marker
                    markers={
                      levels.find((level) => level.level === currentLevel)?.data
                        ?.img?.markers || []
                    }
                    onAddMarker={handleAddMarker}
                    src={
                      levels.find((level) => level.level === currentLevel)?.data
                        ?.img?.src || ""
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
                <div className="flex items-center justify-center space-x-4 mt-4">
                  <Tooltip
                    content="Adjust the marker size as the border limits of the correct answer"
                    position="top"
                  >
                    <label className="text-sm font-medium text-neutral-dark">
                      Marker Margin
                      <span className="text-xs text-neutral-dark">
                        {"  ℹ️"}
                      </span>
                    </label>
                  </Tooltip>
                  <input
                    type="range"
                    min={20}
                    max={50}
                    value={marginSize}
                    onChange={(e) => setMarginSize(+e.target.value)}
                    className="w-40"
                  />
                  <span>{marginSize}</span>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-center space-x-4">
                <button
                  onClick={deleteImage}
                  className="bg-primary hover:bg-accent-green text-neutral-white px-6 py-3 rounded-xl shadow-md focus:ring focus:ring-primary-light"
                >
                  Delete Image
                </button>

                <button
                  onClick={() => handleResetMarkers()}
                  className="bg-primary hover:bg-accent-green text-neutral-white px-6 py-3 rounded-xl shadow-md focus:ring focus:ring-primary-light"
                >
                  Reset Markers
                </button>

                <button
                  onClick={() => handleUndoMarker()}
                  className="bg-primary hover:bg-accent-green text-neutral-white px-6 py-3 rounded-xl shadow-md focus:ring focus:ring-primary-light"
                >
                  Undo Marker
                </button>
              </div>
            </div>
          )}

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

        <Tooltip content="Go to next level" position="bottom">
          <button
            onClick={handleIncrementLevel}
            className="bg-secondary hover:bg-accent-green text-neutral-white px-3 py-3 rounded-xl shadow-md focus:ring focus:ring-secondary-light transition-transform md:px-10 md:py-4"
            aria-label={
              currentLevel === levels.length ? "Add Level" : "Increment Level"
            }
          >
            {currentLevel === levels.length ? "➕" : "➡️"}
          </button>
        </Tooltip>
      </div>

      <button
        onClick={handleGenerateGame}
        className="bg-primary hover:bg-accent-green text-neutral-white px-6 py-3 rounded-xl shadow-md focus:ring focus:ring-primary-light mt-10"
        aria-label="Generate Game"
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Game"}
      </button>
    </div>
  );
}
