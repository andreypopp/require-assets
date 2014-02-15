BIN = $(CURDIR)/../node_modules/.bin

start: build
	node ./server.js

build: $(CURDIR)/../node_modules/require-assets  assets.json

$(CURDIR)/../node_modules/require-assets:
	ln -s $(CURDIR)/../ $@

bundle.css assets.json::
	$(BIN)/xcss \
		-t [ require-assets-xcss -o assets.json ] \
		./main.css > bundle.css

bundle.js assets.json::
	$(BIN)/browserify \
		-p [ require-assets-browserify -o assets.json ] \
		./main.js  > bundle.js
