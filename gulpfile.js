
// MIXT BUILDER

'use strict';

/* TASKS ####################################
 *
 * sass       - compile sass files
 * sass-bs    - compile bootstrap sass files
 * sass-frame - compile framework sass files (admin, plugins, etc)
 *
 * plugins-js - concat plugins js
 * modules-js - concat modules js
 *
 * OPTIONS ##################################
 *
 * env - prod or dev (default)
 */

// Plugins and dependencies
var gulp         = require('gulp'),
	gulpif       = require('gulp-if'),
	jshint       = require('gulp-jshint'),
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
		src:     './js/',
		inc:     './js/*.js',
		plugins: './js/plugins/*.js',
		modules: './js/modules/*.js',
	},
	styles: {
		src:     './css',
		files:   './css/*.scss',
		admin:   './framework/admin/css/*.scss',
		plugins: './framework/plugins/*/css/*.scss',
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

// Compile Bootstrap Sass
gulp.task('sass-bs', function(){
	gulp.src('framework/inc/bootstrap/css/bootstrap.scss')
		.pipe( gulpif(isDev, sourcemaps.init()) )
		.pipe( gulpif(isDev, sass(), sass({ outputStyle: 'compressed' })) )
		.on( 'error', function(err) { displayError(err); } )
		.pipe( concat('bootstrap.css') )
		.pipe( gulpif(isDev, sourcemaps.write(), autoprefixer('last 2 versions', 'ie 8')) )
		.pipe( gulp.dest(path.dest) )
		.pipe( browserSync.reload({stream:true}) );
});

// Compile Framework Sass
gulp.task('sass-frame', function() {
	gulp.src([path.styles.admin, path.styles.plugins], {base: './'})
		.pipe( gulpif(isDev, sourcemaps.init()) )
		.pipe( gulpif(isDev, sass(), sass({ outputStyle: 'compressed' })) )
		.on( 'error', function(err) { displayError(err); } )
		.pipe( gulpif(isDev, sourcemaps.write(), autoprefixer('last 2 versions', 'ie 8')) )
		.pipe(gulp.dest('./'))
		.pipe( browserSync.reload({stream:true}) );
});

// Lint JS
gulp.task('lint-js', function() {
	gulp.src([path.js.plugins, path.js.modules])
		.pipe( jshint.reporter('default') );
});

// Concat & minify JS
gulp.task('minify', function(){
	gulp.src([path.js.plugins, path.js.modules])
		.pipe( gulpif(isDev, sourcemaps.init()) )
		.pipe( concat('main.js') )
		.on( 'error', function(err) { displayError(err); } )
		.pipe( gulpif(isDev, sourcemaps.write(), uglify()) )
		.pipe( gulp.dest(path.dest) )
		.pipe( browserSync.reload() );
});

// Concat & minify Bootstrap JS
gulp.task('minify-bs', function(){
	gulp.src([ 'framework/inc/bootstrap/js/bootstrap.js', 'framework/inc/bootstrap/js/bootstrap/*.js' ])
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
	gulp.watch(path.styles.files, ['sass']);
	gulp.watch([path.styles.admin, path.styles.plugins], ['sass-frame']);
	gulp.watch([path.js.plugins, path.js.modules], ['minify']);
});

// Watch Bootstrap Sass & JS files
gulp.task('watch-bs', function() {
	gulp.watch([ 'inc/css/bootstrap.scss', 'inc/css/bootstrap/*.scss' ], ['sass-bs']);
	gulp.watch([ 'inc/js/bootstrap.js', 'inc/js/bootstrap/*.js' ], ['minify-bs']);
});

// Default
gulp.task('default', ['sass', 'minify']);
gulp.task('js', ['lint-js', 'minify']);
gulp.task('bootstrap', ['sass-bs', 'minify-bs']);
