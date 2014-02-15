BIN = $(CURDIR)/../node_modules/.bin

start: build
	node ./server.js

build: $(CURDIR)/../node_modules/require-assets  assets.json

$(CURDIR)/../node_modules/require-assets:
	ln -s $(CURDIR)/../ $@

bundle.js assets.json::
	$(BIN)/browserify \
		-p [ require-assets-browserify \
					-o assets.json \
					--handler .css:require-assets-css ] \
		./main.js  > bundle.js
