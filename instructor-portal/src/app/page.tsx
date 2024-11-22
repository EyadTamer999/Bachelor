export default function Home() {
  return (
    <div className="flex flex-col items-center bg-neutral-white min-h-screen px-4 py-8 lg:px-16">
      {/* Project Title */}
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-primary bg-secondary px-6 py-4 rounded-xl shadow-lg md:text-3xl lg:px-12 lg:py-6">
          Project Title
        </h1>
      </div>

      {/* My Level(s) Title */}
      <div className="mb-6 w-full max-w-md text-center">
        <h2 className="bg-secondary text-neutral-white px-5 py-3 rounded-lg shadow-md text-lg font-semibold md:text-xl lg:px-8 lg:py-4">
          My Level(s)
        </h2>
      </div>

      {/* Level Box */}
      <div className="bg-neutral-gray rounded-2xl p-6 w-full max-w-md shadow-md">
        {/* Level Header */}
        <div className="mb-4">
          <h3 className="text-center text-primary font-semibold text-xl md:text-2xl">
            Level 1
          </h3>
        </div>

        {/* Level Text */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-text mb-2">
            Challenge Text
          </label>
          <input
            type="text"
            placeholder="e.g., Convert To Binary"
            className="w-full px-4 py-2 border border-secondary rounded-lg bg-neutral-white text-text focus:outline-none focus:ring focus:ring-secondary/50"
          />
        </div>

        {/* Characters */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-text mb-2">
            Characters
          </label>
          <input
            type="text"
            placeholder="1-10 or A,B,C or a-z"
            className="w-full px-4 py-2 border border-secondary rounded-lg bg-neutral-white text-text focus:outline-none focus:ring focus:ring-secondary/50"
          />
        </div>

        {/* Number of Turns */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-text mb-2">
            Number Of Turns
          </label>
          <input
            type="text"
            placeholder="Enter an odd number of turns"
            className="w-full px-4 py-2 border border-secondary rounded-lg bg-neutral-white text-text focus:outline-none focus:ring focus:ring-secondary/50"
            readOnly
          />
        </div>
      </div>

      {/* Generate Game Button */}
      <div className="mt-6">
        <button className="bg-accent-orange text-neutral-white px-8 py-3 rounded-xl shadow-md hover:bg-accent-orange/90 focus:ring focus:ring-accent-orange/50 transition-all md:px-10 md:py-4">
          Generate Game
        </button>
      </div>
    </div>
  );
}
