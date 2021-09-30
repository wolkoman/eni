// @ts-ignore
import CockpitSDK from "cockpit-sdk";

export const cockpit = new CockpitSDK({
  host: "https://data.eni.wien",
  accessToken: process.env.COCKPIT_TOKEN
});
