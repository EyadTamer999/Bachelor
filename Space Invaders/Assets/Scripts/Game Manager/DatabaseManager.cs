using System.Collections.Generic;
using System.Threading.Tasks;
using Firebase.Database;
using UnityEngine;

public class DatabaseManager : MonoBehaviour
{
    // Fetch levels from the database and return a Task
    public async Task<List<Level>> FetchLevels()
    {
        List<Level> levels = new List<Level>();

        DataSnapshot snapshot = await FirebaseDatabase.DefaultInstance.GetReference("Levels").GetValueAsync();
        foreach (DataSnapshot level in snapshot.Children)
        {
            foreach (DataSnapshot data in level.Child("levels").Children)
            {
                // Parse the "parsedCharacters" as a List<string>
                List<char> parsedCharacters = new List<char>();

                // Assuming "parsedCharacters" is stored as an array in Firebase
                foreach (DataSnapshot character in data.Child("data").Child("parsedCharacters").Children)
                {
                    parsedCharacters.Add(character.Value.ToString()[0]);
                }

                // Create a new Level object and add it to the list
                Level newLevel = new Level(
                    int.Parse(data.Child("level").Value.ToString()),
                    parsedCharacters,
                    data.Child("data").Child("text").Value.ToString(),
                    int.Parse(data.Child("data").Child("turns").Value.ToString())
                );

                // Add the new level to the list
                levels.Add(newLevel);
            }
        }

        return levels;
    }
}
