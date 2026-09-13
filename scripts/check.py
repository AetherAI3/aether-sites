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
        self.robots = False
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
for file in (ROOT / 'reworxct').rglob('*.html'):
    page = Page()
    page.feed(file.read_text())
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
assert checked, 'No concept entrypoint found'
print(f'Validated {checked} page: local references, fragment links, image labels, unique IDs, noindex.')
