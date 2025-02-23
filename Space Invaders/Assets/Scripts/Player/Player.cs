using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Player : MonoBehaviour
{
    public float speed = 5f; // Movement speed
    public float boundaryX = 4.3f; // Horizontal boundary on the x-axis
    public float boundaryY = 9.5f; // Vertical boundary on the y-axis
    public GameObject projectilePrefab; // Reference to the projectile prefab
    public float projectileSpeed = 10f; // Speed of the projectile
    public float fireRate = 0.5f; // Time interval between shots
    public float projectileLifetime = 2f; // Time after which projectiles are destroyed
    public Sprite[] deathSprites; // Array to hold the two death sprites
    public float deathSpriteDuration = 0.5f; // Duration to show the death animation
    public float sensitivity = 1f; // Sensitivity for movement
    public float smoothTime = 0.1f; // Smoothing time for movement

    private Rigidbody2D rb;
    private float nextFireTime; // Tracks when the player can fire next
    private SpriteRenderer spriteRenderer; // Reference to the SpriteRenderer component
    private Vector2 targetVelocity; // Target velocity for smoother movement
    private Vector2 currentVelocity; // Current velocity for smooth damp

    public MovementJoystick joystick; // Reference to the MovementJoystick script

    void Start()
    {
        rb = GetComponent<Rigidbody2D>();
        spriteRenderer = GetComponent<SpriteRenderer>();
    }

    void Update()
    {
        Vector2 input = Vector2.zero;

        // Get all current touches
        Touch[] touches = Input.touches;

        if (touches.Length > 0)
        {
            // Always get joystick input from the first touch (for movement)
            input = joystick.joystickVec; // Use joystick for movement input on touch devices

            // Check for the second finger for shooting
            if (touches.Length > 1 && touches[1].phase == TouchPhase.Began)
            {
                // Check if it's time to fire again based on the fire rate
                if (Time.time >= nextFireTime)
                {
                    Shoot();
                    nextFireTime = Time.time + fireRate;
                }
            }
        }
        else
        {
            // Keyboard input for movement (testing on PC)
            input.x = Input.GetAxis("Horizontal");
            input.y = Input.GetAxis("Vertical");

            // Allow shooting with spacebar (for testing)
            if (Input.GetKey(KeyCode.Space) && Time.time >= nextFireTime)
            {
                Shoot();
                nextFireTime = Time.time + fireRate;
            }
        }

        // Calculate the target velocity with sensitivity
        targetVelocity = input * speed * sensitivity;

        // Smoothly interpolate the velocity
        rb.velocity = Vector2.SmoothDamp(rb.velocity, targetVelocity, ref currentVelocity, smoothTime);

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

    private void OnCollisionEnter2D(Collision2D collision)
    {
        if (collision.gameObject.CompareTag("EnemyProjectile") || collision.gameObject.CompareTag("Enemy"))
        {
            StartCoroutine(ShowDeathAnimation()); // Trigger death animation instead of immediate destruction

            // Reset the game
            GameManager.Instance.ResetGame();
        }
    }

    private IEnumerator ShowDeathAnimation()
    {
        // Disable the player's collider to prevent further collisions
        GetComponent<Collider2D>().enabled = false;
        rb.velocity = Vector2.zero;
        fireRate = float.MaxValue;

        // Loop through the death sprites
        for (float elapsed = 0; elapsed < deathSpriteDuration; elapsed += Time.deltaTime)
        {
            // Switch between the two death sprites
            spriteRenderer.sprite = deathSprites[(int)(elapsed / (deathSpriteDuration / 2)) % 2];
            yield return null; // Wait for the next frame
        }

        // Destroy the player object
        Destroy(gameObject);
    }
}
