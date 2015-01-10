
// MIXT GULP BUILDER

// Global Vars & Dependencies
var gulp       = require('gulp'),
    jshint     = require('gulp-jshint'),
    concat     = require('gulp-concat'),
    rename     = require('gulp-rename'),
    changed    = require('gulp-changed'),
    uglify     = require('gulp-uglify'),
    sass       = require('gulp-sass'),
    minCSS     = require('gulp-minify-css'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefix = require('gulp-autoprefixer'),

    jsDir      = 'assets/js/*.js',
    jsIncDir   = 'inc/js/*.js',
    outDir     = 'dist';
    mapsDir    = './maps';

// Lint JS
gulp.task('lint', function() {
    return gulp.src(jsDir)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Lint Includes JS
gulp.task('lintinc', function() {
    return gulp.src([jsIncDir, '!inc/js/bootstrap.js', '!inc/js/bootstrap/*.js', '!inc/js/customizer.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Concat & Minify JS
gulp.task('minify', function(){
    return gulp.src([jsIncDir, '!inc/js/bootstrap.js', '!inc/js/bootstrap/*.js', '!inc/js/customizer.js', '!inc/js/modernizr.js'])
        .pipe(sourcemaps.init())
        .pipe(concat('js-inc.js'))
        // .pipe(uglify())
        .pipe(sourcemaps.write(mapsDir))
        .pipe(gulp.dest(outDir));
});

// Concat & Minify Bootstrap JS
gulp.task('minifybs', function(){
    return gulp.src([ 'inc/js/bootstrap.js', 'inc/js/bootstrap/*.js' ])
        .pipe(concat('bootstrap-mixt.js'))
        // .pipe(uglify())
        .pipe(gulp.dest(outDir));
});

// Concat Theme CSS
gulp.task('sass', function() {
    gulp.src('css/*.scss')
        .pipe(sass())
        .pipe(autoprefix())
        .pipe(sourcemaps.init())
        .pipe(concat('main.css'))
        // .pipe(minCSS({keepBreaks:true}))
        .pipe(sourcemaps.write(mapsDir))
        .pipe(gulp.dest(outDir));
});

// Concat Bootstrap CSS
gulp.task('sassbs', function(){
    return gulp.src( 'inc/css/bootstrap.scss' )
        // .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(concat('bootstrap-mixt.css'))
        // .pipe(sourcemaps.write())
        .pipe(gulp.dest(outDir));
});

// Watch Our Files
gulp.task('watch', function() {

    gulp.watch(jsIncDir, ['minify']);
    gulp.watch('css/*.scss', ['sass']);

    gulp.watch([ 'inc/js/bootstrap.js', 'inc/js/bootstrap/*.js' ], ['minifybs'])
    gulp.watch([ 'inc/css/bootstrap.scss', 'inc/css/bootstrap/*.scss' ], ['sassbs']);

});

// Default
gulp.task('default', ['lint', 'minify', 'sass']);

gulp.task('js', [ 'minify' ]);