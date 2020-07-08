var webPush = require('web-push');
 
const vapidKeys = {
   "publicKey": "BEj01cYxb5_aL7yLQhibvk9FfJlJqm2K-SvaUGeYmCgy1LmxJ4ol8ubgVU5hjSovWlPuYuHePHZQwSBqVbVTTVU",
   "privateKey": "R0FORXQM9dS1y3_duZ0dEEZbz_QZP2YzAT570HT8SiY"
};
 
 
webPush.setVapidDetails(
   'mailto:almuhtadiaqil13@gmail.com',
   vapidKeys.publicKey,
   vapidKeys.privateKey
)
var pushSubscription = {
   "endpoint": " https://fcm.googleapis.com/fcm/send/c5BxIg4N1Xc:APA91bHouwXvMe7R2mQB5_URN2HBFGyyoNabpuB1L4yS7yUyvC648HmmLwN8vK-J8vTlls9tLo2nf9LXJ_b6i8G-GJ0pjSjF-NZdhg9eQrgd2au48tyRWJ2j7k_Mii6qZnFyoV0oFSBk",
   "keys": {
       "p256dh": "BAKcHtOeRUBkeB4fNzdaAvdv30vy6J5BA+bJmpVzfYjneemfSvcLh8iy9UmAqcs8GVH/0APLcMpg8uaT+xAMmy0=",
       "auth": "hnWasrhjJ6bgytOBkuXZ9A=="
   }
};
var payload = 'Selamat! Aplikasi Anda sudah dapat menerima push notifikasi!';
 
var options = {
   gcmAPIKey: '521441700959',
   TTL: 60
};
webPush.sendNotification(
   pushSubscription,
   payload,
   options
);