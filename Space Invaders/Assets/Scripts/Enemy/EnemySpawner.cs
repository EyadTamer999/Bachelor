using System.Collections;
using System.Collections.Generic;
using System.Linq;
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
    public List<char> enemyLetters;            // Array of letters to assign to enemies, the range of letters or the chosen letters will be determined by the instructor
    private List<GameObject> enemies;        // List to keep track of enemies
    private List<char> previousEnemies;      // List to keep track of previous enemies
    private bool movingRight = true;         // Direction flag for horizontal movement
    private string goalString;               // The goal string to match

    void Start()
    {
        ImportLetters();

        enemies = new List<GameObject>();
        previousEnemies = new List<char>();
        goalString = GameManager.Instance.challengeHandler.GetGoalStringConverted();


        SpawnEnemies();
        CopyEnemies();
        CheckIfAnswerExists();

        // Start the enemy shooting coroutine
        StartCoroutine(EnemyShootingRoutine());
    }

    void FixedUpdate()
    {
        CheckIfAnswerExists();
        MoveEnemies();
    }

    // Spawn the enemies in a grid formation
    void SpawnEnemies()
    {
        ImportLetters();
        int totalEnemies = rows * columns;
        HashSet<int> goalPathIndices = new HashSet<int>(); // Tracks indices used for the goal path
        int goalIndex = 0;

        // Ensure the grid has room for the goal string
        if (goalString.Length > totalEnemies)
        {
            Debug.LogError("Goal string is longer than the grid size!");
            return;
        }

        // Step 1: Assign letters from goalString to a valid path (bottom or sides)
        for (int row = rows - 1; row >= 0 && goalIndex < goalString.Length; row--)
        {
            for (int col = 0; col < columns && goalIndex < goalString.Length; col++)
            {
                int currentIndex = row * columns + col;

                // Choose valid positions starting from bottom or sides
                if (row == rows - 1 || col == 0 || col == columns - 1)
                {
                    Vector2 spawnPosition = new Vector2(
                        transform.position.x + col * spacing,
                        transform.position.y - row * spacing);

                    GameObject enemy = Instantiate(enemyPrefab, spawnPosition, Quaternion.identity);

                    // Set the goal letter
                    enemy.GetComponent<Enemy>().SetLetter(goalString[goalIndex]);
                    goalIndex++;
                    goalPathIndices.Add(currentIndex);
                    enemies.Add(enemy);
                }
            }
        }

        // Step 2: Fill remaining grid positions with random letters
        for (int row = 0; row < rows; row++)
        {
            for (int col = 0; col < columns; col++)
            {
                int currentIndex = row * columns + col;

                // Skip positions already assigned for the goal string
                if (goalPathIndices.Contains(currentIndex))
                    continue;

                char randomLetter = enemyLetters[Random.Range(0, enemyLetters.Count)];

                // Ensure the random letter is not the same as the previous letter in this spot
                while (previousEnemies.Count > currentIndex && previousEnemies[currentIndex] == randomLetter)
                {
                    randomLetter = enemyLetters[Random.Range(0, enemyLetters.Count)];
                }

                Vector2 spawnPosition = new Vector2(
                    transform.position.x + col * spacing,
                    transform.position.y - row * spacing);

                GameObject enemy = Instantiate(enemyPrefab, spawnPosition, Quaternion.identity);

                // Set the letter for the enemy
                enemy.GetComponent<Enemy>().SetLetter(randomLetter);
                enemies.Add(enemy);
            }
        }
    }

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

    // Copy the list of enemies to the previousEnemies list
    void CopyEnemies()
    {
        foreach (GameObject enemy in enemies)
        {
            if (enemy != null)
            {
                previousEnemies.Add(enemy.GetComponent<Enemy>().GetLetter());
            }
        }
    }

    // Check if the answer exists in the list of enemies
    void CheckIfAnswerExists()
    {
        string goalString = GameManager.Instance.challengeHandler.GetGoalStringConverted();
        List<char> currentLetters = enemies
            .Where(e => e != null)
            .Select(e => e.GetComponent<Enemy>().GetLetter())
            .ToList();

        bool answerExists = IsGoalAchievable(goalString, currentLetters);

        if (!answerExists)
        {
            Debug.Log("Answer does not exist in the list of enemies, reshuffling...");
            ReshuffleEnemies();
        }
    }


    bool IsGoalAchievable(string goal, List<char> letters)
    {
        // Simple sliding window to find a substring match
        for (int i = 0; i <= letters.Count - goal.Length; i++)
        {
            if (letters.Skip(i).Take(goal.Length).SequenceEqual(goal))
            {
                return true;
            }
        }
        return false;
    }



    // Reshuffle the enemies until the answer exists
    void ReshuffleEnemies()
    {
        foreach (GameObject enemy in enemies)
        {
            if (enemy != null)
            {
                Destroy(enemy);
            }
        }

        enemies.Clear();
        previousEnemies.Clear();

        SpawnEnemies();
        CopyEnemies();
        CheckIfAnswerExists();
    }

    // Import the letters from the GameManager
    void ImportLetters()
    {
        // Get the letters for the current level
        enemyLetters = GameManager.Instance.levelManager.GetLevelLetters();
    }
}
