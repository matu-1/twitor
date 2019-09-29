const CACHE_STATIC_NAME = "static-v1";
const CACHE_DYNAMIC_NAME = "dynamic-v1";
const CACHE_INMUTABLE_NAME = "inmutable-v1";
const CACHE_DYNAMIC_LIMIT = 50;

// todo lo necesario para que funcione es decir es el corazon de la app
const APP_SHELL = [
//   "/",
  "index.html", /// or 'index.html'
  "css/style.css",
  "img/favicon.ico",
  "img/avatars/hulk.jpg",
  "img/avatars/ironman.jpg",
  "img/avatars/spiderman.jpg",
  "img/avatars/thor.jpg",
  "img/avatars/wolverine.jpg",
  "js/app.js"
];

////lo que no se va a modificar jamas
const APP_SHELL_INMUTABLE = [
  "https://fonts.googleapis.com/css?family=Quicksand:300,400",
  "https://fonts.googleapis.com/css?family=Lato:400,300",
  "https://use.fontawesome.com/releases/v5.3.1/css/all.css",
  "css/animate.css",
  "js/libs/jquery.js"
];

self.addEventListener("install", e => {
  const cacheStatic = caches
    .open(CACHE_STATIC_NAME)
    .then(cache => cache.addAll(APP_SHELL));

  const cacheInmutable = caches
    .open(CACHE_INMUTABLE_NAME)
    .then(cache => cache.addAll(APP_SHELL_INMUTABLE));

  e.waitUntil(Promise.all([cacheStatic, cacheInmutable]));
});

//cuando se activa limpio los antiguos caches
self.addEventListener( 'activate', e => {
    const respuesta = caches.keys( keys => {
        keys.forEach( key => {
            if( key !== CACHE_STATIC_NAME && key.includes('static')){
                return caches.delete(key);
            }
        })
    })

    e.waitUntil(respuesta);

});

self.addEventListener( 'fetch', e => {
    //busco la peticion en  el cache 
    const respuesta = caches.match(e.request).then( resp => {
        if(resp) {
            return resp
        }else{
            console.log("no existe en el cache", e.request.url);
            return fetch(e.request).then( newRes => {
                if(newRes.ok){
                    caches.open(CACHE_DYNAMIC_NAME).then( cache => {
                        cache.put(e.request, newRes);
                    })
                    return newRes.clone();
                }else{  ///si no hay internet 
                    return newRes;
                    
                }
            })
        };

    })

    e.respondWith(respuesta);
});