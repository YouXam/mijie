from pynput import keyboard
import time

cnt = 0
def on_press(key):
    global cnt
    try:
        cnt += 1
        print(cnt, key)
    except AttributeError:
        pass

# Start the keyboard listener
with keyboard.Listener(on_press=on_press) as listener:
    listener.join()