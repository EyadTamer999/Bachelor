const ControlButtons = ({
  markers,
  onClear,
  onUndo,
  onSubmit,
}) => (
  <div className="flex flex-col gap-4 p-4 bg-gray-100 rounded-lg shadow-md ">
    <div className=" p-4 flex gap-4 justify-center">
      <button
        className="bg-red-500 text-white p-4 rounded-lg shadow-md"
        onClick={onClear}
      >
        Clear
      </button>
      <button
        className="bg-yellow-500 text-white p-4 rounded-lg shadow-md"
        onClick={onUndo}
      >
        Undo
      </button>
    </div>
    <button
      className={`bg-blue-500 text-white p-4 rounded-lg shadow-md ${markers.length === 0
        ? "bg-gray-500 cursor-not-allowed"
        : "hover:bg-blue-600"
        }`}
      disabled={markers.length === 0}
      onClick={onSubmit}
    >
      Submit
    </button>
  </div>
);

export default ControlButtons;
