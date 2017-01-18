// ========= Variables ========== //
var app, base, directory, gutil, hostname, path, refresh;

var autoPrefixBrowserList = ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'];

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    gulpautoprefixer = require('gulp-autoprefixer'),
    browserSync = require('browser-sync'),
    plumber = require('gulp-plumber'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    imagemin = require('gulp-imagemin'),
    notify = require( 'gulp-notify'),
    clean = require('gulp-clean'),
    gulpSequence = require('gulp-sequence').use(gulp),
    cssnano = require('gulp-cssnano'),
    htmlmin = require('gulp-htmlmin');
// ========= Variables ========== //

// ========= Watch ======== //
gulp.task('browserSync', function() {
    browserSync({
        server: {
            baseDir: "src/"
        },
        options: {
            reloadDelay: 250
        },
        notify: false
    });

});

// Compiling SCSS for CSS
gulp.task('styles', function() {
    gulp.src('./src/assets/sass/*.scss')
	    .pipe(plumber())
	    //include SCSS and list every "include" folder
                .pipe(sass({
                      errLogToConsole: true,
                      includePaths: [
                          'src/assets/sass/'
                      ]
                }))
        .pipe(gulpautoprefixer({
                   browsers: autoPrefixBrowserList,
                   cascade:  true
                }))
        .pipe(gulp.dest('./src/assets/css/'))
        .pipe(browserSync.reload({stream: true}));
        
});

gulp.task('html', function() {
    //watch any and all HTML files and refresh when something changes
    return gulp.src('src/*.html')
        .pipe(plumber())
        .pipe(browserSync.reload({stream: true}));
});
// ========= Watch ======== //

// ========= Deploys ======== //
gulp.task('html-deploy', function() {
    gulp.src('src/*')
        .pipe(plumber())
        .pipe(gulp.dest('app'));

    //grab any hidden files too
    gulp.src('src/.*')
        .pipe(plumber())
        .pipe(gulp.dest('app'));

    gulp.src('src/assets/fonts/*')
        .pipe(plumber())
        .pipe(gulp.dest('app/assets/fonts'));
});

gulp.task('styles-deploy', function() {
    return gulp.src('src/assets/sass/style.scss')
                .pipe(plumber())
                //include SCSS includes folder
                .pipe(sass({
                      includePaths: [
                          'src/assets/sass',
                      ]
                }))
                .pipe(gulpautoprefixer({
                  browsers: autoPrefixBrowserList,
                  cascade:  true
                }))
                //the final filename of our combined css file
                .pipe(concat('style.css'))
                .pipe(cssnano())
                //where to save our final, compressed css file
                .pipe(gulp.dest('app/assets/css'));
});

gulp.task('js-deploy', function(){
        return gulp.src('src/assets/js/*.js')
                .pipe(plumber())    
                .pipe(uglify())     
                .pipe(gulp.dest('app/assets/js'));
});

gulp.task('images-deploy', function() {
    gulp.src(['src/assets/img/*'])
        .pipe(plumber())
        .pipe(imagemin())
        .pipe(gulp.dest('app/assets/img'));
});
// ========= Deploys ======== //

// ======== Clean ======== //
gulp.task('clean', function() {
     return gulp.src('app/', {read: false})
        .pipe(clean());
});
// ======== Clean ======== //

// ========== Minifiers ========== //
gulp.task('minify-js', function() {
    return gulp.src('app/**/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('app/'))
});

gulp.task('minify-css', function() {
    return gulp.src('app/**/*.css')
    .pipe(cssnano({safe: true}))
    .pipe(gulp.dest('app/'))
});

gulp.task('minify-html', function() {
    return gulp.src('app/**/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('app/'))
});
// ========== Minifiers ========== //

// ========== Notifiers ========== //
gulp.task('notifyWatch', function() {
  gulp.src(['src/*'])
    .pipe(notify('Watching your changes'));
});

gulp.task('notifyDeploy', function() {
  gulp.src(['src/*'])
    .pipe(notify('Your deploy has been completed'));
});
// ========== Notifiers ========== //

// ======= Final Tasks ======= //
gulp.task('minify', ['minify-js', 'minify-css', 'minify-html']);

gulp.task('watch', ['browserSync', 'styles', 'notifyWatch'], function() {
    gulp.watch('src/assets/sass/*.scss',['styles']);
    gulp.watch('src/*.html',['html']);
});

gulp.task('deploy', gulpSequence('clean', 'html-deploy', 'styles-deploy', 'js-deploy', 'images-deploy', 'minify', 'notifyDeploy'));
// ======= Final Tasks ======= //