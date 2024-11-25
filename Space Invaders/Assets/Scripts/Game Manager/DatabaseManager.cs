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
                Level newLevel = new Level(
                    int.Parse(data.Child("level").Value.ToString()),
                    data.Child("data").Child("characters").Value.ToString(),
                    data.Child("data").Child("text").Value.ToString(),
                    int.Parse(data.Child("data").Child("turns").Value.ToString())
                );

                levels.Add(newLevel);
            }
        }

        return levels;
    }


}
