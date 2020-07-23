npm run build && \
cp ./build/direflowBundle.js ./dist/index.js && \
cp ./package.json ./dist/package.json && \
cd ./dist && \
npm publish
