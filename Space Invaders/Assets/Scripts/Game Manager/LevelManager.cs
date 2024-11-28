using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class LevelManager : MonoBehaviour
{
    // List of levels
    private List<Level> levels;

    // Indicates the current level the player is on
    private int currentLevel;

    // Indicates the current turn the player is on
    private int currentTurn;

    // Indicates the text that will be displayed in the header, e.g. "Convert the following to binary"
    private int headerText;

    // The letters that will be used in the level
    private List<char> letters;

    // The goal string that the player must match for this turn
    private string goalString;

    // The number of turns the player has to complete the level
    private int turns;

    // The number of turns the player got correct
    private int correctTurns;


    // Start is called before the first frame update
    void Start()
    {
        currentLevel = 1;
        currentTurn = 1;
        correctTurns = 0;
    }

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

}
