using UnityEngine;

public class GameManager : MonoBehaviour
{
    public static GameManager Instance { get; private set; }
    public ChallengeHandler challengeHandler { get; private set; }
    public DatabaseManager databaseManager { get; private set; }

    private void Awake()
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

            // Fetch levels from the database
            databaseManager.FetchLevels();
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
