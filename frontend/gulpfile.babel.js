'use strict';

/**
 * Import modules
 */
import gulp         from 'gulp';
import babel        from 'gulp-babel';
import stylus       from 'gulp-stylus';
import autoprefixer from 'gulp-autoprefixer';
import csso         from 'gulp-csso';
import concat       from 'gulp-concat';
import notify       from 'gulp-notify';
import imagemin     from 'gulp-imagemin';
import rename       from 'gulp-rename';
import uglify       from 'gulp-uglify';
import htmlmin      from 'gulp-htmlmin';
import pug          from 'gulp-pug';
import sort         from 'gulp-sort';
import del          from 'del';

const dirs = {
    from : './assets/',
    to   : '../client/assets/'
};

/**
 * Default task
 */
gulp.task('default',
    [
        'watch',
        // 'clean',
        // 'imagemin',
        // 'fonts',
        // 'libs',
        'scripts',
        'stylus',
        'pug'
    ]);

/**
 * Watcher. Rerun the task when a file changes
 */
gulp.task('watch', () => {
    gulp.watch(pugPath.watch, ['pug']);
    gulp.watch(stylPath.watch, ['stylus']);
    gulp.watch(scriptsPath.from, ['scripts']);
});

/**
 * Clean assets in build directory
 */
const cleanPath = {
    css  : `${dirs.to}css/**/*`,
    js   : `${dirs.to}js/**/*`,
    libs : `${dirs.to}libs/**/*`,
    img  : `${dirs.to}img/**/*`,
    fonts: `${dirs.to}fonts/**/*`,
    html : `../client/*.html`
};

gulp.task('clean', () => {
    return del([
        cleanPath.css,
        cleanPath.js,
        cleanPath.libs,
        cleanPath.img,
        cleanPath.fonts,
        cleanPath.html
    ], {force: true});
});

/**
 * Compile css files
 */
const stylPath = {
    watch: `${dirs.from}styl/**/*`,
    from : [
        `${dirs.from}styl/base.styl`
    ],
    to   : `${dirs.to}css/`
};

gulp.task('stylus', () => {
    let _options = {
        compress: true,
        paths: [dirs.from],
        'include css': true
    };

    del([cleanPath.css], {force: true});

    return gulp.src(stylPath.from)
        .pipe(stylus({
            compress: false,
            paths: [dirs.from],
            'include css': true
        }))
        .on('error', console.log)
        .pipe(concat('main.css'))
        .pipe(gulp.dest(stylPath.to))
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'Firefox 49', 'Opera 41', 'ie 11', 'iOS 10', 'Safari 10']
        }))
        .pipe(stylus(_options))
        .on('error', console.log)
        .pipe(concat('main.css'))
        .pipe(gulp.dest(stylPath.to))
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'Firefox 49', 'Opera 41', 'ie 11', 'iOS 10', 'Safari 10']
        }))
        .pipe(csso())
        .pipe(concat('main.min.css'))
        .pipe(gulp.dest(stylPath.to))
        .pipe(notify({ message: 'Css task complete' }));
});

/**
 * Imagemin
 */
const imgPath = {
    from : `${dirs.from}img/**/*`,
    to   : `${dirs.to}img/`
};

gulp.task('imagemin', () => {
    del([cleanPath.img], {force: true});

    return gulp.src(imgPath.from)
        .pipe(imagemin({
            plugins: [
                imagemin.svgo({})
            ],
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest(imgPath.to))
});

/**
 * Build libs
 */
const libsPath = {
    from : `${dirs.from}libs/**/*.js`,
    to   : `${dirs.to}libs/`
};

gulp.task('libs', () => {
    del([cleanPath.libs], {force: true});

    return gulp.src(`${dirs.from}libs/**/*.js`)
        .pipe(sort())
        .pipe(concat('libs.js'))
        .pipe(gulp.dest(libsPath.to))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest(libsPath.to))
        .pipe(notify({ message: 'Libs task complete' }));
});

/**
 * Compile JavaScript files
 */
const scriptsPath = {
    from : `${dirs.from}js/**/*.js`,
    to   : `${dirs.to}js/`
};

gulp.task('scripts', () => {
    return gulp.src(scriptsPath.from)
        /*
        .pipe(babel({
            presets: ['es2015'],
        }))
        */
        .pipe(concat('main.js'))
        .pipe(gulp.dest(scriptsPath.to))
        .pipe(rename({suffix: '.min'}))
        /*
        .pipe(babel({
            minified: true,
            compact: true,
            comments: false
        }))
        */
        .pipe(gulp.dest(scriptsPath.to))
        .pipe(notify({ message: 'Scripts task complete' }));
});

/**
 * Import fonts
 */
const fontsPath = {
    from : `${dirs.from}fonts/**/*`,
    to   : `${dirs.to}fonts/`
};

gulp.task('fonts', () => {
    del([cleanPath.fonts], {force: true});

    return gulp.src(fontsPath.from)
        .pipe(gulp.dest(fontsPath.to));
});

/**
 * Compile pug files
 */
const pugPath = {
    from : `${dirs.from}pug/index.pug`,
    to   : `../client/`,
    watch: `${dirs.from}pug/**/*`
};

gulp.task('pug', () => {
    del([cleanPath.html], {force: true});

    return gulp.src(pugPath.from)
        .pipe(pug({
            basedir: '../',
            pretty: true
        }))
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(gulp.dest(pugPath.to))
        .pipe(notify({ message: 'Pug task complete' }));
});
