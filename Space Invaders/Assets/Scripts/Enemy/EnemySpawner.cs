using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class EnemySpawner : MonoBehaviour
{
    public GameObject enemyPrefab;           // The enemy prefab to instantiate
    public GameObject projectilePrefab;      // The projectile prefab for enemy shooting
    public int rows = 3;                     // Number of rows in the grid
    public int columns = 6;                  // Number of columns in the grid
    public float spacing = 1.5f;             // Spacing between enemies
    public float moveSpeed = 1f;             // Horizontal movement speed
    public float moveDownAmount = 0.5f;      // Distance to move down when changing direction
    public float boundaryX = 8f;             // Horizontal boundary for edge detection
    public float shootingInterval = 1.5f;    // Interval between enemy shots
    public float projectileSpeed = 5f;       // Speed of the projectile
    public float projectileLifetime = 4f;    // Lifetime of the projectile

    //TODO get the enemy letters from the range of that the user inputs
    public char[] enemyLetters;            // Array of letters to assign to enemies

    private List<GameObject> enemies;        // List to keep track of enemies
    private List<char> previousEnemies;      // List to keep track of previous enemies
    private bool movingRight = true;         // Direction flag for horizontal movement
    private string goalString;               // The goal string to match

    void Start()
    {
        enemies = new List<GameObject>();
        previousEnemies = new List<char>();
        goalString = GameManager.Instance.challengeHandler.GetGoalStringConverted();


        //TODO if the answer does not exist then respawn/reshuffle the enemies

        SpawnEnemies();

        // Start the enemy shooting coroutine
        StartCoroutine(EnemyShootingRoutine());
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
                // pick a random letter from the array
                char letter = enemyLetters[Random.Range(0, enemyLetters.Length)];

                Vector2 spawnPosition = new Vector2(
                    transform.position.x + col * spacing,
                    transform.position.y - row * spacing);

                GameObject enemy = Instantiate(enemyPrefab, spawnPosition, Quaternion.identity);

                // Set the letter for the enemy
                enemy.GetComponent<Enemy>().SetLetter(letter);

                enemies.Add(enemy);
            }
        }
    }

    //TODO Respawn the enemies if the answer does not exist

    // Move the enemies in a group
    void MoveEnemies()
    {
        float direction = movingRight ? 1 : -1;
        Vector3 movement = new Vector3(direction * moveSpeed * Time.deltaTime, 0, 0);

        foreach (GameObject enemy in enemies)
        {
            if (enemy != null)
            {
                enemy.transform.Translate(movement);
            }
        }

        foreach (GameObject enemy in enemies)
        {
            if (enemy != null)
            {
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

    // Coroutine to handle enemy shooting
    IEnumerator EnemyShootingRoutine()
    {
        while (enemies.Count > 0) // Loop while there are still enemies
        {
            yield return new WaitForSeconds(shootingInterval);

            // Pick a random enemy that is still active in the scene
            GameObject shootingEnemy = GetRandomActiveEnemy();
            if (shootingEnemy != null)
            {
                ShootProjectile(shootingEnemy.transform.position);
            }
        }
    }

    // Get a random active enemy from the list
    GameObject GetRandomActiveEnemy()
    {
        List<GameObject> activeEnemies = enemies.FindAll(enemy => enemy != null);

        if (activeEnemies.Count > 0)
        {
            int randomIndex = Random.Range(0, activeEnemies.Count);
            return activeEnemies[randomIndex];
        }

        return null;
    }

    // Shoot a projectile from a given position
    void ShootProjectile(Vector2 position)
    {
        GameObject projectile = Instantiate(projectilePrefab, position, Quaternion.identity);

        Rigidbody2D rb = projectile.GetComponent<Rigidbody2D>();
        rb.velocity = Vector2.down * projectileSpeed; // Move the projectile downward

        Destroy(projectile, projectileLifetime); // Destroy projectile after a set time
    }
}
