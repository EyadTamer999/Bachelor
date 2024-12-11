const LevelInfo = ({ extraInfo }) => (
  <>
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h1 className="text-xl font-bold text-center">Extra Info/Patient Data</h1>
      <p className="bg-gray-50 p-4 rounded-md overflow-y-auto max-h-40">
        {extraInfo}
      </p>
    </div>
  </>
);

export default LevelInfo;
