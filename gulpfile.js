
// MIXT BUILDER

'use strict';

/* TASKS ####################################
 *
 * sass        - compile sass files
 * sass-admin  - compile admin sass files
 * sass-plugin - compile plugin sass files
 *
 * minify      - concat & minify js
 * minify-bs   - concat & minify Bootstrap js
 *
 * OPTIONS ##################################
 *
 * env - prod or dev (default)
 *
 */

// Plugins and dependencies
var gulp         = require('gulp'),
	gulpif       = require('gulp-if'),
	concat       = require('gulp-concat'),
	uglify       = require('gulp-uglify'),
	sass         = require('gulp-sass'),
	minimist     = require('minimist'),
	sourcemaps   = require('gulp-sourcemaps'),
	browserSync  = require('browser-sync'),
	autoprefixer = require('gulp-autoprefixer');

// Paths
var path = {
	js: {
		src:       './js/',
		inc:       './js/*.js',
		plugins:   './js/plugins/*.js',
		modules:   './js/modules/*.js',
		bootstrap: './js/bootstrap/*.js',
	},
	styles: {
		src:         './css',
		files:       './css/**/*.scss',
		admin:       './framework/admin/css/*.scss',
		pluginAdmin: './framework/plugins/**/admin.scss',
		plugins:     './framework/plugins/**/main.scss',
	},
	dest: './dist'
};

// Task arguments
var options = {
		string: 'env',
		default: { env: 'dev' }
	},
	options = minimist(process.argv.slice(2), options),
	isDev   = options.env === 'dev' ? true : false;

var displayError = function(error) {
	var errorString = '[' + error.plugin + ']';
	errorString += ' ' + error.message.replace('\n','');
	if(error.fileName) errorString += ' in ' + error.fileName;
	if(error.lineNumber) errorString += ' on line ' + error.lineNumber;
	console.error(errorString);
};

// Compile Sass
gulp.task('sass', function() {
	gulp.src(path.styles.files)
		.pipe( gulpif(isDev, sourcemaps.init()) )
		.pipe( gulpif(isDev, sass(), sass({ outputStyle: 'compressed' })) )
		.on( 'error', function(err) { displayError(err); } )
		.pipe( concat('main.css') )
		.pipe( gulpif(isDev, sourcemaps.write(), autoprefixer('last 2 versions', 'ie 8')) )
		.pipe( gulp.dest(path.dest) )
		.pipe( browserSync.reload({stream:true}) );
});

// Compile Admin Sass
gulp.task('sass-admin', function() {
	gulp.src([path.styles.admin, path.styles.pluginAdmin])
		.pipe( gulpif(isDev, sourcemaps.init()) )
		.pipe( gulpif(isDev, sass(), sass({ outputStyle: 'compressed' })) )
		.on( 'error', function(err) { displayError(err); } )
		.pipe( concat('admin.css') )
		.pipe( gulpif(isDev, sourcemaps.write(), autoprefixer('last 2 versions', 'ie 8')) )
		.pipe( gulp.dest(path.dest) )
		.pipe( browserSync.reload({stream:true}) );
});

// Compile Plugin Sass
gulp.task('sass-plugin', function() {
	gulp.src(path.styles.plugins, {base: './'})
		.pipe( gulpif(isDev, sourcemaps.init()) )
		.pipe( gulpif(isDev, sass(), sass({ outputStyle: 'compressed' })) )
		.on( 'error', function(err) { displayError(err); } )
		.pipe( gulpif(isDev, sourcemaps.write(), autoprefixer('last 2 versions', 'ie 8')) )
		.pipe( gulp.dest('./') )
		.pipe( browserSync.reload({stream:true}) );
});

// Concat & minify JS
gulp.task('minify', function(){
	gulp.src([path.js.plugins, path.js.modules])
		.pipe( gulpif(isDev, sourcemaps.init()) )
		.pipe( concat('main.js') )
		.on( 'error', function(err) { displayError(err); } )
		.pipe( gulpif(isDev, sourcemaps.write(), uglify()) )
		.pipe( gulp.dest(path.dest) )
		.pipe( browserSync.reload({stream:true}) );
});

// Concat & minify Bootstrap JS
gulp.task('minify-bs', function(){
	gulp.src(path.js.bootstrap)
		.pipe( gulpif(isDev, sourcemaps.init()) )
		.pipe( concat('bootstrap.js') )
		.pipe( gulpif(isDev, sourcemaps.write(), uglify()) )
		.pipe( gulp.dest(path.dest) );
});

// Watch Sass & JS files
gulp.task('watch', function() {
	browserSync.init({
		host: '192.168.0.103'
	});
	gulp.watch([path.styles.files], ['sass']);
	gulp.watch([path.styles.admin, path.styles.pluginAdmin], ['sass-admin']);
	gulp.watch([path.js.plugins, path.js.modules], ['minify']);
	gulp.watch([path.js.bootstrap], ['minify-bs']);
});

// Default
gulp.task('default', ['sass', 'minify']);
