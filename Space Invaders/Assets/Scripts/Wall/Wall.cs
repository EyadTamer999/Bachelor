using UnityEngine;

public class Wall : MonoBehaviour
{
    public int maxHealth = 6; // Maximum health of the wall
    private int currentHealth; // Current health of the wall
    private SpriteRenderer spriteRenderer; // Reference to the SpriteRenderer component
    private Sprite currentBaseSprite; // Store the currently selected base sprite
    public Sprite[] spriteVariations; // Array of sprite variations for the wall

    void Start()
    {
        currentHealth = maxHealth; // Initialize current health
    }

    // Method to take damage
    public void TakeDamage()
    {
        currentHealth--; // Decrease health by 1

        if (currentHealth >= 0 && currentHealth < spriteVariations.Length)
        {
            spriteRenderer = GetComponent<SpriteRenderer>();
            spriteRenderer.sprite = spriteVariations[currentHealth];
        }

        // Check if the wall is destroyed
        if (currentHealth <= 0)
        {
            DestroyWall(); // Call the method to handle wall destruction
        }
    }

    // Method to destroy the wall
    private void DestroyWall()
    {
        Debug.Log("Wall has been destroyed!");
        // Here you can add any destruction effects or animations before destroying the object
        Destroy(gameObject); // Destroy the wall GameObject
    }


    private void OnCollisionEnter2D(Collision2D collision)
    {
        Debug.Log("Collision detected with: " + collision.gameObject.name);
        // Check if the collision is with a projectile
        if (collision.gameObject.CompareTag("Projectile") || collision.gameObject.CompareTag("EnemyProjectile"))
        {
            // Take damage based on the projectile's damage value
            TakeDamage();
            Destroy(collision.gameObject); // Destroy the projectile
        }
    }

}
