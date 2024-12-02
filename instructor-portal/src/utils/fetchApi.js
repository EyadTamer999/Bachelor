import { db } from '../lib/FirebaseConfig';
import { ref, set } from 'firebase/database'; // Import the required functions

const generateGame = async (levels) => {
    try {
        // Define the data structure to push
        const gameData = {
            levels: levels,
            createdAt: Date.now(),
        };

        // Generate a unique game ID
        let gameId = Date.now().toString(36);

        // Create a reference in the Realtime Database
        const gameRef = ref(db, `Levels/${gameId}`);

        // Push the data to the database
        await set(gameRef, gameData);

        console.log('Game data pushed successfully');
    } catch (error) {
        console.error('Error pushing game data:', error);
    }
};

export { generateGame };
