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

    void Start()
    {
        rb = GetComponent<Rigidbody2D>();
        spriteRenderer = GetComponent<SpriteRenderer>();
    }

    void Update()
    {
        Vector2 input = Vector2.zero;

        // Handle touch input
        if (Input.touchCount > 0)
        {
            Touch touch = Input.GetTouch(0);
            if (touch.phase == TouchPhase.Moved || touch.phase == TouchPhase.Stationary)
            {
                // Map the touch delta to movement
                input.x = (touch.position.x - Screen.width / 2) / (Screen.width / 2);
                input.y = (touch.position.y - Screen.height / 2) / (Screen.height / 2);

                // Clamp input to be within -1 to 1
                input = Vector2.ClampMagnitude(input, 1f);

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
            // Keyboard input for testing on PC
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
