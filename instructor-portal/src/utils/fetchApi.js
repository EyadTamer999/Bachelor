import { db } from '../lib/FirebaseConfig';
import { ref, set, get } from 'firebase/database';
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
    // Generate a shortened and unique file name, preserving the original extension
    const fileExtension = file.name.split(".").pop(); // Extract the file extension
    const fileName = `${Date.now()}.${fileExtension}`;

    console.log("Uploading image...", fileName);

    // Upload the image to the Appwrite storage
    const res = await storage.createFile(
        process.env.NEXT_PUBLIC_APPWRITE_STORAGE_ID,
        fileName,
        file
    );
    console.log("Image uploaded successfully", res);

    // Construct the image URL based on the Appwrite storage endpoint
    const imageUrl =
        `https://cloud.appwrite.io/v1/storage/buckets/${res["bucketId"]}/files/${res["$id"]}/view` +
        `?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;

    // Return the URL of the uploaded image to save it in the database
    return imageUrl;
};

const getDiagnoseGame = async (gameId) => {
    try {
        // Create a reference to the specific game's data in the database
        const gameRef = ref(db, `Diagnose/${gameId}`);

        // Use Firebase's 'get' method to fetch the data
        const snapshot = await get(gameRef);

        if (snapshot.exists()) {
            // Retrieve the game data from the snapshot
            const gameData = snapshot.val();
            console.log('Game data retrieved successfully:', gameData);
            return gameData;
        } else {
            console.warn('No game data found for the provided gameId');
            return null;
        }
    } catch (error) {
        console.error('Error retrieving game data:', error);
        return "Error";
    }
};


export { generateSpaceInvaderGame, generateDiagnoseGame, uploadImage, getDiagnoseGame };
