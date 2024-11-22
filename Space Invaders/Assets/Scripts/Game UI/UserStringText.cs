using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using TMPro;

public class UserStringText : MonoBehaviour
{
    public TMP_Text userStringText;

    void Start()
    {
        // Set the user string text to the initial user string
        userStringText.text = GameManager.Instance.challengeHandler.GetUserString();
    }

    private void OnEnable()
    {
        if (GameManager.Instance != null && GameManager.Instance.challengeHandler != null)
        {
            Debug.Log("Subscribing to OnUserStringChanged event");
            // Subscribe to OnUserStringChanged event
            GameManager.Instance.challengeHandler.OnUserStringChanged += UpdateUserStringText;
        }
    }

    private void OnDisable()
    {
        if (GameManager.Instance != null && GameManager.Instance.challengeHandler != null)
        {
            // Unsubscribe to prevent memory leaks
            GameManager.Instance.challengeHandler.OnUserStringChanged -= UpdateUserStringText;
        }
    }

    private void UpdateUserStringText(string newUserString)
    {
        userStringText.text = newUserString;
    }
}
