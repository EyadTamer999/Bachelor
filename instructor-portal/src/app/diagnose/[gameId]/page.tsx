"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { getDiagnoseGame } from "@/utils/fetchApi";

export default function DiagnoseGame() {
  const { gameId } = useParams(); // Access path parameters

  const [diagnoseGame, setDiagnoseGame] = useState(null);

  useEffect(() => {
    // Fetch data from the server
    getDiagnoseGame(gameId).then((data) => {
      setDiagnoseGame(data);
    });

    // Console log the data
    console.log(diagnoseGame);
  }, [gameId]);

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex flex-col lg:flex-row gap-4 p-4">
        {/* Character Container */}
        <div className="flex flex-col w-full lg:w-1/2 bg-gray-100 p-4 rounded-lg shadow-md">
          <div className="text-center mb-4">
            <h1 className="text-xl font-bold">Character</h1>
          </div>
          <div className="flex justify-center">
            <img
              src="https://placehold.co/600x400"
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
              <p>Dialog goes here</p>
            </div>
          </div>

          {/* Extra Info Section */}
          <div className="flex flex-col bg-white p-4 rounded-lg shadow-md">
            <div className="text-center mb-4">
              <h1 className="text-xl font-bold">Extra Info/Patient Data</h1>
            </div>
            <div className="bg-gray-50 p-4 rounded-md">
              <p>Extra info goes here</p>
            </div>
          </div>

          {/* Image Section */}
          <div className="flex flex-col bg-white p-4 rounded-lg shadow-md">
            <div className="text-center mb-4">
              <h1 className="text-xl font-bold">Image</h1>
            </div>
            <div className="flex justify-center">
              <img
                src="https://placehold.co/600x400"
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
        <button className="bg-green-500 text-white p-4 rounded-lg shadow-md">
          Next
        </button>
      </div>
    </div>
  );
}
