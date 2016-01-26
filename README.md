# gulp-angular-inline-template

Wraps template HTML in ng-template script tags for inlining.

## Install

```
> npm install gulp-angular-inline-template
```

## Usage

Takes an angular directive template and wraps it in a ng-template script tag:

```
directive.html

<div class='dialog'>
  <h1>This is my dialog</h1>
  <div ng-transclude></div>
</div>
```

```javascript
var inline = require('gulp-angular-inline-template');

gulp.src('directive.html')
	.pipe(inline())
	...
```

```
directive.html

<script type='text/ng-template' id='directive.html'>
<div class='directive'>
  <h1>This is my directive</h1>
  <div ng-transclude></div>
</div>
</script>
```

Directive templates can then be spliced into the index.html:

```
gulp.src('**/*.directive.html')
	.pipe(inline())
	.pipe(splice({key:'##directives##',outer:'index.html'}))
	.pipe(gulp.dest('dist'))
```

```
index.html

<html>
<body>
<div>
...
</div>
<script type='text/ng-template' id='first.directive.html'>...</script>
<script type='text/ng-template' id='second.directive.html'>...</script>
<script type='text/ng-template' id='third.directive.html'>...</script>
<script type='text/ng-template' id='fourth.directive.html'>...</script>
...
</body>
</html>
```

Since templates are now shipped with the index.html, templateUrl directive
properties will not issue a server request:

```javascript
angular.module('myApp').directive('myDialog', function () {
	return {
		templateUrl: 'dialog.directive.html', // Does not trigger an AJAX request
		link: ...
	};
});
```

Note that if you minify your HTML, you need to minimize before wrapping your
templates in script tags.  This is because script tags do not normally contain
HTML and this can trip up minifiers. Also pass a truthy value to the inline 
operation to omit new lines in the output:

```
gulp.src('**/*.directive.html')
	.pipe(htmlmin())
	.pipe(inline(true))
	.pipe(splice({key:'##directives##',outer:'index.html'}))
	.pipe(gulp.dest('dist'))
```

However this does not minimize the index.html file.  Instead, send
it through the pipe and omit it from the processing step:

```
gulp.src(['**/*.directive.html','index.html'])
	.pipe(htmlmin())
	.pipe(subset(/directive.html$/, inline(true)))
	.pipe(splice('##directives##'))
	.pipe(gulp.dest('dist'))
```

## API

```
gulp-angular-inline-template([minified])
```

Without an options the inline template wraps file contents in script tags:

```
<script type='text/ng-template' id='$filename'>
... contents of $filename ...
</script>
```

#### minified : truthy

Passing a truthy value as an argument removes new lines from the script tags.

## Test

```
> npm test
```
