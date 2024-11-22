using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using TMPro;


public class DecimalInput : MonoBehaviour
{
    public TMP_InputField decimalInput;

    private string decimalInputValue;

    public ChallengeHandler challengeHandler;


    void Start()
    {
        decimalInput.onValueChanged.AddListener(OnInputValueChanged);
    }

    void OnInputValueChanged(string value)
    {
        decimalInputValue = value;
        challengeHandler.SetGoalString(decimalInputValue);
    }

}
