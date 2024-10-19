import { Elysia, t } from "elysia";
import webpush, { PushSubscription } from "web-push";
import { cors } from "@elysiajs/cors";

webpush.setVapidDetails(
  "https://superapp.bamadar.com",
  process.env.vapid_public_key ?? "",
  process.env.vapid_private_key ?? ""
);

let sub: PushSubscription | undefined = undefined;

const app = new Elysia()
  .use(cors())
  .get("/", () => "Hello Elysia")
  .post(
    "/subscribe",
    ({ body }) => {
      console.log(body);
      const subscription = body.subscription as PushSubscription;
      sub = subscription;
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
    },
    {
      body: t.Object({
        subscription: t.Any(),
        userId: t.String(),
        device: t.Object({
          type: t.String(),
          model: t.String(),
          browser: t.String(),
          browserVersion: t.String(),
        }),
      }),
    }
  )
  .get("/send", () => {
    if (sub) {
      const payload = JSON.stringify({
        title: "Hello World",
        body: "This is another push notification",
      });
      webpush.sendNotification(sub, payload);
    }
  })
  .listen(3002);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
