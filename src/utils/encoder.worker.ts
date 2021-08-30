import { encode } from "upng-js";

self.onmessage = ({ data: [imgs, w, h, cnum, dels, opts] }) => {
  const png = encode(imgs, w, h, cnum, dels, opts);
  self.postMessage(png);
};
