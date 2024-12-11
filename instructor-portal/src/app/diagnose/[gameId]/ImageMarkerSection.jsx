import Marker from "react-image-marker";

const ImageMarkerSection = ({ image, markers, onAddMarker, markersAllowed }) => (
  <div className="bg-white p-4 rounded-lg shadow-md">
    <h1 className="text-xl font-bold text-center">Marker(s) left: {markersAllowed} </h1>
    <h3 className="text-center text-gray-500">Click on the image to add a marker</h3>

    <div className="flex justify-center">
      <Marker src={image.src} markers={markers} onAddMarker={onAddMarker} />
    </div>
  </div>
);

export default ImageMarkerSection;
