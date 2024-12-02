using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using TMPro;

public class GameIdInput : MonoBehaviour
{
    public TMP_InputField gameIdInput;
    private string gameId;

    void Start()
    {
        gameIdInput.onValueChanged.AddListener(OnInputValueChanged);
    }

    void OnInputValueChanged(string value)
    {
        gameId = value;
        GameManager.Instance.SetGameId(gameId);
    }

}
