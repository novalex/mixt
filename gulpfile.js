
/* MIXT BUILDER
 *
 *
 * TASKS ####################################
 *
 * watch       - listen to file changes and perform the appropriate tasks
 *
 * sass        - compile sass files
 * sass-admin  - compile admin sass files
 * sass-plugin - compile plugin sass files
 *
 * minify      - concat & minify js
 * minify-bs   - concat & minify Bootstrap js
 * minify-customizer - concat & minify customizer JS
 *
 * OPTIONS ##################################
 *
 * Used by appending --option after the task name
 * E.g. gulp sass --prod --prefix
 *
 * prod - production flag (default false)
 * prefix - autoprefix properties (default false)
 * srcmap - generate sourcemaps (default false)
 *
 */

// Plugins and dependencies
var gulp         = require('gulp'),
	gulpif       = require('gulp-if'),
	concat       = require('gulp-concat'),
	uglify       = require('gulp-uglify'),
	bsync        = require('browser-sync'),
	sass         = require('gulp-sass'),
	minimist     = require('minimist'),
	sourcemaps   = require('gulp-sourcemaps'),
	autoprefixer = require('gulp-autoprefixer');

// Paths
var base  = process.env.INIT_CWD,
	files = {
		js: {
			plugins:    base + '/js/plugins/*.js',
			modules:    base + '/js/modules/*.js',
			bootstrap:  base + '/js/bootstrap/*.js',
			admin:      base + '/framework/admin/js',
			customizer: base + '/framework/admin/js/customizer/*.js',
		},
		styles: {
			main:        base + '/css/main.scss',
			files:       base + '/css/**/*.scss',
			plugins:     base + '/framework/plugins/**/main.scss',
			admin:       base + '/framework/admin/css/*.scss',
			pluginAdmin: base + '/framework/plugins/**/admin.scss',
		},
		dest: base + '/dist'
	};

// Task arguments
var options = {
		boolean: true,
		default: {
			prod: false,
			prefix: false,
			srcmap: false,
		}
	},
	options = minimist(process.argv.slice(2), options),
	isDev   = ! options.prod,
	prod    = options.prod,
	prefix  = options.prefix,
	srcmap  = options.srcmap;

var autoprefix = autoprefixer({
	browsers: ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'],
});

function displayError(error) {
	var errorString = '[' + error.plugin + ']';
	errorString += ' ' + error.message.replace('\n','');
	if(error.fileName) errorString += ' in ' + error.fileName;
	if(error.lineNumber) errorString += ' on line ' + error.lineNumber;
	console.error(errorString);
	this.emit('end');
}

// Compile Sass
gulp.task('sass', function() {
	return gulp.src(files.styles.main)
		.pipe( gulpif(srcmap, sourcemaps.init()) )
		.pipe( gulpif(isDev, sass(), sass({ outputStyle: 'compressed' })) )
		.on( 'error', displayError )
		.pipe( concat('main.css') )
		.pipe( gulpif(srcmap, sourcemaps.write()) )
		.pipe( gulpif(prefix, autoprefix) )
		.pipe( gulp.dest(files.dest) )
		.pipe( bsync.stream() );
});

// Compile Plugin Sass
gulp.task('sass-plugin', function() {
	return gulp.src(files.styles.plugins, {base: './'})
		.pipe( gulpif(srcmap, sourcemaps.init()) )
		.pipe( gulpif(isDev, sass(), sass({ outputStyle: 'compressed' })) )
		.on( 'error', displayError )
		.pipe( gulpif(srcmap, sourcemaps.write()) )
		.pipe( gulpif(prefix, autoprefix) )
		.pipe( gulp.dest('./') )
		.pipe( bsync.stream() );
});

// Concat & minify JS
gulp.task('minify', function() {
	return gulp.src([files.js.plugins, files.js.modules])
		.pipe( gulpif(srcmap, sourcemaps.init()) )
		.pipe( concat('main.js') )
		.on( 'error', displayError )
		.pipe( gulpif(srcmap, sourcemaps.write()) )
		.pipe( gulpif(prod, uglify()) )
		.pipe( gulp.dest(files.dest) )
		.pipe( bsync.stream() );
});

// Concat & minify Bootstrap JS
gulp.task('minify-bs', function() {
	return gulp.src(files.js.bootstrap)
		.pipe( gulpif(srcmap, sourcemaps.init()) )
		.pipe( concat('bootstrap.js') )
		.pipe( gulpif(srcmap, sourcemaps.write()) )
		.pipe( gulpif(prod, uglify()) )
		.pipe( gulp.dest(files.dest) );
});

// Compile Admin Sass
gulp.task('sass-admin', function() {
	return gulp.src([files.styles.admin, files.styles.pluginAdmin])
		.pipe( gulpif(srcmap, sourcemaps.init()) )
		.pipe( gulpif(isDev, sass({includePaths: base}), sass({ outputStyle: 'compressed', includePaths: base })) )
		.on( 'error', displayError )
		.pipe( concat('admin.css') )
		.pipe( gulpif(srcmap, sourcemaps.write()) )
		.pipe( gulpif(prefix, autoprefix) )
		.pipe( gulp.dest(files.dest) )
		.pipe( bsync.stream() );
});

// Concat & minify Customizer JS
gulp.task('minify-customizer', function() {
	return gulp.src(files.js.customizer)
		.pipe( gulpif(srcmap, sourcemaps.init()) )
		.pipe( concat('customizer.js') )
		.on( 'error', displayError )
		.pipe( gulpif(srcmap, sourcemaps.write()) )
		.pipe( gulp.dest(files.js.admin) );
});

// Watch Sass & JS files
gulp.task('watch', function() {
	bsync.init();
	gulp.watch([files.styles.files], ['sass']);
	gulp.watch([files.styles.admin, files.styles.pluginAdmin], ['sass-admin']);
	gulp.watch([files.js.plugins, files.js.modules], ['minify']);
	gulp.watch([files.js.bootstrap], ['minify-bs']);
	gulp.watch([files.js.customizer], ['minify-customizer']);
});

// Default
gulp.task('default', ['sass', 'sass-admin', 'sass-plugin', 'minify', 'minify-bs', 'minify-customizer']);
