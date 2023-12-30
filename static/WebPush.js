import { fetchJSON } from "https://code4sabae.github.io/js/fetchJSON.js";
import { Base64URL } from "https://code4fukui.github.io/Base64URL/Base64URL.js";

export class WebPush {
  constructor(appname) {
    this.appname = appname;
    this.ssname = appname + "_subscription";
  }
  getID() {
    const uuid = localStorage.getItem(this.ssname);
    if (uuid) {
      return uuid;
    }
    return null; // WebPush.subscribe();
  }
  async subscribe() {
    return new Promise((resolve, reject) => {
      if (!window.PushManager) {
        reject("not supported WebPush");
        return;
      }
      const uuid = this.getID();
      console.log("WebPush uuid", uuid);
      if (uuid) {
        resolve(uuid);
        return;
      }
      Notification.requestPermission(async permission => {
        console.log(permission); // 'default', 'granted', 'denied'
        if (permission !== "granted") {
          reject("not granted");
          return;
        }
        const subscription = await this.getSubscription();
        console.log(JSON.stringify(subscription));
        const res = await fetchJSON("./api/subscribe", subscription);
        console.log(res);
        localStorage.setItem(this.ssname, res.uuid);
        resolve(res.uuid);
      });
    });
  };
  async unsubscribe() {
    localStorage.removeItem(this.ssname);
    return new Promise((resolve, reject) => {
      if (!window.PushManager) {
        reject("not supported WebPush");
        return;
      }
      Notification.requestPermission(async permission => {
        console.log(permission); // 'default', 'granted', 'denied'
        if (permission !== "granted") {
          reject("not granted");
          return;
        }
        const subscription = await this.getSubscription();
        const res = await subscription.unsubscribe();
        console.log(res);
        const uuid = this.getID();
        if (uuid) {
          await fetchJSON("./api/unsubscribe", { uuid });
        }
        resolve(uuid);
      });
    });
  }
  async getSubscription() {
    const vapidPublicKeyTxt = await (await fetch("./vapidPublicKey.txt")).text();
    const vapidPublicKey = Base64URL.decode(vapidPublicKeyTxt);
    const registration = await navigator.serviceWorker.register("./WebPushWorker.js", { scope: "/" });
    console.log(registration, vapidPublicKey);

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: vapidPublicKey
    });
    return subscription;
  }
  async push(data) {
    const uuid = this.getID();
    if (!uuid) {
      return { err: "no subscription"}
    }
    return await fetchJSON("./api/push", { uuid, data });
  }
};
