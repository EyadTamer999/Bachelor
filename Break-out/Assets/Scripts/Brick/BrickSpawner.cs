using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class BrickSpawner : MonoBehaviour
{
    public GameObject brickPrefab; // Prefab of the brick to spawn
    public int totalBricks = 9; // Total number of bricks to spawn
    public float brickSpacing = 0.2f; // Space between each brick for tighter spacing
    public Vector2 boundaryMin = new Vector2(-1.8f, -3f); // Minimum boundary limits
    public Vector2 boundaryMax = new Vector2(1.8f, 2f); // Maximum boundary limits

    public Sprite[] brickSprites; // Array of sprites for random selection
    public int[] brickHealthValues; // Health values corresponding to each sprite

    private List<Vector2> occupiedPositions = new List<Vector2>(); // Track occupied positions

    void Start()
    {
        SpawnBricks();
    }

    void SpawnBricks()
    {
        float brickWidth = brickPrefab.transform.localScale.x;
        float brickHeight = brickPrefab.transform.localScale.y;

        // Adjust boundaries to account for the size of the bricks
        Vector2 adjustedBoundaryMin = new Vector2(
            boundaryMin.x + brickWidth / 2,
            boundaryMin.y + brickHeight / 2
        );

        Vector2 adjustedBoundaryMax = new Vector2(
            boundaryMax.x - brickWidth / 2,
            boundaryMax.y - brickHeight / 2
        );

        int maxAttempts = 1000; // Maximum number of attempts to find a valid position

        for (int i = 0; i < totalBricks; i++)
        {
            Vector2 brickPosition;
            int attempt = 0; // Track the number of attempts

            // Find a valid random position or exit if attempts are exhausted
            do
            {
                // Generate a random position within adjusted boundaries
                float randomX = Random.Range(adjustedBoundaryMin.x, adjustedBoundaryMax.x);
                float randomY = Random.Range(adjustedBoundaryMin.y, adjustedBoundaryMax.y);
                brickPosition = new Vector2(randomX, randomY);

                attempt++;
                // Exit if we exceed max attempts
                if (attempt >= maxAttempts)
                {
                    Debug.LogWarning("Max attempts reached. Could not find a valid position for the brick.");
                    break;
                }
            } while (IsPositionOccupied(brickPosition));

            // If a valid position was found, spawn the brick
            if (attempt < maxAttempts)
            {
                // Instantiate the brick at the valid random position
                GameObject brick = Instantiate(brickPrefab, brickPosition, Quaternion.identity);

                // Randomize brick sprite and assign health value
                SpriteRenderer spriteRenderer = brick.GetComponent<SpriteRenderer>();
                BrickHealth brickHealth = brick.GetComponent<BrickHealth>();

                if (spriteRenderer != null && brickSprites.Length > 0 && brickHealth != null)
                {
                    // Choose a random index for the sprite and health
                    int randomIndex = Random.Range(0, brickSprites.Length);
                    spriteRenderer.sprite = brickSprites[randomIndex];

                    // Assign health based on the selected sprite
                    brickHealth.health = brickHealthValues[randomIndex];
                }

                // Add the position to the occupied list
                occupiedPositions.Add(brickPosition);
            }
        }
    }

    // Check if a position is already occupied by another brick
    bool IsPositionOccupied(Vector2 position)
    {
        foreach (Vector2 occupied in occupiedPositions)
        {
            // Check if the distance between positions is less than the brick size + spacing
            if (Vector2.Distance(position, occupied) < (brickPrefab.transform.localScale.x + brickSpacing))
            {
                return true; // Position is occupied
            }
        }
        return false; // Position is free
    }

    public void SetBricksAmount(int amount)
    {
        totalBricks = amount;
    }


}