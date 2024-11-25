using UnityEngine;
using System.Collections.Generic;

public class GameManager : MonoBehaviour
{
    public static GameManager Instance { get; private set; }
    public ChallengeHandler challengeHandler { get; private set; }
    public DatabaseManager databaseManager { get; private set; }

    private List<Level> levels;

    // Indicates the current level the player is on
    private int currentLevel;

    // Indicates the current turn the player is on
    private int currentTurn;

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

            if (challengeHandler == null)
            {
                Debug.LogError("ChallengeHandler not found as a child of GameManager.");
            }

            if (databaseManager == null)
            {
                Debug.LogError("DatabaseManager not found as a child of GameManager.");
            }

            // Fetch levels asynchronously and assign them to the levels list
            levels = await databaseManager.FetchLevels();

            // Set the current level to 1
            currentLevel = 1;

            // Set the current turn to 1
            currentTurn = 1;

            Debug.Log("Levels fetched from database.");

            // print out the levels
            foreach (Level level in levels)
            {
                Debug.Log(level.level);
                Debug.Log(level.characters);
            }

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

    public Level GetLevel(int level)
    {
        return levels.Find(l => l.level == level);
    }

    public List<Level> GetLevels()
    {
        return levels;
    }

    public int GetCurrentLevel()
    {
        return currentLevel;
    }

    public int GetCurrentTurn()
    {
        return currentTurn;
    }

    public List<char> GetLevelLetters(int level)
    {
        return GetLevel(level).characters;
    }

}
