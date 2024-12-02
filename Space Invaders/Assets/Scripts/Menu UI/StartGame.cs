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
        loadingText.text = "Please wait...";

        // Trigger the level loading process
        GameManager.Instance.levelManager.LoadLevels();

        // Wait until the levels are loaded
        while (GameManager.Instance.levelManager.GetLevels() == null)
        {
            // Optionally add a loading animation or feedback here
            yield return null; // Wait for the next frame
        }

        // Update the text to indicate completion (optional)
        loadingText.text = "Loading complete!";

        // Briefly show the complete message
        yield return new WaitForSeconds(0.5f);

        // Load the game scene
        SceneManager.LoadScene("Main Game");
    }
}
