using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using TMPro;

public class GameIdInput : MonoBehaviour
{
  public TMP_InputField gameIdInput;
  private string gameId;

  void Start()
  {
    // Add listeners for TMP_InputField events
    gameIdInput.onSelect.AddListener(OnInputSelected);
    gameIdInput.onDeselect.AddListener(OnInputDeselected);
    gameIdInput.onValueChanged.AddListener(OnInputValueChanged);
  }

  void OnInputSelected(string text)
  {
    // Use ExternalCall to invoke the JavaScript function
#if UNITY_WEBGL && !UNITY_EDITOR
        Application.ExternalCall("showFallbackInput", "gameIdInput");
#endif
  }

  void OnInputDeselected(string text)
  {
    // Handle input deselection (optional)
    Debug.Log("Input field deselected.");
  }

  void OnInputValueChanged(string value)
  {
    // Update game ID and pass it to the GameManager
    gameId = value;
    GameManager.Instance.SetGameId(gameId);
  }

  // TODO
  // NOTE: Add the following JavaScript function to the index.html file in the WebGL build folder
  /*
  function showFallbackInput(fieldId) {
    const input = document.createElement('input');
    input.type = 'text';
    input.id = fieldId;
    input.style.position = 'absolute';
    input.style.top = '50%';
    input.style.left = '50%';
    input.style.transform = 'translate(-50%, -50%)';
    input.style.zIndex = 1000;
    input.style.fontSize = '20px';
    input.style.padding = '10px';
    input.style.border = '1px solid #ccc';
    input.style.borderRadius = '5px';
    input.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';
    document.body.appendChild(input);
    input.focus();

    // Send value back to Unity
    input.oninput = function () {
      unityInstance.SendMessage('GameIdInput', 'OnInputValueChanged', input.value);
    };

    // Remove input on blur
    input.onblur = function () {
      document.body.removeChild(input);
    };
  }
  */

}
