#!/bin/bash
xelatex gen.tex
xelatex gen.tex
pdftoppm -singlefile -png -scale-to-x 1024 -scale-to-y 1024 gen.pdf gen
../.venv/bin/python3 ../imgdiv.py gen.png .
rm gen.aux gen.log gen.pdf gen.png
