using System.Collections;
using UnityEngine;

public class BallBehavior : MonoBehaviour
{
    public float speed = 10f; // Speed of the ball
    private Vector3 direction; // Direction of the ball's movement
    private bool isLaunched = false; // Check if the ball has been launched
    private bool hasReleasedInput = true; // Ensure that the user has released the input before accepting a new tap

    private GameObject paddle; // Reference to the paddle object

    void Start()
    {
        // Get the paddle object by name
        paddle = GameObject.Find("Paddle");

        // Start the ball attached to the paddle
        ResetBall();
    }

    void Update()
    {
        // Check for input to launch the ball if it hasn't been launched yet and the user has released the input
        if (!isLaunched && hasReleasedInput && (Input.GetMouseButtonDown(0) || Input.touchCount > 0 || Input.GetKeyDown(KeyCode.Space)))
        {
            // Launch the ball
            LaunchBall();
        }

        // Track if the input has been released (this prevents immediate relaunch on reset)
        if (Input.GetMouseButtonUp(0) || Input.touchCount == 0 || Input.GetKeyUp(KeyCode.Space))
        {
            hasReleasedInput = true; // Mark that the user has released the input
        }

        // Move the ball if it has been launched
        if (isLaunched)
        {
            transform.position += direction * speed * Time.deltaTime;
        }

        // Keep the ball above the paddle if it hasn't been launched
        if (!isLaunched)
        {
            Vector3 paddlePosition = paddle.transform.position;
            transform.position = new Vector3(paddlePosition.x, paddlePosition.y + 0.5f, 0);
        }
    }

    void LaunchBall()
    {
        // Set the initial direction of the ball when launching
        direction = new Vector3(Random.Range(-1f, 1f), 1f, 0).normalized;
        isLaunched = true;
        hasReleasedInput = false; // Reset the input release flag upon launch
    }

    void ResetBall()
    {
        // Reset touch input to prevent accidental launch
        Input.ResetInputAxes();

        // Get the paddle position and set the ball position above it
        Vector3 paddlePosition = paddle.transform.position;

        // Reset the ball to the starting position (centered above the paddle)
        transform.position = new Vector3(paddlePosition.x, paddlePosition.y + 0.5f, 0);
        direction = Vector3.zero;
        isLaunched = false;
        hasReleasedInput = false; // Ensure that the player must release the input before a new tap is registered
    }

    private void OnCollisionEnter2D(Collision2D collision)
    {
        // Reflect the ball's direction based on the surface it hits
        if (collision.gameObject.CompareTag("Paddle") || collision.gameObject.CompareTag("Wall") || collision.gameObject.CompareTag("Brick"))
        {
            Debug.Log("Collision with " + collision.gameObject.tag);
            direction = Vector2.Reflect(direction, collision.contacts[0].normal);
        }

        // Handle collision with the bottom wall or kill zone
        if (collision.gameObject.CompareTag("KillZone"))
        {
            ResetBall(); // Reset the ball when it hits the bottom wall
        }
    }

    public void SetSpeed(float newSpeed)
    {
        speed = newSpeed; // Set the speed of the ball
    }

    public void GetSpeed()
    {
        Debug.Log("Current Ball Speed: " + speed); // Log the current speed of the ball
    }
}
