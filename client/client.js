const publicVapidKey =
  "BFlFR7kRcWrDTC-OfRahxiCg6JsW6PCwzSl7xlAz8RBSVK9X2Z8dLMSPTsaAyVEKc7G0NrnQqTfPub3k94f_QhU";

document.addEventListener("DOMContentLoaded", () => {
  const subscribeButton = document.getElementById("subscribe");
  subscribeButton.addEventListener("click", () => {
    registerServiceWorker().catch(console.error);
  });
});

async function registerServiceWorker() {
  if ("serviceWorker" in navigator && "PushManager" in window) {
    try {
      const registration = await navigator.serviceWorker.register(
        "./worker.js",
        {
          scope: "/",
        }
      );

      const subscription = await requestNotificationPermissionAndSubscribe(
        registration
      );

      if (subscription) {
        await sendSubscriptionToServer(subscription);
      }
    } catch (error) {
      console.error("Error during service worker registration:", error);
    }
  } else {
    console.log("Push notifications are not supported in this browser");
  }
}

async function requestNotificationPermissionAndSubscribe(registration) {
  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    console.log("Notification permission denied");
    return null;
  }

  try {
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
    });
    console.log("User is subscribed:", subscription);
    return subscription;
  } catch (error) {
    console.error("Failed to subscribe the user:", error);
    return null;
  }
}

async function sendSubscriptionToServer(subscription) {
  const deviceInfo = {
    model: navigator.userAgent,
    browser: navigator.appName,
    browserVersion: navigator.appVersion,
    platform: navigator.platform,
    language: navigator.language,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
  };

  const deviceType = /iPad|iPhone|iPod/.test(navigator.userAgent)
    ? "iOS"
    : /Android/.test(navigator.userAgent)
    ? "Android"
    : "Desktop";

  try {
    const response = await fetch("https://push.handai.app/subscribe", {
      method: "POST",
      body: JSON.stringify({
        subscription,
        userId: "123",
        device: {
          type: deviceType,
          ...deviceInfo,
        },
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Bad status code from server.");
    }

    const responseData = await response.json();
    console.log(responseData);
  } catch (error) {
    console.error("Error sending subscription to server:", error);
  }
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
