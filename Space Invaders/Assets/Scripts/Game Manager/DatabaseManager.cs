using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Firebase;
using Firebase.Database;

public class DatabaseManager : MonoBehaviour
{
    // Start is called before the first frame update
    void Start()
    {
        DatabaseReference reference = FirebaseDatabase.DefaultInstance.RootReference;
    }

    // Fetch levels from the database
    public void FetchLevels()
    {
        FirebaseDatabase.DefaultInstance.GetReference("Levels").GetValueAsync().ContinueWith(task =>
        {
            if (task.IsFaulted)
            {
                Debug.Log("Error fetching levels");
            }
            else if (task.IsCompleted)
            {
                DataSnapshot snapshot = task.Result;
                foreach (DataSnapshot level in snapshot.Children)
                {
                    Debug.Log(level.Key);
                    Debug.Log(level.GetRawJsonValue());
                    Debug.Log(level.Child("levels").GetRawJsonValue());
                    Debug.Log(level.Child("levels").Child("0").GetRawJsonValue());
                    Debug.Log(level.Child("levels").Child("0").Child("data").GetRawJsonValue());
                    // {"createdAt":1732550660619,"levels":[{"data":{"characters":"1-10","text":"Convert to binary","turns":"3"},"level":1}]}
                    // create a new Level object from the JSON data

                }
            }
        });
    }

}
