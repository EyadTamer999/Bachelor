using System.Collections;
using System.Collections.Generic;
using UnityEngine;

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

    // Letters used in the current level
    private List<char> letters;

    // The goal string for this turn
    private string goalString;

    // Number of turns in the current level
    private int turns;

    // Number of successful turns completed
    private int passedTurns = 0;




    // Set the levels
    public void SetLevels(List<Level> levels)
    {
        this.levels = levels;
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
        }
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
        }
    }

    // Check if the current level is passed
    public bool CheckLevelPassed()
    {
        int totalTurns = levels[currentLevel - 1].turns;
        return passedTurns > totalTurns / 2 || (totalTurns == 1 && passedTurns == 1);
    }
}
