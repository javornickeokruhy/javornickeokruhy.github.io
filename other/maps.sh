#!/bin/bash

cd ../src/main/webapp/res/images/trasy

for file in *-orig.jpg; do convert $file -quality 90 -resize 940x logo-mapy.png -gravity SouthEast -geometry +5+5 -composite "${file%-orig.jpg}-940.jpg"; convert $file -quality 90 -resize 298x "${file%-orig.jpg}-298.jpg"; done
