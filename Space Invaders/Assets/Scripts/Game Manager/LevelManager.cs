using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.Threading.Tasks;
public class LevelManager : MonoBehaviour
{
    // List of levels
    private List<Level> levels;

    // Current level (starts at 1)
    private int currentLevel = 1;

    // Current turn (starts at 1)
    private int currentTurn = 1;

    // Text for the header, e.g., "Convert the following to binary"
    private string headerText;

    // The goal string for this turn
    private string goalString;

    // Number of turns in the current level
    private int turns;

    // Number of successful turns completed
    private int passedTurns = 0;


    // Start is called before the first frame update
    private async void Awake()
    {
        while (GameManager.Instance == null || GameManager.Instance.databaseManager == null)
        {
            await Task.Yield(); // Wait until GameManager is fully initialized
        }

        SetLevels(await GameManager.Instance.databaseManager.FetchLevelsById("1733145840102"));

        if (levels == null || levels.Count == 0)
        {
            Debug.LogError("Levels not loaded correctly.");
            return;
        }

        Debug.Log("Levels: " + levels);

        SetHeaderText();
        SetGoalString();
    }

    // Set the levels
    public void SetLevels(List<Level> levels)
    {
        this.levels = levels;
    }

    // get the levels 
    public List<Level> GetLevels()
    {
        return levels;
    }

    // Get the letters of the current level
    public List<char> GetLevelLetters()
    {
        return levels[currentLevel - 1].characters;
    }

    // Advance to the next turn
    public void NextTurn(bool challengeCompleted)
    {
        Debug.Log("Next turn");
        Debug.Log("Challenge completed: " + challengeCompleted);
        Debug.Log("Current turn: " + currentTurn);

        // Reset the user string
        GameManager.Instance.challengeHandler.SetUserString("");

        // Check if the challenge was completed
        if (challengeCompleted)
        {
            passedTurns++;
        }

        if (currentTurn == levels[currentLevel - 1].turns)
        {
            // Check if the level is passed
            if (CheckLevelPassed() && currentTurn == levels[currentLevel - 1].turns)
            {
                Debug.Log("Level completed!");
                NextLevel();
            }
            else
            {
                Debug.Log("Level failed!");
                currentTurn = 1;
                passedTurns = 0;
            }
        }
        else
        {
            currentTurn++;

            // Set the Goal string for the current turn
            SetGoalString();
        }
    }

    private IEnumerator WaitForSeconds(int seconds)
    {
        yield return new WaitForSeconds(seconds);
    }

    // Advance to the next level
    public void NextLevel()
    {
        if (currentLevel == levels.Count)
        {
            Debug.Log("Game completed!");
        }
        else
        {
            currentLevel++;
            currentTurn = 1;
            passedTurns = 0;

            // Clear the enemies
            GameObject.Find("EnemySpawner").GetComponent<EnemySpawner>().DestroyEnemies();

            // trigger respawn of enemies
            GameObject.Find("EnemySpawner").GetComponent<EnemySpawner>().SpawnEnemies();
        }
    }

    // Check if the current level is passed
    public bool CheckLevelPassed()
    {
        int totalTurns = levels[currentLevel - 1].turns;
        return passedTurns > totalTurns / 2 || (totalTurns == 1 && passedTurns == 1);
    }

    public bool isLastLevel()
    {
        return currentLevel == levels.Count;
    }

    public bool isLastTurn()
    {
        return currentTurn == levels[currentLevel - 1].turns;
    }

    // Set the header text for the current level
    public void SetHeaderText()
    {
        headerText = levels[currentLevel - 1].text;
    }

    // Set the Goal string for the current turn
    public void SetGoalString()
    {

        // Get a random goal string for the current turn from the level data
        goalString = levels[currentLevel - 1].goalStrings[Random.Range(0, levels[currentLevel - 1].goalStrings.Count)];

        // Set it in the ChallengeHandler
        GameManager.Instance.challengeHandler.SetGoalString(goalString);
    }
}
