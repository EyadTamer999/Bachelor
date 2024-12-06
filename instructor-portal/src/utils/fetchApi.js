import { db } from '../lib/FirebaseConfig';
import { ref, set } from 'firebase/database';
import { storage, client } from '../lib/AppWriteConfig';

// Function to push the game data to the Realtime Database
const generateSpaceInvaderGame = async (levels) => {
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
        return gameId;

    } catch (error) {
        console.error('Error pushing game data:', error);
        return "Error";
    }
};

const generateDiagnoseGame = async (levels) => {
    try {
        // Define the data structure to push
        const gameData = {
            levels: levels,
            createdAt: Date.now(),
        };

        // Generate a unique game ID
        let gameId = Date.now().toString(36);

        // Create a reference in the Realtime Database
        const gameRef = ref(db, `Diagnose/${gameId}`);

        // Push the data to the database
        await set(gameRef, gameData);

        console.log('Game data pushed successfully');
        return gameId;

    } catch (error) {
        console.error('Error pushing game data:', error);
        return "Error";
    }
};

const uploadImage = async (file) => {
    // shorten the file name and make it unique
    let fileName = Date.now()

    console.log('Uploading image...', fileName);

    // Upload the image to the Appwrite storage
    let res = await storage.createFile(process.env.NEXT_PUBLIC_APPWRITE_STORAGE_ID, fileName, file);
    console.log('Image uploaded successfully', res);

    let imageUrl = "https://cloud.appwrite.io/v1/storage/buckets/" + res["bucketId"] + "/files/" + res["$id"] + "/view" + "?project=" + process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;

    // return the URL of the uploaded image to save it in the database
    return imageUrl;

};

export { generateSpaceInvaderGame, generateDiagnoseGame, uploadImage };
