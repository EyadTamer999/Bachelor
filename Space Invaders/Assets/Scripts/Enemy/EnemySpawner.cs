using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class EnemySpawner : MonoBehaviour
{
    public GameObject enemyPrefab;       // The enemy prefab to instantiate
    public int rows = 3;                 // Number of rows in the grid
    public int columns = 6;              // Number of columns in the grid
    public float spacing = 1.5f;         // Spacing between enemies
    public float moveSpeed = 1f;         // Horizontal movement speed
    public float moveDownAmount = 0.5f;  // Distance to move down when changing direction
    public float boundaryX = 8f;         // Horizontal boundary for edge detection

    private List<GameObject> enemies;    // List to keep track of enemies
    private bool movingRight = true;     // Direction flag for horizontal movement

    void Start()
    {
        enemies = new List<GameObject>();
        SpawnEnemies();
    }

    void Update()
    {
        MoveEnemies();
    }

    // Spawn the enemies in a grid formation
    void SpawnEnemies()
    {
        for (int row = 0; row < rows; row++)
        {
            for (int col = 0; col < columns; col++)
            {
                // Calculate the position for each enemy in the grid
                Vector2 spawnPosition = new Vector2(
                    transform.position.x + col * spacing,
                    transform.position.y - row * spacing);

                // Instantiate the enemy and add it to the list
                GameObject enemy = Instantiate(enemyPrefab, spawnPosition, Quaternion.identity);
                enemies.Add(enemy);
            }
        }
    }

    // Move the enemies in a group
    void MoveEnemies()
    {
        // Determine the direction and boundaries
        float direction = movingRight ? 1 : -1;
        Vector3 movement = new Vector3(direction * moveSpeed * Time.deltaTime, 0, 0);

        // Move all enemies horizontally
        foreach (GameObject enemy in enemies)
        {
            if (enemy != null)
            {
                enemy.transform.Translate(movement);
            }
        }

        // Check for boundary collision
        foreach (GameObject enemy in enemies)
        {
            if (enemy != null)
            {
                // If any enemy reaches a boundary, reverse direction and move down
                if (movingRight && enemy.transform.position.x >= boundaryX ||
                    !movingRight && enemy.transform.position.x <= -boundaryX)
                {
                    MoveEnemiesDown();
                    movingRight = !movingRight;
                    break;
                }
            }
        }
    }

    // Move all enemies down when changing direction
    void MoveEnemiesDown()
    {
        foreach (GameObject enemy in enemies)
        {
            if (enemy != null)
            {
                enemy.transform.position = new Vector2(
                    enemy.transform.position.x,
                    enemy.transform.position.y - moveDownAmount);
            }
        }
    }
}
