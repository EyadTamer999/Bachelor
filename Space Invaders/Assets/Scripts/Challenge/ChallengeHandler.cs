using System;
using UnityEngine;

public class ChallengeHandler : MonoBehaviour
{
    [SerializeField] private string goalString = "";
    [SerializeField] private string userString = "";

    // Event to notify listeners when goalString changes
    public event Action<string> OnGoalStringChanged;

    public void SetGoalString(string goal)
    {
        goalString = goal;
        OnGoalStringChanged?.Invoke(goal); // Trigger event on change
    }

    public void SetUserString(string user)
    {
        userString = user;
    }

    public bool CheckStrings()
    {
        return goalString == userString;
    }

    public void ResetStrings()
    {
        goalString = "";
        userString = "";
        OnGoalStringChanged?.Invoke(goalString); // Trigger event to reset goalString
    }

    public string GetGoalString()
    {
        return goalString;
    }

    public string GetUserString()
    {
        return userString;
    }
}
