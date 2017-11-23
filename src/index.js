import Renderium from 'renderium'
import Vector from 'vectory'
import Animation from 'dynamica'
import Kinetic from 'kinetica'
import * as Easing from './easing.js'
import './canvas-layer.js'

class Engine extends Renderium {
  static spawn (engine) {
    super.spawn(engine)
    Kinetic.spawn(engine.kinetic)
  }

  static kill (engine) {
    super.kill(engine)
    Kinetic.kill(engine.kinetic)
  }

  static digest (t) {
    Animation.animate(t)
    Kinetic.notify(t)
    super.digest(t)
  }

  constructor ({ el }) {
    super({ el })
    this.kinetic = new Kinetic({ el })
  }
}

Engine.Vector = window.Vector = Vector
Engine.Animation = Animation
Engine.Kinetic = Kinetic
Engine.Easing = Easing

export default Engine
