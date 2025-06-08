// Single Page Apps for GitHub Pages
// MIT License
// https://github.com/rafgraph/spa-github-pages

export const handleRedirect = () => {
  // Check if we need to handle any redirects
  const urlParams = new URLSearchParams(window.location.search);
  const redirectTo = urlParams.get('redirectTo');
  
  if (redirectTo) {
    // Remove the redirectTo parameter from the URL
    urlParams.delete('redirectTo');
    const newUrl = window.location.pathname + (urlParams.toString() ? `?${urlParams.toString()}` : '');
    window.history.replaceState({}, '', newUrl);
    
    // Redirect to the specified path
    window.location.href = redirectTo;
  }
};
