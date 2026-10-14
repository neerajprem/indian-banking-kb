"""Reads a book PDF: outline entries with page numbers, and the text of each page. Prints JSON."""
import json, subprocess, sys
from pypdf import PdfReader
path = sys.argv[1]
r = PdfReader(path)
out = []
def walk(items, depth=0):
    for it in items:
        if isinstance(it, list): walk(it, depth + 1)
        else:
            try: out.append({"title": it.title.strip(), "page": r.get_destination_page_number(it) + 1, "depth": depth})
            except Exception: pass
walk(r.outline)
text = subprocess.run(["pdftotext", "-layout", path, "-"], capture_output=True, text=True).stdout.split("\f")
print(json.dumps({"pages": len(r.pages), "outline": out, "texts": text[: len(r.pages)]}))
