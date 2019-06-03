var CACHE_NAME = 'our-project-cache';
var urlsToCache = [
  'https://xpym.ddns.net/iseseisev-projekt/',
  'https://xpym.ddns.net/iseseisev-projekt/192x192.png',
  'https://xpym.ddns.net/iseseisev-projekt/512x512.png',
  'https://xpym.ddns.net/iseseisev-projekt/index.html',
  'https://xpym.ddns.net/iseseisev-projekt/index.js',
  'https://xpym.ddns.net/iseseisev-projekt/img/bg.png',
  'https://xpym.ddns.net/iseseisev-projekt/img/bird.png',
  'https://xpym.ddns.net/iseseisev-projekt/img/background.png',
  'https://xpym.ddns.net/iseseisev-projekt/img/bird_empty.png',
  'https://xpym.ddns.net/iseseisev-projekt/img/fg.png',
  'https://xpym.ddns.net/iseseisev-projekt/img/pipeBottom.png',
  'https://xpym.ddns.net/iseseisev-projekt/img/pipeUp.png',
  'https://xpym.ddns.net/iseseisev-projekt/img/rules.png',
  'https://xpym.ddns.net/iseseisev-projekt/img/rune_haste.png',
  'https://xpym.ddns.net/iseseisev-projekt/img/rune_invisible.png',
  'https://xpym.ddns.net/iseseisev-projekt/img/rune_score.png',
  'https://xpym.ddns.net/iseseisev-projekt/favicon.png',
  'https://xpym.ddns.net/iseseisev-projekt/audio/score.mp3',
  'https://xpym.ddns.net/iseseisev-projekt/manifest.json'
];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
		console.log(urlsToCache);
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});
