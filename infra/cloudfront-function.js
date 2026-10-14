// CloudFront Function (viewer request): clean URLs for a directory-format static site.
// /payment-rails/ -> /payment-rails/index.html ; /payment-rails -> /payment-rails/index.html
function handler(event) {
  var request = event.request;
  var uri = request.uri;
  if (uri.endsWith('/')) {
    request.uri = uri + 'index.html';
  } else if (!uri.split('/').pop().includes('.')) {
    request.uri = uri + '/index.html';
  }
  return request;
}
