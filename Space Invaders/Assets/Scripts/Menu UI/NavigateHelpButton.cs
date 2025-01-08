using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;

public class NavigateHelp : MonoBehaviour
{
    public void GoToHelpScene()
    {
        SceneManager.LoadScene("Help");
    }

    public void GoToMainMenu()
    {
        Debug.Log("Go to main menu");
        SceneManager.LoadScene("Main Game");
    }

}
