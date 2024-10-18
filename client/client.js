const publicVapidKey =
  "BFlFR7kRcWrDTC-OfRahxiCg6JsW6PCwzSl7xlAz8RBSVK9X2Z8dLMSPTsaAyVEKc7G0NrnQqTfPub3k94f_QhU";

if ("serviceWorker" in navigator) {
  registerServiceWorker().catch(console.log);
}

async function registerServiceWorker() {
  const register = await navigator.serviceWorker.register("./worker.js", {
    scope: "/client/",
  });

  const subscription = await register.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: publicVapidKey,
  });

  try {
    await fetch("http://localhost:3002/subscribe", {
      method: "POST",
      body: JSON.stringify(subscription),
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error(error);
  }
}
