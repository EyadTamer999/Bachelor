using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using TMPro;

public class ChallengeCompleteText : MonoBehaviour
{
    public void Submit()
    {
        // Handle if the game is at the last level and/or turn

        // Pause the game
        // Time.timeScale = 0;

        // Get the challenge state from the ChallengeHandler
        ChallengeHandler challengeHandler = GameManager.Instance.challengeHandler;

        // Check if the challenge is completed
        if (challengeHandler.GetChallengeState() == ChallengeHandler.ChallengeState.Completed)
        {
            // Set the text to display
            GetComponent<TMPro.TextMeshProUGUI>().text = "Challenge Complete!";
        }
        else
        {
            // Set the text to display
            GetComponent<TMPro.TextMeshProUGUI>().text = "Challenge Failed!";
        }

        // Set the text to be visible
        GetComponent<TMPro.TextMeshProUGUI>().enabled = true;
    }
}
