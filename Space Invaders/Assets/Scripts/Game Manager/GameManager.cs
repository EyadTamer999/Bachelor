using UnityEngine;
using System.Collections.Generic;

public class GameManager : MonoBehaviour
{
    public static GameManager Instance { get; private set; }
    public ChallengeHandler challengeHandler { get; private set; }
    public DatabaseManager databaseManager { get; private set; }
    public LevelManager levelManager { get; private set; }


    private async void Awake()
    {
        if (Instance == null)
        {
            Instance = this;
            DontDestroyOnLoad(gameObject);

            // Retrieve ChallengeHandler as it is a child of this GameObject
            challengeHandler = GetComponentInChildren<ChallengeHandler>();

            // Retrieve DatabaseManager as it is a child of this GameObject
            databaseManager = GetComponentInChildren<DatabaseManager>();

            // Retrieve LevelManager as it is a child of this GameObject
            levelManager = GetComponentInChildren<LevelManager>();

            if (challengeHandler == null)
            {
                Debug.LogError("ChallengeHandler not found as a child of GameManager.");
            }

            if (databaseManager == null)
            {
                Debug.LogError("DatabaseManager not found as a child of GameManager.");
            }

            // TODO wait for the database to complete fetching before starting the game
            // Fetch levels asynchronously and assign them to the levels list in LevelManager
            levelManager.SetLevels(await databaseManager.FetchLevels());

            // print the levels to the console
            // foreach (Level level in levelManager.levels)
            // {
            //     Debug.Log("Level: " + level.level);
            //     Debug.Log("Characters: " + string.Join(", ", level.characters));
            //     Debug.Log("Text: " + level.text);
            //     Debug.Log("Turns: " + level.turns);
            // }
        }
        else
        {
            Destroy(gameObject);
        }
    }

    public void ResetGame()
    {
        Debug.Log("Resetting game...");
        challengeHandler = GetComponentInChildren<ChallengeHandler>();

        if (challengeHandler != null)
        {
            // Reset the UserString in the ChallengeHandler
            GameManager.Instance.challengeHandler.SetUserString("");

        }
        else
        {
            Debug.LogWarning("ChallengeHandler is null. Ensure it's a child of GameManager and that GameManager is set to DontDestroyOnLoad.");
        }

        // set the timescale back to 1
        Time.timeScale = 1;

        // set the challenge state back to OnGoing
        GameManager.Instance.challengeHandler.SetChallengeOnGoing();

        // Reload the current scene
        UnityEngine.SceneManagement.SceneManager.LoadScene(UnityEngine.SceneManagement.SceneManager.GetActiveScene().buildIndex);
    }

    public void Submit()
    {
        GameManager.Instance.challengeHandler.SubmitChallenge();
    }
}
