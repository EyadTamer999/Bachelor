using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class StartGame : MonoBehaviour
{

    public GameObject dontDestroy;

    // Switch to the game scene
    public void StartGameScene()
    {
        // Don't destroy the objects that are needed in the game scene
        DontDestroyOnLoad(dontDestroy);

        // Load the game scene
        UnityEngine.SceneManagement.SceneManager.LoadScene("Main Game");
    }
}
