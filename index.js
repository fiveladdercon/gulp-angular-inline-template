var EOL       = require('os').EOL;
var path      = require('path');
var Transform = require('stream').Transform;

module.exports = function (minified) {
	var delim = minified ? '' : EOL;

	function transform (file,encoding,next) {
		file.contents = Buffer.concat([
		 	new Buffer(['<script type=\'text/ng-template\' id=\'', path.basename(file.path), '\'>', delim].join('')),
		 	file.contents,
		 	new Buffer(['</script>', delim].join(''))
	    ]);
		next(null,file);
	}

	return new Transform({objectMode: true, transform: transform});

}