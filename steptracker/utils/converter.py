def to_calories(steps, climbing=True):
    # climbing meaning going up. False means going down
    return steps * 0.17 if climbing else steps * 0.5


def to_meters(steps):
    return steps * 0.18
