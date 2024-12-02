using UnityEngine;
using TMPro;

public class ChallengeGoal : MonoBehaviour
{
    public TMP_Text goalText;


    void Start()
    {

        // print the goal string to the console 
        Debug.Log("from goal text Goal String: " + GameManager.Instance.challengeHandler.GetGoalString());

        // Set the goal text to the initial goal string
        goalText.text = GameManager.Instance.challengeHandler.GetGoalString();
    }

    private void OnEnable()
    {
        if (GameManager.Instance != null && GameManager.Instance.challengeHandler != null)
        {
            Debug.Log("Subscribing to OnGoalStringChanged event");
            // Subscribe to OnGoalStringChanged event
            GameManager.Instance.challengeHandler.OnGoalStringChanged += UpdateGoalText;
        }
    }

    private void OnDisable()
    {
        if (GameManager.Instance != null && GameManager.Instance.challengeHandler != null)
        {
            // Unsubscribe to prevent memory leaks
            GameManager.Instance.challengeHandler.OnGoalStringChanged -= UpdateGoalText;
        }
    }

    private void UpdateGoalText(string newGoal)
    {
        goalText.text = newGoal;
    }
}
