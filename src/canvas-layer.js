import Renderium from 'renderium'

Renderium.CanvasLayer.prototype.drawArea = function ({ points, threshold, color, fillColor, width = 1 }) {
  this.ctx.lineJoin = 'round'

  this.drawPolyline({
    points,
    color,
    width
  })

  this.ctx.fillStyle = this.getColor(fillColor)

  this.ctx.lineTo(points[points.length - 1].x, threshold)
  this.ctx.lineTo(points[0].x, threshold)
  this.ctx.closePath()
  this.ctx.fill()

  this.ctx.lineJoin = 'miter'
}
