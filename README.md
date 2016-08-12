# Mapsmash

Various concepts and tools for working with Google Static Maps API.
You'll need your own API key.

## Python libraries

pylibs/ has

* a script `findwater.py` to fetch static maps with center points regularly spaced within a polygon from an ESRI shapefile. One is included with shapes for all of the US states.  It then uses PIL to look for a defined color for water and saves images locally if they have enough water pixels.  It can be easily modified to change colors or look for other features.
* a script `makehtml.py` to generate HTML output of images from a folders' contents.

Look at the help for each script for usage.  
You will need to create a virtualenv and `pip install -r requirements.txt`

## Watery

`watery/` was generated with `findwater.py` and has tiles for most of the non-coastal water in Washington state.  

* [http://rawgit.com/bryanlandia/mapsmash/master/watery/index.html](http://rawgit.com/bryanlandia/mapsmash/master/watery/index.html)


## Jigsaw

`jigsaw`/ is a JavaScript based tool to fetch an unending southward scroll of very manipulated randomized map images from the Static Maps API.  Edit coordinates in `grab_maps.js` to change where it fetches from.  It's now set to Fairbanks, AK.  You will have to add your own API key to `jigsaw/../gmaps_api_key.js`


## Points South

`points-south`/ was generated with the Jigsaw tool for several cities and has a magnifier look at the maps

* [http://rawgit.com/bryanlandia/mapsmash/master/points-south/index.html](http://rawgit.com/bryanlandia/mapsmash/master/points-south/index.html)




