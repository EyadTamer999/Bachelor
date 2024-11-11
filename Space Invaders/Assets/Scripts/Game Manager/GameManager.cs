using UnityEngine;

public class GameManager : MonoBehaviour
{
    public static GameManager Instance { get; private set; }
    public ChallengeHandler ChallengeHandler { get; private set; }

    private void Awake()
    {
        if (Instance == null)
        {
            Instance = this;
            DontDestroyOnLoad(gameObject);

            // Cache ChallengeHandler reference
            ChallengeHandler = GetComponentInChildren<ChallengeHandler>(true);
        }
        else
        {
            Destroy(gameObject);
        }
    }
}
