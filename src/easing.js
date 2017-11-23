
// -------------------------------------
// Easing
// -------------------------------------

// inspired [here](https://github.com/nnnick/Chart.js/blob/master/src/Chart.Core.js#L538)

function linear (t) {
  return t
}

function easeInQuad (t) {
  return t * t
}

function easeOutQuad (t) {
  return -1 * t * (t - 2)
}

function easeInOutQuad (t) {
  if ((t /= 1 / 2) < 1) {
    return 1 / 2 * t * t
  }
  return -1 / 2 * ((--t) * (t - 2) - 1)
}

function easeInCubic (t) {
  return t * t * t
}

function easeOutCubic (t) {
  return 1 * ((t = t / 1 - 1) * t * t + 1)
}

function easeInOutCubic (t) {
  if ((t /= 1 / 2) < 1) {
    return 1 / 2 * t * t * t
  }
  return 1 / 2 * ((t -= 2) * t * t + 2)
}

function easeInSine (t) {
  return -1 * Math.cos(t / 1 * (Math.PI / 2)) + 1
}

function easeOutSine (t) {
  return 1 * Math.sin(t / 1 * (Math.PI / 2))
}

function easeInOutSine (t) {
  return -1 / 2 * (Math.cos(Math.PI * t / 1) - 1)
}

function easeInExpo (t) {
  return (t === 0) ? 1 : 1 * Math.pow(2, 10 * (t / 1 - 1))
}

function easeOutExpo (t) {
  return (t === 1) ? 1 : 1 * (-Math.pow(2, -10 * t / 1) + 1)
}

function easeInOutExpo (t) {
  if (t === 0) {
    return 0
  }
  if (t === 1) {
    return 1
  }
  if ((t /= 1 / 2) < 1) {
    return 1 / 2 * Math.pow(2, 10 * (t - 1))
  }
  return 1 / 2 * (-Math.pow(2, -10 * --t) + 2)
}

function easeInCirc (t) {
  if (t >= 1) {
    return t
  }
  return -1 * (Math.sqrt(1 - (t /= 1) * t) - 1)
}

function easeOutCirc (t) {
  return 1 * Math.sqrt(1 - (t = t / 1 - 1) * t)
}

function easeInOutCirc (t) {
  if ((t /= 1 / 2) < 1) {
    return -1 / 2 * (Math.sqrt(1 - t * t) - 1)
  }
  return 1 / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1)
}

function easeInElastic (t) {
  var s = 1.70158
  var p = 0
  var a = 1
  if (t === 0) {
    return 0
  }
  if ((t /= 1) === 1) {
    return 1
  }
  if (!p) {
    p = 1 * 0.3
  }
  if (a < Math.abs(1)) {
    a = 1
    s = p / 4
  } else {
    s = p / (2 * Math.PI) * Math.asin(1 / a)
  }
  return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * 1 - s) * (2 * Math.PI) / p))
}

function easeOutElastic (t) {
  var s = 1.70158
  var p = 0
  var a = 1
  if (t === 0) {
    return 0
  }
  if ((t /= 1) === 1) {
    return 1
  }
  if (!p) {
    p = 1 * 0.3
  }
  if (a < Math.abs(1)) {
    a = 1
    s = p / 4
  } else {
    s = p / (2 * Math.PI) * Math.asin(1 / a)
  }
  return a * Math.pow(2, -10 * t) * Math.sin((t * 1 - s) * (2 * Math.PI) / p) + 1
}

function easeInOutElastic (t) {
  var s = 1.70158
  var p = 0
  var a = 1
  if (t === 0) {
    return 0
  }
  if ((t /= 1 / 2) === 2) {
    return 1
  }
  if (!p) {
    p = 1 * (0.3 * 1.5)
  }
  if (a < Math.abs(1)) {
    a = 1
    s = p / 4
  } else {
    s = p / (2 * Math.PI) * Math.asin(1 / a)
  }
  if (t < 1) {
    return -0.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * 1 - s) * (2 * Math.PI) / p))
  }
  return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * 1 - s) * (2 * Math.PI) / p) * 0.5 + 1
}

function easeInBack (t) {
  var s = 1.70158
  return 1 * (t /= 1) * t * ((s + 1) * t - s)
}

function easeOutBack (t) {
  var s = 1.70158
  return 1 * ((t = t / 1 - 1) * t * ((s + 1) * t + s) + 1)
}

function easeInOutBack (t) {
  var s = 1.70158
  if ((t /= 1 / 2) < 1) {
    return 1 / 2 * (t * t * (((s *= (1.525)) + 1) * t - s))
  }
  return 1 / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2)
}

function easeInBounce (t) {
  return 1 - easeOutBounce(1 - t)
}

function easeOutBounce (t) {
  if ((t /= 1) < (1 / 2.75)) {
    return 1 * (7.5625 * t * t)
  } else if (t < (2 / 2.75)) {
    return 1 * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75)
  } else if (t < (2.5 / 2.75)) {
    return 1 * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375)
  } else {
    return 1 * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375)
  }
}

function easeInOutBounce (t) {
  if (t < 1 / 2) {
    return easeInBounce(t * 2) * 0.5
  }
  return easeOutBounce(t * 2 - 1) * 0.5 + 1 * 0.5
}

export {
  linear,
  easeInQuad,
  easeOutQuad,
  easeInOutQuad,
  easeInCubic,
  easeOutCubic,
  easeInOutCubic,
  easeInSine,
  easeOutSine,
  easeInOutSine,
  easeInExpo,
  easeOutExpo,
  easeInOutExpo,
  easeInCirc,
  easeOutCirc,
  easeInOutCirc,
  easeInElastic,
  easeOutElastic,
  easeInOutElastic,
  easeInBack,
  easeOutBack,
  easeInOutBack,
  easeInBounce,
  easeOutBounce,
  easeInOutBounce
}
