using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class EnemySpawner : MonoBehaviour
{
    public GameObject enemyPrefab; // Enemy prefab to spawn
    public float spawnInterval = 1.5f; // Interval between spawns
    public float spawnRangeX = 4f; // Range for horizontal spawning positions

    private void Start()
    {
        // Start spawning enemies repeatedly
        InvokeRepeating(nameof(SpawnEnemy), spawnInterval, spawnInterval);
    }

    void SpawnEnemy()
    {
        // Random horizontal position within the defined range
        float randomX = Random.Range(-spawnRangeX, spawnRangeX);
        Vector2 spawnPosition = new Vector2(randomX, transform.position.y);

        // Instantiate an enemy at the calculated position
        Instantiate(enemyPrefab, spawnPosition, Quaternion.identity);
    }
}
