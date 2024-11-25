using System.Collections;
using System.Collections.Generic;
using UnityEngine;


public class Level
{
    public int level { get; private set; }
    public List<string> characters { get; private set; }
    public string text { get; private set; }
    public int turns { get; private set; }

    public Level(int level, List<string> characters, string text, int turns)
    {
        this.level = level;
        this.characters = characters;
        this.text = text;
        this.turns = turns;
    }

}
