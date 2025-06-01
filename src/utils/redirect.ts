// Single Page Apps for GitHub Pages
// MIT License
// https://github.com/rafgraph/spa-github-pages

export function handleRedirect() {
  const pathSegmentsToKeep = 1;

  const l = window.location;
  if (l.pathname.includes('/?/')) {
    const newPath = l.pathname
      .split('/?/')[1]
      .replace(/~and~/g, '&')
      .split('/')
      .slice(pathSegmentsToKeep)
      .join('/');
    
    const newSearch = l.search
      .split('&')
      .map(param => param.replace(/~and~/g, '&'))
      .join('&');

    const newUrl = l.pathname.split('/?/')[0] + '/' + newPath + newSearch + l.hash;
    window.history.replaceState({}, '', newUrl);
  }
} 