using System;
using UnityEngine;
public class ChallengeHandler : MonoBehaviour
{
    public enum ChallengeState
    {
        OnGoing,
        Completed,
        Failed
    }


    //TODO: fix impossible to win scenarios like:
    // 1. the answer does not exist in the list of enemies
    // 2. there is no connection or path to the correct answer - the answer is not in the first row
    // how to fix? reshuffle until the answer exists

    [SerializeField] private string goalString = "";

    [SerializeField] private string goalStringConverted = "";

    [SerializeField] private string userString = "";

    [SerializeField] private ChallengeState challengeState = ChallengeState.OnGoing;

    // Event to notify listeners when goalString changes
    public event Action<string> OnGoalStringChanged;

    // Event to notify listeners when userString changes
    public event Action<string> OnUserStringChanged;

    [SerializeField] private GameObject challengeCompleteText;


    public void SubmitChallenge()
    {
        // Check if the user's string matches the goal string
        if (CheckStrings())
        {
            SetChallengeCompleted();
        }
        else
        {
            SetChallengeFailed();
        }

        // Find the ChallengeCompleteText object in the scene
        GameObject challengeCompleteTextObject = GameObject.Find("ChallengeCompleteText");

        // call the Submit method on the ChallengeCompleteText object
        challengeCompleteTextObject.GetComponent<ChallengeCompleteText>().Submit();
    }


    public void SetGoalString(string goal)
    {
        goalString = goal;
        OnGoalStringChanged?.Invoke(goal); // Trigger event on change

        // Convert goalString from decimal to binary
        goalStringConverted = Convert.ToString(int.Parse(goalString), 2);
    }

    public void SetUserString(string user)
    {
        this.userString = user;
        OnUserStringChanged?.Invoke(user); // Trigger event on change

        Debug.Log("User string: " + userString);
    }

    public bool CheckStrings()
    {
        return goalStringConverted == userString;
    }

    public void ResetStrings()
    {
        Debug.Log("Resetting strings...");
        goalString = "";
        userString = "";

        // Trigger event on change
        OnGoalStringChanged?.Invoke(goalString);
    }

    public string GetGoalString()
    {
        return goalString;
    }

    public string GetGoalStringConverted()
    {
        return goalStringConverted;
    }

    public string GetUserString()
    {
        return userString;
    }

    public void SetChallengeCompleted()
    {
        challengeState = ChallengeState.Completed;
    }

    public void SetChallengeFailed()
    {
        challengeState = ChallengeState.Failed;
    }

    public void SetChallengeOnGoing()
    {
        challengeState = ChallengeState.OnGoing;
    }

    public ChallengeState GetChallengeState()
    {
        return challengeState;
    }

    public bool IsPossibleToFormGoalString(System.Collections.Generic.List<GameObject> enemies, string goalString)
    {
        //Check if the goal string can be formed with the current enemies
        return true;

    }
}
