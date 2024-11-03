using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PlayerMovement : MonoBehaviour
{
    public float speed = 5f; // Movement speed
    public float boundaryX = 8f; // Horizontal boundary on the x-axis
    public float boundaryY = 4.5f; // Vertical boundary on the y-axis
    public GameObject projectilePrefab; // Reference to the projectile prefab
    public float projectileSpeed = 10f; // Speed of the projectile
    public float fireRate = 0.5f; // Time interval between shots
    public float projectileLifetime = 2f; // Time after which projectiles are destroyed
    private Rigidbody2D rb;
    private float nextFireTime; // Tracks when the player can fire next

    void Start()
    {
        // Get the Rigidbody2D component attached to the player
        rb = GetComponent<Rigidbody2D>();
    }

    void Update()
    {
        float horizontalInput = 0f;
        float verticalInput = 0f;

        // Handle movement input (touch or keyboard)
        if (Input.touchCount > 0)
        {
            Touch touch = Input.GetTouch(0);

            if (touch.position.x < Screen.width / 2)
                horizontalInput = -1;
            else if (touch.position.x > Screen.width / 2)
                horizontalInput = 1;

            if (touch.position.y < Screen.height / 2)
                verticalInput = -1;
            else if (touch.position.y > Screen.height / 2)
                verticalInput = 1;

            // Check if it's time to fire again based on the fire rate
            if (Time.time >= nextFireTime)
            {
                Shoot();
                nextFireTime = Time.time + fireRate;
            }
        }
        else
        {
            // Keyboard input for testing on PC
            horizontalInput = Input.GetAxis("Horizontal");
            verticalInput = Input.GetAxis("Vertical");

            // Allow shooting with spacebar (for testing)
            if (Input.GetKey(KeyCode.Space) && Time.time >= nextFireTime)
            {
                Shoot();
                nextFireTime = Time.time + fireRate;
            }
        }

        // Set velocity for movement
        rb.velocity = new Vector2(horizontalInput * speed, verticalInput * speed);

        // Clamp position to screen boundaries
        float clampedX = Mathf.Clamp(rb.position.x, -boundaryX, boundaryX);
        float clampedY = Mathf.Clamp(rb.position.y, -boundaryY, boundaryY);
        rb.position = new Vector2(clampedX, clampedY);
    }

    // Method to handle shooting
    void Shoot()
    {
        GameObject projectile = Instantiate(projectilePrefab, new Vector2(transform.position.x, transform.position.y + 0.5f), Quaternion.identity);

        Rigidbody2D projectileRb = projectile.GetComponent<Rigidbody2D>();
        projectileRb.velocity = Vector2.up * projectileSpeed;

        Destroy(projectile, projectileLifetime);
    }

}
