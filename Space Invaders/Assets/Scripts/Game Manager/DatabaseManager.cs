using System.Collections.Generic;
using System.Threading.Tasks;
using UnityEngine;
using UnityEngine.Networking;
using Newtonsoft.Json;

public class DatabaseManager : MonoBehaviour
{
    private const string FirebaseDatabaseUrl = "https://bachelor-65664-default-rtdb.firebaseio.com";

    public async Task<List<Level>> FetchLevelsById(string id)
    {
        List<Level> levels = new List<Level>();

        // Construct the URL for the Firebase database with the specific ID
        string url = $"{FirebaseDatabaseUrl}/Levels/{id}.json";

        using (UnityWebRequest request = UnityWebRequest.Get(url))
        {
            var operation = request.SendWebRequest();
            while (!operation.isDone)
            {
                await Task.Yield();
            }

            if (request.result != UnityWebRequest.Result.Success)
            {
                Debug.LogError($"Error fetching data: {request.error}");
                return levels;
            }

            string jsonResponse = request.downloadHandler.text;

            // Check if the response is empty
            if (string.IsNullOrEmpty(jsonResponse) || jsonResponse == "null")
            {
                Debug.LogError("Error: Database did not return any data for the specified ID.");
                return levels;
            }

            try
            {
                // Deserialize JSON for the specified ID
                var firebaseEntry = JsonConvert.DeserializeObject<FirebaseEntry>(jsonResponse);

                //print response
                Debug.Log(jsonResponse);

                foreach (var levelInfo in firebaseEntry.levels)
                {

                    // Create a new Level object
                    Level newLevel = new Level(
                        levelInfo.level,
                        levelInfo.data.characters,
                        levelInfo.data.challengeGoals,
                        levelInfo.data.text,
                        levelInfo.data.turns
                    );

                    // Print the level data
                    Debug.Log($"Level: {newLevel.level}");
                    Debug.Log($"Characters: {string.Join(", ", newLevel.characters)}");
                    Debug.Log($"Goal strings: {string.Join(", ", newLevel.goalStrings)}");
                    Debug.Log($"Text: {newLevel.text}");
                    Debug.Log($"Turns: {newLevel.turns}");


                    // Add the new level to the list
                    levels.Add(newLevel);
                }
            }
            catch (System.Exception e)
            {
                Debug.LogError($"Error parsing JSON: {e.Message}");
            }
        }

        if (levels.Count == 0)
        {
            Debug.LogError("Error: No levels found for the specified ID.");
        }

        return levels;
    }
}


public class FirebaseEntry
{
    public List<LevelInfo> levels { get; set; }
}

public class LevelInfo
{
    public int level { get; set; }
    public LevelData data { get; set; }
}

public class LevelData
{
    public List<char> characters { get; set; }
    public List<string> challengeGoals { get; set; }
    public string text { get; set; }
    public int turns { get; set; }
}
