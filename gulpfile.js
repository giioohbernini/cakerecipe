/*
    CakeRecipe
    Autor: Giovanni Bernini
*/

//initialize all of our variables
var app, base, directory, gutil, hostname, path, refresh;

var autoPrefixBrowserList = ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'];

var gulp = require('gulp');
var sass = require('gulp-sass');
var gulpautoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync');
var plumber = require('gulp-plumber');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var imagemin = require('gulp-imagemin');
var notify = require( 'gulp-notify');
var clean = require('gulp-clean');
var gulpSequence = require('gulp-sequence').use(gulp);
var cssnano = require('gulp-cssnano');
var htmlmin = require('gulp-htmlmin');



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

// Compilando SCSS para CSS
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

// ========= Deploys ======== //

gulp.task('html-deploy', function() {
    gulp.src('src/*')
        .pipe(plumber())
        .pipe(gulp.dest('dist'));

    //grab any hidden files too
    gulp.src('src/.*')
        .pipe(plumber())
        .pipe(gulp.dest('dist'));

    gulp.src('src/assets/fonts/*')
        .pipe(plumber())
        .pipe(gulp.dest('dist/assets/fonts'));
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
                .pipe(cssnanokkkkkkkk())
                //where to save our final, compressed css file
                .pipe(gulp.dest('dist/assets/css'));
});

gulp.task('js-deploy', function(){
        return gulp.src('src/assets/js/*.js')
                .pipe(plumber())    
                .pipe(uglify())     
                .pipe(gulp.dest('dist/assets/js'));
});

gulp.task('images-deploy', function() {
    gulp.src(['src/assets/images/*'])
        .pipe(plumber())
        .pipe(imagemin())
        .pipe(gulp.dest('dist/assets/images'));
});

// ========= Deploys ======== //




// ======== Clean ======== //

//cleans our dist directory in case things got deleted
gulp.task('clean', function() {
     return gulp.src('dist/', {read: false})
        .pipe(clean());
});

// ======== Clean ======== //



// ========== Minifiers ========== //

gulp.task('minify-js', function() {
    return gulp.src('dist/**/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist/'))
});

gulp.task('minify-css', function() {
    return gulp.src('dist/**/*.css')
    .pipe(cssnano({safe: true}))
    .pipe(gulp.dest('dist/'))
});

gulp.task('minify-html', function() {
    return gulp.src('dist/**/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('dist/'))
});

// ========== Minifiers ========== //





// ========== Notifiers ========== //

// New changes notify
gulp.task('notifyWatch', function() {
  gulp.src(['src/*'])
    .pipe(notify('Watching your changes'));
});

// Deploy notify
gulp.task('notifyDeploy', function() {
  gulp.src(['src/*'])
    .pipe(notify('Your deploy has been completed'));
});

// ========== Notifiers ========== //



// ======= Final Tasks ======= //

gulp.task('minify', ['minify-js', 'minify-css', 'minify-html']);

//Watch task
gulp.task('watch', ['browserSync', 'styles', 'notifyWatch'], function() {
    gulp.watch('src/assets/sass/*.scss',['styles']);
    gulp.watch('src/*.html',['html']);
});


gulp.task('deploy', gulpSequence('clean', 'html-deploy', 'styles-deploy', 'js-deploy', 'images-deploy', 'minify', 'notifyDeploy'));

// ======= Final Tasks ======= //