import { Serwist } from "serwist";
import { defaultCache } from "@serwist/next/worker";

const serwist = new Serwist({
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
  precacheEntries: self.__SW_MANIFEST,
  fallbacks: {
    entries: [
      {
        url: "/offline",
        matcher: ({ request }) => request.mode === "navigate",
      },
    ],
  },
});

serwist.addEventListeners();
