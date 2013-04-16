#!/bin/sh

cd ../three.js/utils/build
python3 build.py --include common --include extras --output ../../build/three.js
python3 build.py --include canvas --output ../../build/three-canvas.js
python3 build.py --include css3d --output ../../build/three-css3d.js
python3 build.py --include webgl --output ../../build/three-webgl.js
python3 build.py --include extras --externs externs/extras.js --output ../../build/three-extras.js
python3 build.py --include math --output ../../build/three-math.js
cd ../../../kaijs

rm ./libs/three.js
rm ./libs/three.min.js
rm ./libs/three-canvas.js
rm ./libs/three-css3d.js
rm ./libs/three-webgl.js
rm ./libs/three-extras.js
rm ./libs/three-math.js
cp ../three.js/build/three.js ./libs
cp ../three.js/build/three-canvas.js ./libs
cp ../three.js/build/three-css3d.js ./libs
cp ../three.js/build/three-webgl.js ./libs
cp ../three.js/build/three-extras.js ./libs
cp ../three.js/build/three-math.js ./libs

rm ../three.js/build/three-canvas.js
rm ../three.js/build/three-css3d.js
rm ../three.js/build/three-webgl.js
rm ../three.js/build/three-extras.js
rm ../three.js/build/three-math.js

cd ../three.js/
git reset --hard
cd ../kaijs
