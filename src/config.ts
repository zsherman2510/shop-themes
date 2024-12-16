import themes from "daisyui/src/theming/themes";
import { ConfigProps } from "./types/config";


const config = {
  // REQUIRED
  appName: "SocialGo",
  // REQUIRED: a short description of your app for SEO tags (can be overwritten)
  appDescription:
    "SocialGo is a platform that offers automated content creation and scheduling services for social media to assist entrepreneurs and businesses in managing their online presence more efficiently.",
  // REQUIRED (no https://, no trailing slash at the end, just the naked domain)
  domainName: "socialgo.cc",
  crisp: {
    id: "5b56e419-de52-463f-a9c1-104071395234",
  },
  aws: {
    bucket: "autopostthat",
    bucketUrl: `https://autopostthat.s3.amazonaws.com/`,
    cdn: "https://cdn-id.cloudfront.net/",
  },
  mailgun: {
    subdomain: "",
    fromNoReply: ``,
    fromAdmin: ``,
    supportEmail: "",
    forwardRepliesTo: "",
  },
  brevo: {
    fromNoReply: `SocialGo <noreply@socialgo.cc>`,
    fromAdmin: `Zavion at SocialGo <admin@socialgo.cc>`,
    supportEmail: "admin@socialgo.cc",
    forwardRepliesTo: "admin@socialgo.cc",
  },
  colors: {
    theme: "lofi",
    main: themes["lofi"]["primary"],
  },
  auth: {
    loginUrl: "/auth/signin",
    callbackUrl: "/",
  },
} as ConfigProps;

export default config;
