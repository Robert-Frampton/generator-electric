'use strict';

const connect = require('gulp-connect');
const electric = require('electric');
const ghPages = require('gulp-gh-pages');
const gulp = require('gulp');
const jquery = require('jquery');
const lexicon = require('lexicon-ux');
const path = require('path');
const runSequence = require('run-sequence');
const sass = require('gulp-sass');

electric.registerTasks({
	gulp: gulp,
	plugins: ['electric-quartz-components']
});

// CSS -------------------------------------------------------------------------

gulp.task('css', () => {
	return gulp.src('src/styles/**/*.scss')
		.pipe(sass({
			includePaths: ['node_modules', lexicon.includePaths]
		}))
		.pipe(gulp.dest('dist/styles'));
});

// Server ----------------------------------------------------------------------

gulp.task('server', () => {
	connect.server({
		root: 'dist',
		port: 8888
	});
});

// Deploy ----------------------------------------------------------------------

gulp.task('wedeploy', () => {
	return gulp.src('src/container.json')
		.pipe(gulp.dest('dist'));
});

gulp.task('deploy', ['default'], () => {
	return gulp.src('dist/**/*')
		.pipe(ghPages({
			branch: 'wedeploy'
		}));
});

// Lexicon ---------------------------------------------------------------------

gulp.task('vendor:lexicon', () => {
	return gulp.src([
			path.join(lexicon.buildDir, 'images', 'icons', '*'),
			path.join(lexicon.srcDir, 'js', 'svg4everybody.js')
		])
		.pipe(gulp.dest('dist/vendor/lexicon'));
});

// jQuery ---------------------------------------------------------------------

gulp.task('vendor:jquery', () => {
	return gulp.src([
			path.join('node_modules', 'jquery', 'dist', 'jquery.js')
		])
		.pipe(gulp.dest('dist/vendor/jquery'));
});

// Watch -----------------------------------------------------------------------

gulp.task('watch', () => {
	gulp.watch('src/**/*.+(md|soy|js|fm)', ['generate']);
	gulp.watch('src/styles/**/*.scss', ['css']);
});

// Build -----------------------------------------------------------------------

gulp.task('build', (callback) => {
	runSequence('generate', ['css', 'wedeploy'], callback);
});

gulp.task('default', (callback) => {
	runSequence('vendor:jquery', 'vendor:lexicon', 'build', 'server', 'watch', callback);
});
