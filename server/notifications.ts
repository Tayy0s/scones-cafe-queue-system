import { redis } from "./redis"

const subscriptions = new Map<string, PushSubscriptionJSON>();

export function saveSubscription(uuid: string, sub: PushSubscriptionJSON) {
  if (sub.endpoint) redis.set(`subscription_${uuid}`, sub);
}

export function removeSubscription(uuid: string) {
    redis.del(`subscription_${uuid}`);
}

export async function sendPushNotification() {
    if (subscriptions.size === 0) return;
    const webpush = require('web-push');
    webpush.setVapidDetails(
        "",
        process.env.PUBLIC_VAPID_KEY!,
        process.env.PRIVATE_VAPID_KEY!
    );

    const payload = '';

    const sends = [...subscriptions.values()].map(async (sub) => {
        try {
            await webpush.sendNotification(sub as any, payload);
        } catch (err: any) {
            if (err.statusCode === 404 || err.statusCode === 410) {
                redis.del(sub.endpoint!);
            }
        }
    });

    await Promise.allSettled(sends);
}