using System.Collections;
using UnityEngine;
using TMPro;

public class ChallengeCompleteText : MonoBehaviour
{
    public void Submit()
    {
        // Handle if the game is at the last level and/or turn

        // Get the challenge state from the ChallengeHandler
        ChallengeHandler challengeHandler = GameManager.Instance.challengeHandler;

        // Check if the challenge is completed
        if (challengeHandler.GetChallengeState() == ChallengeHandler.ChallengeState.Completed)
        {
            // Set the text to display for a completed challenge
            GetComponent<TextMeshProUGUI>().text = "Challenge Complete!";
        }
        else
        {
            // Set the text to display
            GetComponent<TextMeshProUGUI>().text = "Challenge Failed!";
        }

        // Set the text to be visible
        GetComponent<TextMeshProUGUI>().enabled = true;

        // Pause the game and hide the text after 1 second
        StartCoroutine(PauseAndHideText());

        // If the game is at the last level and/or turn, Show the game over screen
        if (GameManager.Instance.levelManager.IsLastLevel() && GameManager.Instance.levelManager.IsLastTurn())
        {
            // if the level is pased then show the You Win screen
            if (GameManager.Instance.levelManager.CheckLevelPassed())
            {
                // Show the You Win screen
                GetComponent<TextMeshProUGUI>().text = "You Win!";

                // Pause the game
                Time.timeScale = 0;
            }
            else
            {
                // Show the Game Over screen
                GetComponent<TextMeshProUGUI>().text = "Game Over :(";

                // Pause the game
                Time.timeScale = 0;
            }
        }
    }

    private IEnumerator PauseAndHideText()
    {
        // Pause the game
        Time.timeScale = 0;

        // Wait for 1 real-time second
        yield return new WaitForSecondsRealtime(2);

        // Hide the text
        GetComponent<TextMeshProUGUI>().enabled = false;

        // Resume the game
        Time.timeScale = 1;
    }
}
