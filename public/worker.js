const cacheName="v2"
const files=["/","/dashboard","/login","/signup"]
self.addEventListener('install', (e) => {
    console.log('Service Worker installed');
    e.waitUntil(
      caches.open(cacheName).then(myCache=>{
        console.log("caching assets")
myCache.addAll(files)
      })
      .then(()=>{self.skipWaiting()})
    )
  });
  
  self.addEventListener("activate", (e) => {
    console.log("Service worker activated");
    console.log("Clearing old cache");
  
    e.waitUntil(
      caches.keys().then((cacheNames) => {
        // Delete caches that don't match the current cache name
        return Promise.all(
          cacheNames.map((cache) => {
            if (cache !== cacheName) {
              console.log(`Deleting cache: ${cache}`);
              return caches.delete(cache);  // Deletes cache if it doesn't match cacheName
            }
          })
        );
      })
    );
  });
  

  self.addEventListener("fetch", (e) => {
    console.log("fetching");
    e.respondWith(
      fetch(e.request)
        .catch(() => {
          // If network request fails, serve from cache
          return caches.match(e.request);
        })
    );
  });
  