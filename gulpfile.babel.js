/**
 *
 * A simple Gulp templates starter kit
 *
 * @author ak-code <alaunalkauniyyah3@gmail.com>
 * @copyright 2020 A.kauniyyah | Front-end Web developer
 *
 * ________________________________________________________________________________
 *
 * gulpfile.babel.js
 *
 * The gulp task runner file.
 *
 */

//-- General

import gulp from "gulp";
import del from "del";
import header from "gulp-header";
import sourcemaps from "gulp-sourcemaps";
import noop from "gulp-noop";
import runSequence from "gulp4-run-sequence";
import notify from "gulp-notify";
import plumber from "gulp-plumber";
import cache from "gulp-cached";
import path from "path";

// -- Config

import pkg from "./package.json";
import cfg from "./gulpfile.config";

// -- Styles

import sass from "gulp-sass";
import postcss from "gulp-postcss";
import autoprefixer from "gulp-autoprefixer";
import cssnano from "cssnano";
import csso from "gulp-csso";
import cleanCss from "gulp-clean-css";

// -- scripts

import terser from "gulp-terser";
import webpackStream from "webpack-stream";
import webpack from "webpack";
import babel from "gulp-babel";
import strip from "gulp-strip-comments";
import named from "vinyl-named";


// -- HTML templates ejs

import ejs from "gulp-ejs";
import browserSync from "browser-sync";
import beautify from "gulp-jsbeautifier";


// ---------------------------------------------------
// -- FUNCTION OF HELPERS
// ---------------------------------------------------


// -- node sass compiler

sass.compiler = require("node-sass");

// -- fetch command line arguments

const arg = (argList => {
    let arg = {},
        a, opt, thisOpt, curOpt;
    for (a = 0; a < argList.length; a++) {
        thisOpt = argList[a].trim();
        opt = thisOpt.replace(/^\-+/, '');
        if (opt === thisOpt) {
            if (curOpt) arg[curOpt] = opt;
            curOpt = null;
        } else {
            curOpt = opt;
            arg[curOpt] = true;
        }
    }
    return arg;
})(process.argv);


// -- Environment configuration.

const isProd = arg.production === true;


// -- error handler

const errorHandler = err => {
    notify.onError({
        title: `Gulp error in ${err.plugin}`,
        message: err.toString()
    })(err);
};


// ---------------------------------------------------
// -- GULP TASKS
// ---------------------------------------------------


// -- clean of build dir

gulp.task('clean', () => del([cfg.paths.build]));

// -- clean of cache

gulp.task('clear-cache', done => {
    cache.caches = {};
    done();
});

// -- Run Server and reload setup

gulp.task('runServer', () => {
    return browserSync.init({
        server: {
            baseDir: [cfg.paths.build]
        },
        port: arg.port ? Number(arg.port) : 9000,
        open: false
    });
});

gulp.task('reload', done => {
    browserSync.reload();
    done();
});


// -- Scss of styles task runner compile

gulp.task('compile-styles', done => {

    if (!cfg.settings.styles) return done();

    return gulp.src(cfg.paths.styles.input)
        .pipe(plumber(errorHandler))
        .pipe(isProd ? noop() : sourcemaps.init())
        .pipe(
            sass({
                outputStyle: 'compressed'
            }).on('error', sass.logError)
        )
        .pipe(autoprefixer())
        .pipe(
            postcss([
                cssnano({
                    discardComments: {
                        removeAll: true
                    }
                })
            ])
        )
        .pipe(csso())
        .pipe(cleanCss({
            level: {
                1: {
                    specialComments: 0
                }
            }
        }))
        .pipe(isProd ? noop() : sourcemaps.write('./maps'))
        .pipe(header(cfg.header.main, {
            package: pkg
        }))
        .pipe(gulp.dest(cfg.paths.styles.output));
});

// -- Script js use rollup

gulp.task('compile-scripts', done => {
    if (!cfg.settings.scripts) return done();

    const pathResolve = path.resolve(__dirname, cfg.paths.scripts.output);

    console.log(pathResolve);


    return gulp.src(cfg.paths.scripts.input)
        .pipe(plumber(errorHandler))
        .pipe(named())
        .pipe(webpackStream({
            mode: 'production',
            output: {
                chunkFilename: '[hash].modules.js',
                publicPath: "static/js/",
                path: path.resolve(__dirname, "static/js"),
            },
            optimization: {
                splitChunks: {
                    chunks: 'all',
                },
            },
        }, webpack))
        .pipe(isProd ? noop() : sourcemaps.init())
        .pipe(babel())
        .pipe(terser(isProd ? cfg.uglify.prod : cfg.uglify.dev))
        .pipe(strip())
        .pipe((isProd ? noop() : sourcemaps.write('./maps')))
        .pipe(header(cfg.header.main, {
            package: pkg
        }))
        .pipe(gulp.dest(cfg.paths.scripts.output));
});

// -- Ejs html template compile

gulp.task('compile-html', done => {

    if (!cfg.settings.public) return done();

    const siteConf = require(cfg.paths.public.data);

    return gulp.src(cfg.paths.public.input)
        .pipe(plumber())
        .pipe(ejs(siteConf.data, {
            ext: ".html"
        }))
        .pipe(beautify({
            html: {
                indent_size: 2,
                indent_char: ' ',
                max_preserve_newlines: 1
            }
        }))
        .pipe(gulp.dest(cfg.paths.public.output));
});


// -- Copy of static when of changed

gulp.task('copy-static', () => {

    if (!cfg.settings.static) return done();

    return gulp.src(cfg.paths.libs + '**/*')
        .pipe(gulp.dest(cfg.paths.output));
});

// -- Compile task runner

gulp.task('gulp:compile', function(callback) {
    runSequence(
        'clear-cache',
        'compile-styles',
        'compile-scripts',
        'copy-static',
        'compile-html',
        callback
    );
});

// -- watch task runner

gulp.task('gulp:watch', () => {
    gulp.watch(cfg.paths.styles.watch, callback => {
        runSequence(
            'compile-styles',
            'reload',
            callback
        );
    });

    gulp.watch(cfg.paths.scripts.watch, callback => {
      runSequence(
          'compile-scripts',
          'reload',
          callback
      );
    });

    gulp.watch(cfg.paths.public.watch, callback => {
      runSequence(
          'compile-html',
          'reload',
          callback
      );
    });

    gulp.watch(cfg.paths.libs + '**/*', callback => {
      runSequence(
          'copy-static',
          'reload',
          callback
      );
    });
});


// -- task serve

gulp.task('gulp:serve', (callback) => {
    runSequence(
        'gulp:compile',
        [
            'runServer', 'gulp:watch'
        ],
        callback
    );
});

// -- task default

gulp.task('default', gulp.series('clean', 'gulp:compile'));
