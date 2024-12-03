using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.EventSystems;
using UnityEngine.InputSystem;

public class MovementJoystick : MonoBehaviour, IPointerDownHandler, IDragHandler, IPointerUpHandler
{
    public GameObject joystick;
    public GameObject joystickBackground;
    public Vector3 joystickVec;
    private Vector3 joystickTouchPos;
    private Vector3 joystickOriginalPos;
    private float joystickRadius;
    private int pointerId = -1;

    void Start()
    {
        joystick.SetActive(false);
        joystickBackground.SetActive(false);
        joystickOriginalPos = joystickBackground.transform.position;
        joystickRadius = joystickBackground.GetComponent<RectTransform>().sizeDelta.y / 4;
    }

    public void OnPointerDown(PointerEventData eventData)
    {
        Debug.Log("PointerDown called on MovementJoystick");

        if (pointerId == -1)
        {
            pointerId = eventData.pointerId;

            Vector2 touchPos = eventData.position;
            joystick.transform.position = touchPos;
            joystickBackground.transform.position = touchPos;
            joystickTouchPos = touchPos;

            joystick.SetActive(true);
            joystickBackground.SetActive(true);
        }
    }

    public void OnDrag(PointerEventData eventData)
    {
        if (eventData.pointerId == pointerId)
        {
            Vector3 dragPos = eventData.position;
            joystickVec = (dragPos - joystickTouchPos).normalized;

            float joystickDist = Vector3.Distance(dragPos, joystickTouchPos);

            joystickDist = Mathf.Min(joystickDist, joystickRadius); // Removed running logic

            joystick.transform.position = joystickTouchPos + joystickVec * joystickDist;
        }
    }

    public void OnPointerUp(PointerEventData eventData)
    {
        if (eventData.pointerId == pointerId)
        {
            joystickVec = Vector2.zero;
            joystick.SetActive(false);
            joystickBackground.SetActive(false);
            pointerId = -1;
        }
    }
}
