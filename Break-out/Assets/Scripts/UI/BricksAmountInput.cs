using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using TMPro;

public class BricksAmountInput : MonoBehaviour
{

    public TMP_InputField bricksAmountInput;

    private int bricksAmount;

    public GameObject bricksSpawner;

    // Start is called before the first frame update
    void Start()
    {
        bricksAmountInput.onValueChanged.AddListener(OnInputValueChanged);
    }

    void OnInputValueChanged(string value)
    {
        Debug.Log("Bricks Amount: " + value);
        bricksAmount = int.Parse(value);

        // Set the amount of bricks
        bricksSpawner.GetComponent<BrickSpawner>().SetBricksAmount(bricksAmount);
    }


}
