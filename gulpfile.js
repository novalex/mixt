
// MIXT BUILDER

'use strict';

/* TASKS ####################################
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
var path = {
	js: {
		plugins:    'js/plugins/*.js',
		modules:    'js/modules/*.js',
		bootstrap:  'js/bootstrap/*.js',
		admin:      'framework/admin/js',
		customizer: 'framework/admin/js/customizer/*.js',
	},
	styles: {
		main:        'css/main.scss',
		files:       'css/**/*.scss',
		plugins:     'framework/plugins/**/main.scss',
		admin:       'framework/admin/css/*.scss',
		pluginAdmin: 'framework/plugins/**/admin.scss',
	},
	dest: 'dist'
};

// BrowserSync IP - Change this to the IP of your local server
var host_ip = '192.168.0.103';

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

var autoprefix = autoprefixer('last 2 versions', 'ie 8');

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
	return gulp.src(path.styles.main)
		.pipe( gulpif(srcmap, sourcemaps.init()) )
		.pipe( gulpif(isDev, sass(), sass({ outputStyle: 'compressed' })) )
		.on( 'error', displayError )
		.pipe( concat('main.css') )
		.pipe( gulpif(srcmap, sourcemaps.write()) )
		.pipe( gulpif(prefix, autoprefix) )
		.pipe( gulp.dest(path.dest) )
		.pipe( bsync.stream() );
});

// Compile Plugin Sass
gulp.task('sass-plugin', function() {
	return gulp.src(path.styles.plugins, {base: './'})
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
	return gulp.src([path.js.plugins, path.js.modules])
		.pipe( gulpif(srcmap, sourcemaps.init()) )
		.pipe( concat('main.js') )
		.on( 'error', displayError )
		.pipe( gulpif(srcmap, sourcemaps.write()) )
		.pipe( gulpif(prod, uglify()) )
		.pipe( gulp.dest(path.dest) )
		.pipe( bsync.stream() );
});

// Concat & minify Bootstrap JS
gulp.task('minify-bs', function() {
	return gulp.src(path.js.bootstrap)
		.pipe( gulpif(srcmap, sourcemaps.init()) )
		.pipe( concat('bootstrap.js') )
		.pipe( gulpif(srcmap, sourcemaps.write()) )
		.pipe( gulpif(prod, uglify()) )
		.pipe( gulp.dest(path.dest) );
});

// Compile Admin Sass
gulp.task('sass-admin', function() {
	return gulp.src([path.styles.admin, path.styles.pluginAdmin])
		.pipe( gulpif(srcmap, sourcemaps.init()) )
		.pipe( gulpif(isDev, sass(), sass({ outputStyle: 'compressed' })) )
		.on( 'error', displayError )
		.pipe( concat('admin.css') )
		.pipe( gulpif(srcmap, sourcemaps.write()) )
		.pipe( gulpif(prefix, autoprefix) )
		.pipe( gulp.dest(path.dest) )
		.pipe( bsync.stream() );
});

// Concat & minify Customizer JS
gulp.task('minify-customizer', function() {
	return gulp.src(path.js.customizer)
		.pipe( gulpif(srcmap, sourcemaps.init()) )
		.pipe( concat('customizer.js') )
		.on( 'error', displayError )
		.pipe( gulpif(srcmap, sourcemaps.write()) )
		.pipe( gulp.dest(path.js.admin) );
});

// Watch Sass & JS files
gulp.task('watch', function() {
	bsync.init({
		host: host_ip
	});
	gulp.watch([path.styles.files], ['sass']);
	gulp.watch([path.styles.admin, path.styles.pluginAdmin], ['sass-admin']);
	gulp.watch([path.js.plugins, path.js.modules], ['minify']);
	gulp.watch([path.js.bootstrap], ['minify-bs']);
	gulp.watch([path.js.customizer], ['minify-customizer']);
});

// Default
gulp.task('default', ['sass', 'sass-admin', 'sass-plugin', 'minify', 'minify-bs', 'minify-customizer']);
