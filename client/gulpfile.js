let browserSync = require('browser-sync').create();
let gulp = require('gulp');
let pug = require('gulp-pug');
let scss = require('gulp-sass');
let concat = require('gulp-concat');
let plumber = require('gulp-plumber');
let notifier = require('node-notifier');
let rename = require("gulp-rename");
let cleanCSS = require('gulp-clean-css');
let prefixer = require('gulp-autoprefixer');
let uglify = require('gulp-uglify');
let babel = require('gulp-babel');
let imagemin = require('gulp-imagemin');

let plumberNotifyConfig = { errorHandler: function(err) {
        console.log(err);
        notifier.notify({
            title: "Gulp error in " + err.plugin,
            sound: false,
            message:  err.toString()
        });
    }};

/* project paths */
let paths = {
        styles: {
            src: ['src/global/styles/service/_variables.scss', 'src/global/styles/*/*.scss', 'src/global/styles/index.scss', 'src/components/*/*/*.scss',],
            tempDir: 'src/global/styles/temp',
            dir: '../docs/homework-1/',
        },
        scripts: {
            src: ['src/global/scripts/vendor/*.js','src/global/scripts/index.js','src/components/*/*/*.js'],
            dir: '../docs/homework-1/'
        },
        index: {
            src: ['src/global/index.pug','src/components/**/*.pug', './config.js','./events.json'],
            dir: '../docs/homework-1/'
        },
};

/*  styles tasks */
/* yes, combine-scss task is so ugly, but it is required for combine sass, concat for mixins
 `1 work with scss files,
   without it we have to pass all imports (variables, colors....) in each component */
gulp.task('combine-scss', function combineScss() {
    return gulp.src(paths.styles.src)
        .pipe(plumber(plumberNotifyConfig))
        .pipe(rename((path)=>{
            path.extname = ".css";
        }))
        .pipe(concat('styles.css'))
        .pipe(rename((path)=>{
            path.extname = ".scss";
        }))
        .pipe(scss())
        .pipe(gulp.dest(paths.styles.dir));
});

gulp.task('build css', function combineScss() {
    return gulp.src(paths.styles.src)
        .pipe(plumber(plumberNotifyConfig))
        .pipe(rename((path)=>{
            path.extname = ".css";
        }))
        .pipe(concat('styles.css'))
        .pipe(rename((path)=>{
            path.extname = ".scss";
        }))
        .pipe(scss())
        .pipe(prefixer())
        .pipe(cleanCSS())
        .pipe(gulp.dest(paths.styles.dir));
});


gulp.task('styles', ['combine-scss']);

gulp.task('styles-watch', ['styles'], function (done) {
    browserSync.reload();
    done();
});

/* html tasks */

gulp.task('index', function buildIndex() {
    delete require.cache[require.resolve('./config.js')];
    let locals =  require('./config.js');
    return gulp.src(paths.index.src[0])
        .pipe(plumber(plumberNotifyConfig))
        .pipe(pug({
            self: true,
            locals: locals,
            pretty: true
        }))
        .pipe(gulp.dest(paths.index.dir))
});

gulp.task('index-watch', ['index'], function (done) {
    browserSync.reload();
    done();
});

/* scripts tasks */
gulp.task('scripts', function scripts() {
    return gulp.src(paths.scripts.src)
        .pipe(plumber(plumberNotifyConfig))
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest(paths.scripts.dir))
});

gulp.task('build scripts', function scripts() {
    return gulp.src(paths.scripts.src)
        .pipe(plumber(plumberNotifyConfig))
        .pipe(concat('scripts.js'))
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(uglify())
        .pipe(gulp.dest(paths.scripts.dir))
});

gulp.task('scripts-watch', ['scripts'], function (done) {
    browserSync.reload();
    done();
});


/* general watch task */
gulp.task('watch', ['scripts','styles','index'], function () {

    browserSync.init({
        server: {
            baseDir: "../docs"
        }
    });

    gulp.watch(paths.scripts.src, ['scripts-watch']);
    gulp.watch(paths.styles.src, ['styles-watch']);
    gulp.watch(paths.index.src, ['index-watch']);
});

gulp.task('compressImages', () =>
    gulp.src(['../docs/images/*.svg','../docs/images/*.png', '../docs/images/*.jpg'])
        .pipe(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.jpegtran({progressive: true}),
            imagemin.optipng({optimizationLevel: 8}),
            imagemin.svgo({
                plugins: [
                    {removeViewBox: true},
                    {cleanupIDs: false}
                ]
            })
        ]))
        .pipe(gulp.dest('../docs/images/compressed/'))
);


gulp.task('build', ['build css','build scripts', 'index']);