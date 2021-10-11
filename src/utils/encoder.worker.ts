import { encode } from "upng-js";

/* eslint-disable no-restricted-globals */
self.onmessage = ({ data: [imgs, w, h, cnum, dels, opts] }) => {
  const png = encode(imgs, w, h, cnum, dels, opts);
  self.postMessage(png);
};
/* eslint-enable */
