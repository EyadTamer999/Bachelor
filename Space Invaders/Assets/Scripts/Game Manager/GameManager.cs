using UnityEngine;

public class GameManager : MonoBehaviour
{
    public static GameManager Instance { get; private set; }
    public ChallengeHandler challengeHandler { get; private set; }

    private void Awake()
    {
        if (Instance == null)
        {
            Instance = this;
            DontDestroyOnLoad(gameObject);

            // Retrieve ChallengeHandler as it is a child of this GameObject
            challengeHandler = GetComponentInChildren<ChallengeHandler>();

            if (challengeHandler == null)
            {
                Debug.LogError("ChallengeHandler not found as a child of GameManager.");
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

        // Reload the current scene
        UnityEngine.SceneManagement.SceneManager.LoadScene(UnityEngine.SceneManagement.SceneManager.GetActiveScene().buildIndex);
    }

    public void Submit()
    {
        if (GameManager.Instance.challengeHandler.CheckStrings())
        {
            Debug.Log("Challenge complete!");
            GameManager.Instance.ResetGame();
        }
        else
        {
            Debug.Log("Challenge incomplete. Try again!");
        }
    }
}
