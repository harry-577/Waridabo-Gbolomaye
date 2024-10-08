const CACHE_NAME = "ulo-cache-v1";
const urlsToCache = [
  //"/Ulo/",
  "/Ulo/index.html",
  "/Ulo/estate1.html",
  "/Ulo/buildingdb2.html",
  "/Ulo/tenantdb3.html",
  "/Ulo/styles.css",
  "/Ulo/input.css",
  "/Ulo/output.css",
  "/Ulo/manifest.json",
  "https://raw.githubusercontent.com/harry-577/Ulo/main/Images4Estate/Favicon%2032x32.jpg",
  "https://raw.githubusercontent.com/harry-577/Ulo/main/Images4Estate/house%20360%20192x192.png",
  "https://raw.githubusercontent.com/harry-577/Ulo/main/Images4Estate/house%20360%20512x512.png",
  "https://raw.githubusercontent.com/harry-577/Ulo/main/Images4Estate/7a.jpg",
  "https://raw.githubusercontent.com/harry-577/Ulo/main/Images4Estate/add_home%20Google.svg",
  "https://raw.githubusercontent.com/harry-577/Ulo/main/Images4Estate/delete_Bin%20Google.svg",
  "https://raw.githubusercontent.com/harry-577/Ulo/main/Images4Estate/edit_google.svg",
  "https://raw.githubusercontent.com/harry-577/Ulo/main/Images4Estate/house%20360.png",
  "https://raw.githubusercontent.com/harry-577/Ulo/main/Images4Estate/house_3%20google.svg",
  "https://raw.githubusercontent.com/harry-577/Ulo/main/Images4Estate/house_5%20google.svg",
  "https://raw.githubusercontent.com/harry-577/Ulo/main/Images4Estate/logout_Google.svg",
  "https://raw.githubusercontent.com/harry-577/Ulo/main/Images4Estate/person_add_gooleFont.svg",
  "https://raw.githubusercontent.com/harry-577/Ulo/main/Images4Estate/person_cancel_Google.svg",
  "https://raw.githubusercontent.com/harry-577/Ulo/main/Images4Estate/person_edit_Google.svg",
  "https://raw.githubusercontent.com/harry-577/Ulo/main/Images4Estate/Persons%20groups.svg",
  "https://raw.githubusercontent.com/harry-577/Ulo/main/Images4Estate/Search.256.png",
  "https://raw.githubusercontent.com/harry-577/Ulo/main/Images4Estate/share_google.svg",
  "https://raw.githubusercontent.com/harry-577/Ulo/main/Images4Estate/warning_Google.svg",
];

self.addEventListener('install', (event) => {
  console.log('Service Worker installing.');
  self.skipWaiting(); // Force the waiting service worker to become the active service worker
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache');
      return cache.addAll(urlsToCache).then(() => {
        console.log('All resources have been cached');
      }).catch((error) => {
        console.error('Failed to cache resources:', error);
      });
    })
  );
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating.');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  clients.claim(); // Take control of all clients as soon as the service worker becomes active
});

self.addEventListener('fetch', (event) => {
  console.log('Fetch event for ', event.request.url);
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        console.log('Found ', event.request.url, ' in cache');
        return response;
      }
      console.log('Network request for ', event.request.url);
      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200) {
          console.error('Network request failed for ', event.request.url);
          return caches.match('/');
        }
        return caches.open(CACHE_NAME).then((cache) => {
          console.log('Caching new resource: ', event.request.url);
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      });
    }).catch((error) => {
      console.error('Fetch failed; returning offline page instead.', error);
      return caches.match('/');
    })
  );
});
