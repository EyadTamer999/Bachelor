using System.Collections;
using System.Collections.Generic;
using UnityEngine;

[System.Serializable]
public class SpriteVariation
{
    public Sprite baseSprite; // The base sprite
    public Sprite[] variations; // Array to store variations of the base sprite
}

public class Enemy : MonoBehaviour
{
    public float speed = 2f; // Movement speed
    public int health = 1;   // Health of the enemy, can increase for harder enemies

    public List<SpriteVariation> spriteVariations; // List of base sprites and their variations

    private SpriteRenderer spriteRenderer; // Reference to the SpriteRenderer component
    private Sprite currentBaseSprite; // Store the currently selected base sprite
    private int baseSpriteIndex; // Store the index of the selected base sprite

    public float animationInterval = 0.5f; // Interval between animation frames

    private void Start()
    {
        spriteRenderer = GetComponent<SpriteRenderer>();

        // Select a random base sprite from the list
        baseSpriteIndex = Random.Range(0, spriteVariations.Count);
        currentBaseSprite = spriteVariations[baseSpriteIndex].baseSprite;
        spriteRenderer.sprite = currentBaseSprite;

        // Start the animation coroutine
        StartCoroutine(AnimateSprite());
    }

    private void Update()
    {
        // Move the enemy downward over time
        transform.Translate(Vector2.down * speed * Time.deltaTime);
    }

    // Coroutine to alternate between the base and variation sprites
    private IEnumerator AnimateSprite()
    {
        int variationIndex = 0;
        while (true)
        {
            // Toggle between base and variation sprites
            if (spriteRenderer.sprite == currentBaseSprite)
            {
                spriteRenderer.sprite = spriteVariations[baseSpriteIndex].variations[variationIndex];
            }
            else
            {
                spriteRenderer.sprite = currentBaseSprite;
            }

            // Cycle through the variations
            variationIndex = (variationIndex + 1) % spriteVariations[baseSpriteIndex].variations.Length;

            yield return new WaitForSeconds(animationInterval);
        }
    }

    public void TakeDamage(int damage)
    {
        health -= damage;
        if (health <= 0)
        {
            Destroy(gameObject);
        }
    }

    private void OnCollisionEnter2D(Collision2D collision)
    {
        if (collision.gameObject.CompareTag("Projectile"))
        {
            TakeDamage(1);
            Destroy(collision.gameObject);
        }
    }
}
