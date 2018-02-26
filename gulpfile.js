/*!
 * bootstrap-actionable v1.0.0 (http://javatmp.com)
 * A small Javascript code that help implement click event actions for <a> and <button> tags by declarative way
 * and provide functionalities to load AJAX content in Bootstrap Modal Wrapper instance.
 *
 * Copyright 2018 JavaTMP
 * Licensed under MIT (https://github.com/JavaTMP/bootstrap-actionable/blob/master/LICENSE)
 */

var gulp = require('gulp');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var del = require('del');
var eslint = require('gulp-eslint');

gulp.task('clean', function () {
    return del(['./dist']);
});

gulp.task('dist', ["clean"], function (cb) {
    return gulp.src('./js/bootstrap-actionable.js')
            .pipe(eslint({
                "env": {"browser": true, "node": true, "jquery": true},
                "rules": {
                    "semi": 2,
                    "eqeqeq": 1,
                    "quotes": 0,
                    "no-trailing-spaces": 1,
                    "eol-last": 1,
                    "no-unused-vars": 0,
                    "no-underscore-dangle": 1,
                    "no-alert": 1,
                    "no-lone-blocks": 1
                },
                "globals": ["jQuery", "$"]
            }))
            .pipe(eslint.format())
            .pipe(uglify({output: {comments: /^!/}}))
            .pipe(rename({suffix: '.min'}))
            .pipe(gulp.dest('./dist/'));
});

gulp.task('default', ["dist"], function () {
    // place code for your default task here
});
