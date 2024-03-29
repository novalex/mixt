var fs   = require('fs'),
	path = require('path'),
	dirs = {
		src:     process.env.INIT_CWD,
		archive: 'archive',
		dist:    'dist',
	};

var gulp     = require('gulp'),
	gulpfile = require('../gulpfile.js'),
	package  = require('../package.json');

var runSequence = require('run-sequence');

// // ---------------------------------------------------------------------
// // | Helper tasks                                                      |
// // ---------------------------------------------------------------------

gulp.task('archive:create_dir', function () {
	fs.mkdirSync(path.resolve(dirs.archive), '0755');
});

gulp.task('archive:zip', function (done) {

	var archiveName = path.resolve(dirs.archive, pkg.name + '_v' + pkg.version + '.zip');
	var archiver = require('archiver')('zip');
	var files = require('glob').sync('**/*.*', {
		'cwd': dirs.dist,
		'dot': true // include hidden files
	});
	var output = fs.createWriteStream(archiveName);

	archiver.on('error', function (error) {
		done();
		throw error;
	});

	output.on('close', done);

	files.forEach(function (file) {

		var filePath = path.resolve(dirs.dist, file);

		// `archiver.bulk` does not maintain the file
		// permissions, so we need to add files individually
		archiver.append(fs.createReadStream(filePath), {
			'name': file,
			'mode': fs.statSync(filePath)
		});

	});

	archiver.pipe(output);
	archiver.finalize();

});

gulp.task('clean', function (done) {
	require('del')([
		dirs.archive,
		dirs.dist
	], done);
});

gulp.task('copy', [
	// 'copy:.htaccess',
	// 'copy:index.html',
	// 'copy:jquery',
	// 'copy:main.css',
	'copy:misc',
	// 'copy:normalize'
]);

gulp.task('copy:.htaccess', function () {
	return gulp.src('node_modules/apache-server-configs/dist/.htaccess')
			   .pipe(plugins.replace(/# ErrorDocument/g, 'ErrorDocument'))
			   .pipe(gulp.dest(dirs.dist));
});

gulp.task('copy:index.html', function () {
	return gulp.src(dirs.src + '/index.html')
			   .pipe(plugins.replace(/{{JQUERY_VERSION}}/g, pkg.devDependencies.jquery))
			   .pipe(gulp.dest(dirs.dist));
});

gulp.task('copy:jquery', function () {
	return gulp.src(['node_modules/jquery/dist/jquery.min.js'])
			   .pipe(plugins.rename('jquery-' + pkg.devDependencies.jquery + '.min.js'))
			   .pipe(gulp.dest(dirs.dist + '/js/vendor'));
});

gulp.task('copy:main.css', function () {

	var banner = '/*! HTML5 Boilerplate v' + pkg.version +
					' | ' + pkg.license.type + ' License' +
					' | ' + pkg.homepage + ' */\n\n';

	return gulp.src(dirs.src + '/css/main.css')
			   .pipe(plugins.header(banner))
			   .pipe(gulp.dest(dirs.dist + '/css'));

});

gulp.task('copy:misc', function () {
	return gulp.src([

		// Copy all files
		dirs.src + '/dist/*',

		// Exclude the following files (other tasks will handle the copying of these files)
		'!' + dirs.src + '/css/main.css',
		'!' + dirs.src + '/index.html'

	], {
		// Include hidden files by default
		dot: false
	}).pipe(gulp.dest(dirs.dist));
});

gulp.task('copy:normalize', function () {
	return gulp.src('node_modules/normalize.css/normalize.css')
			   .pipe(gulp.dest(dirs.dist + '/css'));
});


// ---------------------------------------------------------------------
// | Main tasks                                                        |
// ---------------------------------------------------------------------

gulp.task('archive', function (done) {
	runSequence(
		'build',
		'archive:create_dir',
		'archive:zip',
	done);
});

gulp.task('build', function (done) {
	runSequence(
		// ['clean', 'lint:js'],
		'copy',
		done
	);
});

gulp.task('default', ['build']);