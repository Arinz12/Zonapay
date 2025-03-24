if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/worker.js')
      .then(registration => console.log('Service Worker registered'))
      .catch(error => console.log('Registration failed:', error));
}