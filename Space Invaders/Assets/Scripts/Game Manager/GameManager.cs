using UnityEngine;
using System.Collections.Generic;

public class GameManager : MonoBehaviour
{
    public static GameManager Instance { get; private set; }
    public ChallengeHandler challengeHandler { get; private set; }
    public DatabaseManager databaseManager { get; private set; }
    public LevelManager levelManager { get; private set; }

    private string gameId;

    private void Start()
    {
        if (Instance == null)
        {
            Instance = this;
            DontDestroyOnLoad(gameObject);

            challengeHandler = GetComponentInChildren<ChallengeHandler>();
            databaseManager = GetComponentInChildren<DatabaseManager>();
            levelManager = GetComponentInChildren<LevelManager>();

            Debug.Log($"GameManager initialized. DatabaseManager: {databaseManager}, ChallengeHandler: {challengeHandler}");
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

    public string GetGameId()
    {
        return gameId;
    }

    public void SetGameId(string gameId)
    {
        //print the game id
        Debug.Log("Game ID: " + gameId);

        this.gameId = gameId;
    }
}
