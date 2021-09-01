import { Easing } from "../types";

const easingBlink: Easing = (x) => (
  // .0 .1 .2 .3 .4 .5 .6 .7 .8 .9
  //    /\
  //   /  \
  //  /    \
  // /      \_____________________
  x <= .15 ? x * 6.66 : x <= .3 ? (1 - ((x - 0.5) * 6.66)) : 0
);

export default easingBlink;
