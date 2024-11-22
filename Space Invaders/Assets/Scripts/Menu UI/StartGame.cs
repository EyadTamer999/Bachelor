using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class StartGame : MonoBehaviour
{
    // Switch to the game scene
    public void StartGameScene()
    {
        // Load the game scene
        UnityEngine.SceneManagement.SceneManager.LoadScene("Main Game");
    }
}
