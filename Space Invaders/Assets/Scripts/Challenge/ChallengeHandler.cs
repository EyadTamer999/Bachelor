using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ChallengeHandler : MonoBehaviour
{
    [SerializeField] private string goalString = "";

    [SerializeField] private string userString = "";

    public void SetGoalString(string goal)
    {
        goalString = goal;
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
