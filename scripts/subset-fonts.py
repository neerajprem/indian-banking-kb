"""Rebuild the self-hosted fonts in src/assets/fonts from Fontsource (OFL licensed).

Each family is cut to the characters the site uses and its weight axis narrowed to the weights
the design uses (Literata 400-700, Schibsted Grotesk 400-800). The rupee sign lives in a tiny
separate face loaded only when a page contains it.   Requires: pip install fonttools brotli
"""
import os
from fontTools.ttLib import TTFont
from fontTools import subset
from fontTools.varLib import instancer

SRC = 'node_modules/@fontsource-variable'
OUT = 'src/assets/fonts'
TEXT = [(0x20, 0x7E), (0xA0, 0xFF), (0x131, 0x131), (0x152, 0x153), (0x2C6, 0x2C6), (0x2DA, 0x2DA), (0x2DC, 0x2DC), (0x2009, 0x2009),
        (0x200B, 0x200B), (0x2010, 0x2014), (0x2018, 0x201E), (0x2022, 0x2022), (0x2026, 0x2026), (0x2032, 0x2033), (0x2039, 0x203A),
        (0x20AC, 0x20AC), (0x2122, 0x2122), (0x2190, 0x2193), (0x2212, 0x2212), (0x2248, 0x2248), (0x2260, 0x2260), (0x2264, 0x2265), (0xFEFF, 0xFEFF), (0xFFFD, 0xFFFD)]
FAMILIES = [('literata', 'literata', (400, 700)), ('schibsted-grotesk', 'schibsted', (400, 800))]

def cut(src, out, ranges, wght):
    opts = subset.Options()
    opts.flavor = 'woff2'
    opts.layout_features = ['kern', 'liga', 'calt', 'ccmp', 'locl', 'mark', 'mkmk', 'pnum', 'tnum', 'lnum']
    font = TTFont(src)
    s = subset.Subsetter(opts)
    s.populate(unicodes=[c for a, b in ranges for c in range(a, b + 1)])
    s.subset(font)
    font = instancer.instantiateVariableFont(font, {'wght': wght})
    font.flavor = 'woff2'
    font.save(out)
    print(f'{out}: {os.path.getsize(out) // 1024} KB')

for pkg, short, wght in FAMILIES:
    cut(f'{SRC}/{pkg}/files/{pkg}-latin-wght-normal.woff2', f'{OUT}/{short}-latin.woff2', TEXT, wght)
    cut(f'{SRC}/{pkg}/files/{pkg}-latin-ext-wght-normal.woff2', f'{OUT}/{short}-rupee.woff2', [(0x20B9, 0x20B9)], wght)
