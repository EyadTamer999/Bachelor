using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;

public class StartGame : MonoBehaviour
{
    // Reference to the TextMeshProUGUI component for feedback
    private TMPro.TextMeshProUGUI loadingText;

    private void Start()
    {
        // Cache the TextMeshProUGUI component for future use
        loadingText = GetComponentInChildren<TMPro.TextMeshProUGUI>();
    }

    // Switch to the game scene
    public void StartGameScene()
    {
        // Start the coroutine for loading levels
        StartCoroutine(LoadGameScene());
    }

    private IEnumerator LoadGameScene()
    {
        // Set the loading text
        loadingText.text = "Loading...";

        // Trigger the level loading process and wait for it to complete
        bool isLoadStarted = false;
        var loadTask = GameManager.Instance.levelManager.LoadLevels();
        while (!loadTask.IsCompleted)
        {
            yield return null; // Wait until the task is completed
        }
        isLoadStarted = loadTask.Result;

        if (!isLoadStarted)
        {
            loadingText.text = "Failed to load game.";
            Debug.LogError("Levels not loaded correctly.");
            yield break;
        }

        // Wait for levels to load with a timeout mechanism
        float timeout = 5f; // Maximum wait time in seconds
        float elapsedTime = 0f;

        while (GameManager.Instance.levelManager.GetLevels() == null)
        {
            yield return null; // Wait for the next frame
            elapsedTime += Time.deltaTime;

            if (elapsedTime > timeout)
            {
                loadingText.text = "Error: Levels not loaded in time.";
                Debug.LogError("Timeout waiting for levels to load.");
                yield break;
            }
        }

        // Update the text to indicate completion (optional)
        loadingText.text = "Starting...";

        // Briefly show the complete message
        yield return new WaitForSeconds(0.5f);

        // Load the game scene
        SceneManager.LoadScene("Main Game");
    }

}
