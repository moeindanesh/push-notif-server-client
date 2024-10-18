import { Elysia } from "elysia";
import webpush, { PushSubscription } from "web-push";
import { cors } from "@elysiajs/cors";

webpush.setVapidDetails(
  "https://superapp.bamadar.com",
  process.env.vapid_public_key ?? "",
  process.env.vapid_private_key ?? ""
);

const app = new Elysia()
  .get("/", () => "Hello Elysia")
  .listen(3002)
  .use(cors())
  .post("/subscribe", ({ body }) => {
    console.log(body);
    const subscription = body as PushSubscription;
    const payload = JSON.stringify({
      title: "Hello World",
      body: "This is your first push notification",
    });
    webpush
      .sendNotification(subscription, payload)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  });

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
