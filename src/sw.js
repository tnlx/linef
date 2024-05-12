// Core assets
const coreAssets = [
    '/index.html',
    '/favicon.svg',
    '/assets/index.js',
    '/assets/index.css',
];

const CACHE_NAME = "app";

// On install, cache core assets
self.addEventListener('install', function (event) {

    // Cache core assets
    event.waitUntil(caches.open(CACHE_NAME).then(function(cache) {
        coreAssets.forEach(asset => cache.add(new Request(asset)));
        return cache;
    }));
});

// Intercept fetch events
self.addEventListener('fetch', function (event) {

    const request = event.request;
    
    event.respondWith(
        fetch(request).then(function (response) {

            // Create a copy of the response and save it to the cache
            const copy = response.clone();
            event.waitUntil(caches.open(CACHE_NAME).then(function (cache) {
                return cache.put(request, copy);
            }));

            // Return the response
            return response;

        }).catch(async function () {
            const response = await caches.match(request);
            return response;
        })
    );
});