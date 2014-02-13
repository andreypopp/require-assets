BIN = $(CURDIR)/../node_modules/.bin

start: build
	node ./server.js

build: assets.json

bundle.css bundle.js assets.json::
	$(BIN)/xcss       -t [ ../xcss -o assets.json ]       ./main.css > bundle.css
	$(BIN)/browserify -p [ ../browserify -o assets.json ] ./main.js  > bundle.js
