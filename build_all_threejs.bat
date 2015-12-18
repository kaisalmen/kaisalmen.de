#!\bin\sh

cd ..\js\three.js\utils\build
call build_all.bat
cd ..\..\..\..\kaijs

copy /Y ..\js\three.js\build\three.js .\js\lib\ext
copy /Y ..\js\three.js\build\three.min.js .\js\lib\ext
copy /Y ..\js\three.js\build\three-extras.js .\js\lib\ext
copy /Y ..\js\three.js\build\three-extras.min.js .\js\lib\ext
copy /Y ..\js\three.js\build\three-math.js .\js\lib\ext
copy /Y ..\js\three.js\build\three-math.min.js .\js\lib\ext
