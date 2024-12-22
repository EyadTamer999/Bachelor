using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;
using Random = UnityEngine.Random;
using System.Threading.Tasks;
public class LevelManager : MonoBehaviour
{
    // List of levels
    private List<Level> levels;

    // Flag to indicate if levels are loaded successfully
    private bool levelsLoadedSuccessfully = false;

    // Events to notify changes in current level and turn
    public event Action<int, int> OnLevelChanged;
    public event Action<int, int> OnTurnChanged;

    // Current level (starts at 1)
    private int currentLevel = 1;

    // Current turn (starts at 1)
    private int currentTurn = 1;

    // Text for the header, e.g., "Convert the following to binary"
    private string headerText;

    // Event to notify when header text changes
    public event Action<string> OnHeaderTextChanged;


    // The goal string for this turn
    private string goalString;

    // Number of turns in the current level
    private int turns;

    // Number of successful turns completed
    private int passedTurns = 0;




    // Start is called before the first frame update
    public async Task<bool> LoadLevels()
    {
        while (GameManager.Instance == null || GameManager.Instance.databaseManager == null)
        {
            await Task.Yield(); // Wait until GameManager is fully initialized
        }

        string gameId = GameManager.Instance.GetGameId();

        // Fetch the levels from the database
        SetLevels(await GameManager.Instance.databaseManager.FetchLevelsById(gameId));

        if (levels == null || levels.Count == 0)
        {
            Debug.LogError("Levels not loaded correctly.");
            return false; // Indicate failure
        }

        Debug.Log("Levels: " + levels);

        SetHeaderText();
        SetGoalString();

        return true; // Indicate success
    }

    public bool AreLevelsLoadedSuccessfully()
    {
        return levelsLoadedSuccessfully;
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

                // Notify turn reset
                OnTurnChanged?.Invoke(currentTurn, levels[currentLevel - 1].turns);
            }
        }
        else
        {
            currentTurn++;

            // Notify turn change
            OnTurnChanged?.Invoke(currentTurn, levels[currentLevel - 1].turns);

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

            // Notify level change
            OnLevelChanged?.Invoke(currentLevel, levels.Count);

            // Also notify turn reset
            OnTurnChanged?.Invoke(currentTurn, levels[currentLevel - 1].turns);

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
        OnHeaderTextChanged?.Invoke(headerText);
    }

    public string GetHeaderText()
    {
        return headerText;
    }

    // Set the Goal string for the current turn
    public void SetGoalString()
    {

        // Get a random goal string for the current turn from the level data
        goalString = levels[currentLevel - 1].goalStrings[Random.Range(0, levels[currentLevel - 1].goalStrings.Count)];

        // Set it in the ChallengeHandler
        GameManager.Instance.challengeHandler.SetGoalString(goalString);
    }

    public int GetCurrentLevel()
    {
        return currentLevel;
    }

    public int GetTotalLevels()
    {
        return levels?.Count ?? 0;
    }

    public int GetCurrentTurn()
    {
        return currentTurn;
    }

    public int GetTotalTurns()
    {
        return levels[currentLevel - 1].turns;
    }

    public bool IsLastLevel()
    {
        return currentLevel == levels.Count;
    }

    public bool IsLastTurn()
    {
        return currentTurn == levels[currentLevel - 1].turns;
    }

    // get the game conversion of the current level
    public string getConversionGame()
    {
        return levels[currentLevel - 1].conversionGame;
    }

}
