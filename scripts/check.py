"""Dependency-free checks for static entrypoints, anchors, and local assets."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse, unquote

ROOT = Path(__file__).resolve().parents[1]

class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = set()
        self.refs = []
        self.robots = None
        self.errors = []

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if a.get('id'):
            if a['id'] in self.ids:
                self.errors.append('Duplicate id: ' + a['id'])
            self.ids.add(a['id'])
        if tag == 'img' and not a.get('alt'):
            self.errors.append('Image missing descriptive alt text')
        if tag == 'meta' and a.get('name') == 'robots':
            self.robots = 'noindex' in a.get('content', '')
        for attr in ('src', 'href'):
            if a.get(attr):
                self.refs.append(a[attr])

checked = 0
site_roots = [ROOT / 'reworxct', ROOT / 'ember-and-iron', ROOT / 'garys-hilltop', ROOT / 'mach-detail', ROOT / 'waterbury-aquarium']
for directory in site_roots:
    assert (directory / 'index.html').is_file(), f'Missing site entrypoint: {directory}'
for file in (file for directory in site_roots for file in directory.rglob('*.html')):
    page = Page()
    page.feed(file.read_text(encoding='utf-8'))
    assert page.robots, f'{file}: concept must stay noindex'
    for ref in page.refs:
        url = urlparse(ref)
        if url.scheme or url.netloc:
            continue
        if url.path:
            target = (file.parent / unquote(url.path)).resolve()
            assert target.is_relative_to(ROOT), f'Escaped root: {ref}'
            assert target.exists(), f'Missing local file: {ref}'
        elif url.fragment:
            assert url.fragment in page.ids, f'Missing anchor: {ref}'
    assert not page.errors, page.errors
    checked += 1
assert checked >= len(site_roots), 'Not all concept entrypoints were checked'
showcase = Page()
showcase.feed((ROOT / 'index.html').read_text(encoding='utf-8'))
assert showcase.robots is None, 'Showcase root should remain indexable'
assert not showcase.errors, showcase.errors
for ref in showcase.refs:
    url = urlparse(ref)
    if url.scheme or url.netloc or not url.path:
        continue
    if url.path.startswith('/harbor-and-hollow/assets/'):
        public_path = url.path.removeprefix('/harbor-and-hollow/')
        target = ROOT / 'harbor-and-hollow' / 'public' / public_path
    else:
        target = ROOT / url.path.lstrip('/') if url.path.startswith('/') else ROOT / url.path
    assert target.exists(), f'Missing showcase local target: {ref}'
assert all('/' + site.name + '/' in showcase.refs for site in site_roots), 'Showcase must link to every concept'
harbor = Page()
harbor.feed((ROOT / 'harbor-and-hollow' / 'index.html').read_text(encoding='utf-8'))
assert harbor.robots, 'Harbor and Hollow concept must stay noindex'
assert not harbor.errors, harbor.errors
assert '/harbor-and-hollow/' in showcase.refs
assert (ROOT / 'harbor-and-hollow' / 'public' / 'assets' / 'world' / 'stone.mp4').is_file()
print(f'Validated showcase and {checked + 1} concept pages: local references, fragment links, image labels, unique IDs, concept noindex.')
