#!/bin/sh

cd ../js/three.js/utils/build
python build.py --include common --include extras --output ../../build/three.js
python build.py --include canvas --output ../../build/three-canvas.js
python build.py --include css3d --output ../../build/three-css3d.js
python build.py --include webgl --output ../../build/three-webgl.js
python build.py --include extras --externs externs/extras.js --output ../../build/three-extras.js
python build.py --include math --output ../../build/three-math.js
cd ../../../../kaijs

rm ./libs/three.js
if [ -e ./libs/three.min.js ]; then
	rm ./libs/three.min.js
fi
rm ./libs/three-canvas.js
rm ./libs/three-css3d.js
rm ./libs/three-webgl.js
rm ./libs/three-extras.js
rm ./libs/three-math.js
cp ../js/three.js/build/three.js ./libs/ext
cp ../js/three.js/build/three.min.js ./libs/ext
cp ../js/three.js/build/three-extras.js ./libs/ext

rm ../three.js/build/three-canvas.js
rm ../three.js/build/three-css3d.js
rm ../three.js/build/three-webgl.js
rm ../three.js/build/three-extras.js
rm ../three.js/build/three-math.js

cd ../js/three.js/
git reset --hard
cd ../../kaijs
