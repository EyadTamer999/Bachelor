import React from "react";
import { useQRCode } from "next-qrcode";

export default function QRCodeDisplay({ gameLink, gameId }) {
  const { Canvas } = useQRCode();
  return (
    <div>
      <span className="text-success font-semibold">
        Game ID: {gameId}
      </span>
      <div className="flex-col items-center justify-center space-y-4 mt-4">
        <a
          href={gameLink}
          target="_blank"
          rel="noreferrer"
          className="bg-success text-neutral-white px-6 py-3 rounded-xl shadow-md hover:bg-success/90 focus:ring focus:ring-success/50 transition-all"
        >
          View Game
        </a>

        <div className="flex items-center justify-center space-x-4">
          <Canvas
            text={gameLink}
            options={{
              errorCorrectionLevel: "M",
              margin: 3,
              scale: 4,
              width: 200,
              color: { dark: "#000000FF", light: "#FFFFFFFF" },
            }}
          />
        </div>
      </div>
    </div>
  );
}
