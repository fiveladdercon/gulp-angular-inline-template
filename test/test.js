var template  = require('../');
var EOL       = require('os').EOL;
var path      = require('path');
var expect    = require('chai').expect;
var Transform = require('stream').Transform;
var File      = require('gulp-util').File;

describe('gulp-angular-inline-template', function () {

	// Pipe input utils

	function open() {
		var args = []; for(var i=0;i<arguments.length;i++) args[i] = arguments[i];
		return new File({
			path     : path.join(__dirname,args.shift()),
			contents : args.length ? new Buffer(args.join('')) : null
		});
	}

	var apple,banana,cherry;

	// Pipe output utils

	var output;	

	function flush () {
	    apple  = open('apple.txt' ,'apple' );
	    banana = open('banana.txt','banana');
  	    cherry = open('cherry.txt','cherry');
		output = [];
	}

	function queue (file) {
		output.push(file.contents.toString()); 
	}

	// Tests

	describe('when correctly used', function () {

		beforeEach(flush);

		it('wraps script tags around file contents', function (done) {
			var stream  = template();
			stream.on('data',queue);
			stream.write(apple);
			stream.write(banana);
			stream.write(cherry);
			stream.end(function () {
				expect(output.length).to.equal(3);
				expect(output[0]).to.equal(['<script type=\'text/ng-template\' id=\'apple.txt\'>','apple</script>',''].join(EOL));
				expect(output[1]).to.equal(['<script type=\'text/ng-template\' id=\'banana.txt\'>','banana</script>',''].join(EOL));
				expect(output[2]).to.equal(['<script type=\'text/ng-template\' id=\'cherry.txt\'>','cherry</script>',''].join(EOL));
				done();
			});
		});

		it('omits newlines when the minified flag is truthy', function (done) {
			var stream  = template(true);
			stream.on('data',queue);
			stream.write(apple);
			stream.write(banana);
			stream.write(cherry);
			stream.end(function () {
				expect(output.length).to.equal(3);
				expect(output[0]).to.equal(['<script type=\'text/ng-template\' id=\'apple.txt\'>','apple</script>',''].join(''));
				expect(output[1]).to.equal(['<script type=\'text/ng-template\' id=\'banana.txt\'>','banana</script>',''].join(''));
				expect(output[2]).to.equal(['<script type=\'text/ng-template\' id=\'cherry.txt\'>','cherry</script>',''].join(''));
				done();
			});
		});

	}); /* when correctly used */

});