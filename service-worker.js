importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');

if(workbox){
  console.log(`Workbox berhasil dimuat`);
}
else{
  console.log(`Workbox gagal dimuat`);
}

workbox.precaching.precacheAndRoute([
  {url:'/', revision:'1'},
  {url:'/index.html', revision:'2'},
  {url:'/matches.html', revision:'1'},
  {url:'/nav.html', revision:'1'},
  {url:'/manifest.json', revision:'1'},
  {url:'/push.js', revision:'1'},
  {url:'/regis-sw.js', revision:'1'},
  {url:'/js/api.js', revision:'14'},
  {url:'/js/date.js', revision:'1'},
  {url:'/js/db.js', revision:'1'},
  {url:'/js/idb.js', revision:'1'},
  {url:'/js/materialize.min.js', revision:'1'},
  {url:'/js/nav.js', revision:'1'},
  {url:'/css/materialize.min.css', revision:'1'},

],
{
  //Ignore all URL parameters.
  ignoreUrlParametersMatching:[/.*/]
});

workbox.routing.registerRoute(
  new RegExp('https://api.football-data.org/v2/'),
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'FetchAPI'
  })
);
workbox.routing.registerRoute(
  new RegExp('/pages/'),
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'pages'
  })
);
workbox.routing.registerRoute(
  new RegExp('/images/'),
  workbox.strategies.cacheOnly({
    cacheName: 'images'
  })
);

workbox.routing.registerRoute(
  new RegExp("/"),
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'Liga Cempion'
  })
);
workbox.routing.registerRoute(
  /.*(?:png|gif|jpg|jpeg|svg$)/,
  workbox.strategies.cacheFirst({
    cacheName: 'images-chache',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0,200]
      }),
      new workbox.expiration.Plugin({
        maxEntries: 100,
        maxAgeSeconds: 60 * 60 * 24 * 7,
      }),
    ]
  })
);
//PUSH NOTIF
  self.addEventListener('push', event => {
    var body;
    if(event.data){
      body = event.data.text();
    }
    else{
      body = 'Push message no payload';
    }

    var options = {
      body: body,
      icon: 'images/icon.png',
      vibrate:[100, 50, 100],
      data: {
        dateofArrival: Date.now(),
        primaryKey: 1
      }
    };
    event.waitUntil(
      self.registration.showNotification('Push Notification', options)
    );
  });