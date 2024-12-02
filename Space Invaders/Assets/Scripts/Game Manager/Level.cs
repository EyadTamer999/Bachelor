using System.Collections;
using System.Collections.Generic;
using UnityEngine;


public class Level
{
    public int level { get; private set; }
    public List<char> characters { get; private set; }
    public List<string> goalStrings { get; private set; }
    public string text { get; private set; }
    public int turns { get; private set; }

    public Level(int level, List<char> characters, List<string> goalStrings, string text, int turns)
    {
        this.level = level;
        this.characters = characters;
        this.goalStrings = goalStrings;
        this.text = text;
        this.turns = turns;
    }

}
