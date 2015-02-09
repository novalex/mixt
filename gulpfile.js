
// MIXT GULP BUILDER

'use strict';

/* TASK LIST
 *
 * 'sass'      - compile sass files
 * 'sassbs'    - compile bootstrap sass files
 * 'adminsass' - compile admin sass files
 *
 * 'minify'    - concat plugins js
 * 'modules-js'
 *
 *
 */

// Plugins And Dependencies
var gulp         = require('gulp'),
	jshint       = require('gulp-jshint'),
	concat       = require('gulp-concat'),
	uglify       = require('gulp-uglify'),
	sass         = require('gulp-sass'),
	minCSS       = require('gulp-minify-css'),
	sourcemaps   = require('gulp-sourcemaps'),
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
		src:   './css',
		files: './css/*.scss',
		admin: './framework/admin/css/*.scss',
	},
	dest:  './dist',
	maps:  './maps',
};

// A display error function, to format and make custom errors more uniform
// Could be combined with gulp-util or npm colors for nicer output
var displayError = function(error) {

	// Initial building up of the error
	var errorString = '[' + error.plugin + ']';
	errorString += ' ' + error.message.replace('\n',''); // Removes new line at the end

	// If the error contains the filename or line number add it to the string
	if(error.fileName)
		errorString += ' in ' + error.fileName;

	if(error.lineNumber)
		errorString += ' on line ' + error.lineNumber;

	// This will output an error like the following:
	// [gulp-sass] error message in file_name on line 1
	console.error(errorString);
};

// Compile Sass
gulp.task('sass', function() {
	gulp.src(path.styles.files)
		.pipe(sourcemaps.init())
		.pipe(sass({ outputStyle: 'compressed' }))
		.on('error', function(err){
			displayError(err);
		})
		// .pipe(minCSS({keepBreaks:true}))
		.pipe(concat('master.css'))
		.pipe(autoprefixer('last 2 versions', 'ie 8'))
		.pipe(sourcemaps.write(path.maps))
		.pipe(gulp.dest(path.dest));
});

// Compile Bootstrap Sass
gulp.task('sassbs', function(){
	return gulp.src( 'inc/bootstrap/css/bootstrap.scss' )
		// .pipe(sourcemaps.init())
		.pipe(sass())
		.pipe(concat('bootstrap.css'))
		// .pipe(sourcemaps.write())
		.pipe(gulp.dest(path.dest));
});

// Compile Admin Sass
gulp.task('adminsass', function() {
	gulp.src(path.styles.admin, {base: './'})
		.pipe(sourcemaps.init())
		.pipe(sass({ outputStyle: 'compressed' }))
		.on('error', function(err){
			displayError(err);
		})
		.pipe(autoprefixer('last 2 versions', 'ie 8'))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('./'));
});

// Lint Includes JS
gulp.task('lintinc', function() {
	return gulp.src(path.js.plugins)
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

// Concat & Minify JS
gulp.task('minify', function(){
	return gulp.src(path.js.plugins)
		.pipe(sourcemaps.init())
		.pipe(concat('plugins.js'))
		.pipe(uglify())
		.pipe(sourcemaps.write(path.maps))
		.pipe(gulp.dest(path.dest));
});

// Concat Modules JS
gulp.task('modules-js', function(){
	return gulp.src(path.js.modules)
		.pipe(sourcemaps.init())
		.pipe(concat('modules.js'))
		.pipe(uglify())
		.pipe(sourcemaps.write(path.maps))
		.pipe(gulp.dest(path.dest));
});

// Concat & Minify Bootstrap JS
gulp.task('minifybs', function(){
	return gulp.src([ 'inc/bootstrap/js/bootstrap.js', 'inc/bootstrap/js/bootstrap/*.js' ])
		.pipe(concat('bootstrap.js'))
		// .pipe(uglify())
		.pipe(gulp.dest(path.dest));
});

// Watch Our Files
gulp.task('watch', function() {
	gulp.watch(path.styles.files, ['sass']);
	gulp.watch(path.styles.admin, ['adminsass']);
	// gulp.watch([ 'inc/css/bootstrap.scss', 'inc/css/bootstrap/*.scss' ], ['sassbs']);

	gulp.watch(path.js.plugins, ['minify']);
	gulp.watch(path.js.modules, ['modules-js']);
	// gulp.watch([ 'inc/js/bootstrap.js', 'inc/js/bootstrap/*.js' ], ['minifybs']);
});

// Default
gulp.task('default', ['lint', 'minify', 'sass']);

gulp.task('js', [ 'minify' ]);