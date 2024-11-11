using UnityEngine;
using TMPro;

public class ChallengeGoal : MonoBehaviour
{
    public TMP_Text goalText;


    void Start()
    {
        // Set the goal text to the initial goal string
        goalText.text = GameManager.Instance.ChallengeHandler.GetGoalString();
    }

    private void OnEnable()
    {
        if (GameManager.Instance != null && GameManager.Instance.ChallengeHandler != null)
        {
            Debug.Log("Subscribing to OnGoalStringChanged event");
            // Subscribe to OnGoalStringChanged event
            GameManager.Instance.ChallengeHandler.OnGoalStringChanged += UpdateGoalText;
        }
    }

    private void OnDisable()
    {
        if (GameManager.Instance != null && GameManager.Instance.ChallengeHandler != null)
        {
            // Unsubscribe to prevent memory leaks
            GameManager.Instance.ChallengeHandler.OnGoalStringChanged -= UpdateGoalText;
        }
    }

    private void UpdateGoalText(string newGoal)
    {
        goalText.text = newGoal;
    }
}
