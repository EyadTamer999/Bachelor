import Marker from "react-image-marker";


const ImageMarkerSection = ({ image, markers, onAddMarker, markersAllowed, correctMarkers }) => (
  <div className="bg-white p-4 rounded-lg shadow-md">
    <h1 className="text-xl font-bold text-center">Marker(s) left: {markersAllowed} </h1>
    <h3 className="text-center text-gray-500">Click on the image to add a marker</h3>

    <div className="flex justify-center">
      <Marker src={image.src} markers={markers} onAddMarker={onAddMarker}
      // markerComponent={(marker) => (
      //   <div
      //     style={{
      //       top: marker.top,
      //       left: marker.left,
      //       borderRadius: "50%",
      //       width: `${marker.marginSize * 2}px`,
      //       height: `${marker.marginSize * 2}px`,
      //       border: "2px dashed red", // Visualize the marker area
      //       pointerEvents: "none", // Ensure it doesn't block other elements
      //     }}
      //   />
      // )}
      />
    </div>
  </div>
);

export default ImageMarkerSection;
