from pathlib import Path
from json import loads as json_loads


ROOT = Path(__file__).resolve().parent


# -- Project information -----------------------------------------------------

project = 'OSVVM Documentation'
author = 'Jim Lewis'
copyright = f'2022, {author} Licensed under CC BY-NC-ND 4.0'

version = '2022.03'
release = version


# -- General configuration ---------------------------------------------------

master_doc = "index"

extensions = [
    "sphinx.ext.extlinks",
    "sphinx.ext.intersphinx",
    'myst_parser'
]

source_suffix = {
    '.rst': 'restructuredtext',
    '.txt': 'markdown',
    '.md': 'markdown',
}

templates_path = ['_templates']

exclude_patterns = ['_build', 'Thumbs.db', '.DS_Store', '*.*_bak', 'z_*']

numfig = True

numfig_format = {
    'figure': 'Figure %s: ', 
    'table': 'Table %s: ', 
    'code-block': 'Listing %s', 
    'section': 'Section %s'
}

# -- Options for HTML output -------------------------------------------------

html_context = {}
ctx = ROOT / "context.json"
if ctx.is_file():
    html_context.update(json_loads(ctx.open("r").read()))

if (ROOT / "_theme").is_dir():
    html_theme_path = ["."]
    html_theme = "_theme"
    html_theme_options = {
        "logo_only": True,
        "home_breadcrumbs": True,
        "vcs_pageview_mode": "blob",
    }
    html_css_files = [
        "theme_overrides.css",
    ]
else:
    html_theme = "alabaster"

html_static_path = ["_static"]

html_logo = str(Path(html_static_path[0]) / "logo.png")
html_favicon = str(Path(html_static_path[0]) / "favicon.png")

htmlhelp_basename = "HDLCDoc"


# -- Sphinx.Ext.InterSphinx --------------------------------------------------------------------------------------------

intersphinx_mapping = {
    "python": ("https://docs.python.org/3/", None),
    "edaa": ("https://edaa-org.github.io", None),
}


# -- Sphinx.Ext.ExtLinks -----------------------------------------------------------------------------------------------

extlinks = {
    "gh": ("https://github.com/OSVVM/%s", ""),
    "pdfdoc": ("https://github.com/OSVVM/Documentation/blob/main/%s", ""),
    "AXI4": ("https://github.com/OSVVM/AXI4/tree/main/%s", ""),
    "UART": ("https://github.com/OSVVM/UART/tree/main/%s", ""),
    "DpRam": ("https://github.com/OSVVM/UART/tree/main/%s", ""),
    "wikipedia": ("https://en.wikipedia.org/wiki/%s", None),
    "awesome": ("https://hdl.github.io/awesome/items/%s", ""),
    "ghsharp": ("https://github.com/OSVVM/osvvm.github.io/issues/%s", "#"),
    "ghissue": ("https://github.com/OSVVM/osvvm.github.io/issues/%s", "issue #"),
    "ghpull": ("https://github.com/OSVVM/osvvm.github.io/pull/%s", "pull request #"),
    "ghsrc": ("https://github.com/OSVVM/osvvm.github.io/blob/main/%s", ""),
}