using UnityEngine;

public class BrickHealth : MonoBehaviour
{
    public int health = 1; // Number of hits the brick can take

    private void OnCollisionEnter2D(Collision2D collision)
    {
        if (collision.gameObject.CompareTag("Ball")) // Assuming the ball has the "Ball" tag
        {
            health--; // Decrease health on hit
            if (health <= 0)
            {
                Destroy(gameObject); // Destroy the brick when health reaches 0
            }
        }
    }
}
