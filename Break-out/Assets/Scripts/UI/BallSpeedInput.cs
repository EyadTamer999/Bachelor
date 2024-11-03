using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using TMPro;

public class BallSpeedInput : MonoBehaviour
{
    public TMP_InputField ballSpeedInput;

    private float ballSpeed;

    public GameObject ball;

    void Start()
    {
        ballSpeedInput.onValueChanged.AddListener(OnInputValueChanged);
    }

    void OnInputValueChanged(string value)
    {
        Debug.Log("Ball Speed: " + value);
        ballSpeed = float.Parse(value);

        // Get the speed of the ball
        ball.GetComponent<BallBehavior>().GetSpeed();

        // Set the speed of the ball
        ball.GetComponent<BallBehavior>().SetSpeed(ballSpeed);
    }



}
