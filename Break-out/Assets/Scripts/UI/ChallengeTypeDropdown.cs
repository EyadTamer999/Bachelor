using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using TMPro;


public class ChallengeTypeDropdown : MonoBehaviour
{

    private TMP_Dropdown challengeTypeDropdown;

    private string selectedChallengeType;

    void Start()
    {
        challengeTypeDropdown = GetComponent<TMP_Dropdown>();
        selectedChallengeType = challengeTypeDropdown.options[challengeTypeDropdown.value].text;
        Debug.Log("Inital Selected: " + selectedChallengeType);
        challengeTypeDropdown.onValueChanged.AddListener(OnDropdownValueChanged);
    }



    void OnDropdownValueChanged(int value)
    {
        Debug.Log("Selected: " + challengeTypeDropdown.options[value].text);
        selectedChallengeType = challengeTypeDropdown.options[value].text;
    }

    public string GetSelectedChallengeType()
    {
        return selectedChallengeType;
    }

}
