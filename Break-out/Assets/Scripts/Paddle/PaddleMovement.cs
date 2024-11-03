using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PaddleMovement : MonoBehaviour
{
    public float speed = 10f; // Speed of the paddle movement
    public float leftBoundary = -7.5f; // Left boundary of the paddle
    public float rightBoundary = 7.5f; // Right boundary of the paddle

    void Update()
    {
        // Check if there is touch input
        if (Input.touchCount > 0)
        {
            // Get the first touch and its position
            Touch touch = Input.GetTouch(0);
            Vector3 touchPosition = Camera.main.ScreenToWorldPoint(new Vector3(touch.position.x, touch.position.y, 10f));

            // Move the paddle to the touch position (x-axis only)
            transform.position = new Vector3(Mathf.Clamp(touchPosition.x, leftBoundary, rightBoundary), transform.position.y, transform.position.z);
        }
        else
        {
            // Use mouse input if there is no touch input
            Vector3 mousePosition = Camera.main.ScreenToWorldPoint(new Vector3(Input.mousePosition.x, Input.mousePosition.y, 10f));

            // Move the paddle to the mouse position (x-axis only)
            transform.position = new Vector3(Mathf.Clamp(mousePosition.x, leftBoundary, rightBoundary), transform.position.y, transform.position.z);
        }
    }
}
