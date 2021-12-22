const prefix = 'BudgetTracker-';
const versionNum = 'versionNum_01';
const NAME = prefix + versionNum;

const CACHE = [
    './index.html',
    './css/styles.css',
    './js/index.js',
    './js/idb.js',
    './icons/icon-512x512.png',
    './icons/icon-384x384.png',
    './icons/icon-192x192.png',
    './icons/icon-152x152.png',
    './icons/icon-144x144.png',
    './icons/icon-128x128.png',
    './icons/icon-96x96.png',
    './icons/icon-72x72.png'
];

self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open(NAME).then(function (cache) {
            console.log('installing cache : ' + NAME);
            return cache.addAll(CACHE)
        })
    )
});

self.addEventListener('activate', function (e) {
    e.waitUntil(
        caches.keys().then(function (mainList) {
            let keepList = mainList.filter(function (legend) {
                return legend.indexOf(prefix);
            });
            keepList.push(NAME);

            return Promise.all(mainList.map(function (legend, i) {
                if (keepList.indexOf(legend) === -1) {
                    console.log('deleting cache : ' + mainList[i] );
                    return caches.delete(mainList[i]);
                }
            }));
        })
    )
});

self.addEventListener('fetch', function (e) {
    console.log('fetch request : ' + e.request.url);
    e.respondWith(
        caches.match(e.request).then(function (request) {
            if (request) { 
                console.log('Cache Incoming! ' + e.request.url);
                return request
            } else {       
                console.log('No cache available, Searching... ' + e.request.url);
                return fetch(e.request)
            }

        })
    )
});