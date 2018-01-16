import Snap from 'snapsvg-cjs';
import { range, random } from 'lodash';

class Bokeh {
  constructor (snap) {
    this.frame = snap;
    this.bounds = this.getBounds();
    this.eventHandler();
    this.render();
  }

  chooseGradientColors () {
    return {
      from: this.randomColor(125, 1),
      to: this.randomColor(125, 1)
    };
  }

  eventHandler () {
    this.frame.node.addEventListener('click', this.render.bind(this));
  }

  render () {
    this.frame.clear();
    this.makeGradient();
    this.makeBokehPoints();
  }

  getBounds () {
    return {
      x: this.frame.node.clientWidth,
      y: this.frame.node.clientHeight
    };
  }

  randomColor (max, alpha) {
    let randn = () => random(0, max);
    return `rgba(${randn()}, ${randn()}, ${randn()}, ${alpha})`;
  }

  makeGradient () {
    let fillRectangle = this.frame.rect(0, 0, this.bounds.x, this.bounds.y);
    let colors = this.chooseGradientColors();
    let gradient = this.frame.gradient(
      `r(0.5, 0.5, 0.5)${colors.from}-${colors.to}`
    );
    fillRectangle.attr({
      fill: gradient
    });
  }

  makeBokehPoints () {
    let chooseColor = () => {
      let opacity = Math.random() * 0.5;
      if (Math.random() < 0.25) {
        return this.randomColor(255, opacity);
      }
      return `rgba(255, 250, 205, ${opacity})`
    };

    range(random(200, 500)).forEach(() => {
      new BokehPoint(
        this.frame,
        random(0, this.bounds.x),
        random(0, this.bounds.y),
        random(3, 25),
        chooseColor()
      )
    });
  }
}

class BokehPoint {
  constructor (snap, x, y, r, c) {
    this.frame = snap;
    this.position = { x, y };
    this.radius = r;
    this.color = c;
    this.blurAmount = random(0, 12);
    this.render();
  }

  render () {
    let c = this.frame.circle(
      this.position.x,
      this.position.y,
      this.radius
    );
    c.attr({
      fill: this.color,
      filter: this.frame.filter(
        Snap.filter.blur(this.blurAmount, this.blurAmount)
      )
    });
  }
}

let main = () => {
  new Bokeh(Snap('#bokeh'));
};

main();