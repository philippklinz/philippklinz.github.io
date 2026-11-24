"""Check published static pages, local destinations and supplied content counts."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote

ROOT = Path(__file__).resolve().parent.parent

class Page(HTMLParser):
    def __init__(self, path):
        super().__init__(convert_charrefs=True)
        self.path, self.ids, self.links = path, set(), []
        self.lang, self.skills, self.books = None, 0, 0
        self.h1, self.main = 0, 0
        self.feed(path.read_text())

    def handle_starttag(self, tag, pairs):
        attrs = dict(pairs)
        if 'id' in attrs:
            assert attrs['id'] not in self.ids, (self.path, 'duplicate id', attrs['id'])
            self.ids.add(attrs['id'])
        if tag == 'html': self.lang = attrs.get('lang')
        if tag == 'h1': self.h1 += 1
        if tag == 'main': self.main += 1
        if tag == 'article' and attrs.get('class') == 'skill': self.skills += 1
        if tag == 'article' and attrs.get('class') == 'book': self.books += 1
        if tag == 'img':
            assert attrs.get('alt'), (self.path, 'missing image alt')
            assert attrs.get('width') and attrs.get('height'), (self.path, 'missing image dimensions')
        for key in ('href', 'src'):
            if key in attrs: self.links.append(attrs[key])

paths = {'index.html': 'en', 'de/index.html': 'de', 'pl/index.html': 'pl', '404.html': 'en'}
pages = {(ROOT / path).resolve(): Page(ROOT / path) for path in paths}
for rel, lang in paths.items():
    path = (ROOT / rel).resolve()
    page = pages[path]
    assert page.lang == lang, (rel, 'incorrect document language')
    assert page.h1 == 1 and page.main == 1, (rel, 'landmarks')
    if rel != '404.html':
        assert page.skills == 10 and page.books == 3, (rel, 'content counts')
    for link in page.links:
        parts = urlsplit(link)
        assert parts.scheme not in ('javascript', 'data'), (rel, 'unexpected URL', link)
        if parts.scheme or parts.netloc: continue
        target = (path.parent / unquote(parts.path)).resolve() if parts.path else path
        if target.is_dir(): target /= 'index.html'
        assert target.is_relative_to(ROOT), (rel, 'outside site', link)
        assert target.is_file(), (rel, 'missing target', link)
        if parts.fragment and target in pages:
            assert unquote(parts.fragment) in pages[target].ids, (rel, 'missing anchor', link)
print('PASS: 3 complete pages, multilingual 404, 10 skills groups and 3 books per language; local assets and anchors resolve.')
