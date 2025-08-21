console.log('Test file loaded');

const app = document.querySelector<HTMLDivElement>('#app');
if (app) {
  app.innerHTML = '<h1>Test Page Working</h1>';
  console.log('App element found and updated');
} else {
  console.error('App element not found');
}