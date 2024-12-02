using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class StartGame : MonoBehaviour
{
    // Switch to the game scene
    public void StartGameScene()
    {

        // Load the levels from the database
        GameManager.Instance.levelManager.LoadLevels();

        //Set text to please wait until the database data is loaded
        GetComponentInChildren<TMPro.TextMeshProUGUI>().text = "Please wait...";

        // Check if the levels are loaded
        if (GameManager.Instance.levelManager.GetLevels() == null)
        {
            return;
        }

        // Load the game scene
        UnityEngine.SceneManagement.SceneManager.LoadScene("Main Game");
    }
}
