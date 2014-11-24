var gulp        = require("gulp");
var rename      = require("gulp-rename");
var minifyCSS   = require("gulp-minify-css");
var concat      = require("gulp-concat");
var coffee      = require("gulp-coffee");
var sass        = require("gulp-ruby-sass");
var uglify      = require("gulp-uglify");
var size        = require("gulp-size");
var prefix      = require("gulp-autoprefixer");
var plumber     = require("gulp-plumber");
var imagemin    = require("gulp-imagemin");
var pngquant    = require("imagemin-pngquant");
var browserSync = require("browser-sync");
var reload      = browserSync.reload;

// Compile Sass
gulp.task('sass', function(){
  return gulp.src('src/sass/style.scss')
    .pipe(plumber())
    .pipe(sass({ style: 'expanded' }))
    .pipe(prefix())
    .pipe(gulp.dest('dist/css'))
    .pipe(minifyCSS())
    .pipe(gulp.dest('dist/css'))
    .pipe(size({ gzip: true, showFiles: true}))
    .pipe(reload({ stream: true }))
});

// Compile CoffeeScript
gulp.task('coffee', function(){
  return gulp.src('src/js/main.coffee')
    .pipe(plumber())
    .pipe(coffee({ bare: true }))
    .pipe(gulp.dest('dist/js'))
    .pipe(size())
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
    .pipe(size({ gzip: true, showFiles: true}))
    .pipe(reload({ stream: true }))
});

// Compile JS Files
gulp.task('js', function(){
  return gulp.src('src/js/**/*.js')
    .pipe(plumber())
    .pipe(gulp.dest('dist/js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
    .pipe(size({ gzip: true, showFiles: true}))
    .pipe(reload({ stream: true }))
});

// Start BrowserSync Server
gulp.task('bs', function() {
  browserSync.init(null, {
    server: {
      baseDir: "./"
    }
  });
});

// Reload Browser
gulp.task('bs-reload', function () {
  browserSync.reload();
});

// Minify Images
gulp.task('images', function () {
  return gulp.src('src/images/*')
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()]
    }))
    .pipe(gulp.dest('dist/images'));
});

// Default Task
gulp.task('default', ['sass', 'coffee', 'js', 'bs', 'bs-reload'], function(){
  gulp.watch('src/sass/**/*.scss', ['sass']);
  gulp.watch('src/js/**/*.coffee', ['coffee'])
  gulp.watch('src/js/**/*.js', ['js'])
});

// Build Task
gulp.task('build', ['sass', 'coffee', 'js', 'images'], function(){

});