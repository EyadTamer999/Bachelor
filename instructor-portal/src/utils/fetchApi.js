import { db } from '../lib/FirebaseConfig';
import { ref, set } from 'firebase/database'; // Import the required functions

const generateGame = async (levels) => {
    try {
        // Define the data structure to push
        const gameData = {
            levels: levels,
            createdAt: Date.now(),
        };

        // Create a reference in the Realtime Database
        const gameRef = ref(db, `games/${Date.now()}`); // Unique key for the game

        // Push the data to the database
        await set(gameRef, gameData);

        console.log('Game data pushed successfully');
    } catch (error) {
        console.error('Error pushing game data:', error);
    }
};

export { generateGame };
