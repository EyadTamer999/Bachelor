import Marker from "react-image-marker";

const ImageMarkerSection = ({ image, markers, onAddMarker }) => (
  <div className="bg-white p-4 rounded-lg shadow-md">
    <h1 className="text-xl font-bold text-center">Image</h1>
    <div className="flex justify-center">
      <Marker src={image.src} markers={markers} onAddMarker={onAddMarker} />
    </div>
  </div>
);

export default ImageMarkerSection;
