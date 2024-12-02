using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using TMPro;
public class HeaderText : MonoBehaviour
{
    private void Start()
    {
        LevelManager levelManager = GameManager.Instance.levelManager;

        // Subscribe to the OnHeaderTextChanged event
        levelManager.OnHeaderTextChanged += UpdateHeaderText;

        // Set the initial header text
        UpdateHeaderText(levelManager.GetHeaderText());
    }

    private void OnDestroy()
    {
        // Unsubscribe to avoid memory leaks
        if (GameManager.Instance?.levelManager != null)
        {
            GameManager.Instance.levelManager.OnHeaderTextChanged -= UpdateHeaderText;
        }
    }

    // Update the header text when the event is triggered
    private void UpdateHeaderText(string newHeaderText)
    {
        GetComponent<TextMeshProUGUI>().text = newHeaderText;
    }
}
