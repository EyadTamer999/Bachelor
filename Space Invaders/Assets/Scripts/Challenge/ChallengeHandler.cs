using System;
using UnityEngine;

public class ChallengeHandler : MonoBehaviour
{
    [SerializeField] private string goalString = "";

    [SerializeField] private string goalStringConverted = "";

    [SerializeField] private string userString = "";

    // Event to notify listeners when goalString changes
    public event Action<string> OnGoalStringChanged;

    // Event to notify listeners when userString changes
    public event Action<string> OnUserStringChanged;

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

    public void test()
    {
        Debug.Log("Test");
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

    public string GetUserString()
    {
        return userString;
    }
}
