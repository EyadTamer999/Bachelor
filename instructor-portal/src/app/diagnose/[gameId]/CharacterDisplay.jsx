const CharacterDisplay = ({ character }) => (
  <div className="flex flex-col w-full lg:w-1/2 bg-gray-100 p-4 rounded-lg shadow-md">
    <h1 className="text-xl font-bold text-center">
      Name: {character.name?.first} {character.name?.last}
    </h1>
    <div className="flex justify-center">
      <img
        src={character.picture?.large}
        alt="character"
        className="w-full h-auto max-w-sm rounded-lg"
      />
    </div>
  </div>
);

export default CharacterDisplay;
