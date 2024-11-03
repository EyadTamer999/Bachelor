using System.Collections;
using UnityEngine;

public class ProjectileAnimation : MonoBehaviour
{
    public Sprite[] frames; // Array to hold the sprite frames for animation
    public float frameDuration = 0.1f; // Duration for each frame
    private SpriteRenderer spriteRenderer; // Reference to the SpriteRenderer

    void Start()
    {
        spriteRenderer = GetComponent<SpriteRenderer>();
        StartCoroutine(AnimateProjectile());
    }

    // Coroutine to animate the projectile
    private IEnumerator AnimateProjectile()
    {
        int currentFrame = 0;

        while (true) // Loop indefinitely (you can add conditions to stop)
        {
            spriteRenderer.sprite = frames[currentFrame]; // Set current frame
            currentFrame = (currentFrame + 1) % frames.Length; // Loop back to first frame

            yield return new WaitForSeconds(frameDuration); // Wait for the specified frame duration
        }
    }
}
