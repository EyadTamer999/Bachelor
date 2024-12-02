using TMPro;
using UnityEngine;

public class LevelText : MonoBehaviour
{
    [SerializeField] private TextMeshProUGUI levelText; // Reference to the UI element for levels
    [SerializeField] private TextMeshProUGUI turnText;  // Reference to the UI element for turns

    private void Start()
    {
        LevelManager levelManager = GameManager.Instance.levelManager;

        // Subscribe to level and turn change events
        levelManager.OnLevelChanged += UpdateLevelText;
        levelManager.OnTurnChanged += UpdateTurnText;

        // Set initial text
        UpdateLevelText(levelManager.GetCurrentLevel(), levelManager.GetTotalLevels());
        UpdateTurnText(levelManager.GetCurrentTurn(), levelManager.GetTotalTurns());
    }

    private void OnDestroy()
    {
        // Unsubscribe to avoid memory leaks
        if (GameManager.Instance?.levelManager != null)
        {
            GameManager.Instance.levelManager.OnLevelChanged -= UpdateLevelText;
            GameManager.Instance.levelManager.OnTurnChanged -= UpdateTurnText;
        }
    }

    // Update the level text
    private void UpdateLevelText(int currentLevel, int totalLevels)
    {
        levelText.text = $"Level {currentLevel} of {totalLevels}";
    }

    // Update the turn text
    private void UpdateTurnText(int currentTurn, int totalTurns)
    {
        turnText.text = $"Turn {currentTurn} of {totalTurns}";
    }
}
