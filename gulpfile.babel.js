import gulp from 'gulp';
import browserSync from 'browser-sync';
import plumber from 'gulp-plumber';
import sass from 'gulp-sass';
import size from 'gulp-size';
import autoprefixir from 'gulp-autoprefixer';
import cssnano from 'gulp-cssnano';
import sourcemaps from 'gulp-sourcemaps';
import webpack from 'gulp-webpack';
import imagemin from 'gulp-imagemin';
import pngquant from 'imagemin-pngquant';
import htmlmin from 'gulp-htmlmin';

const paths = {
  css: {
    src: './src/stylesheets/style.scss',
    dist: './build/stylesheets'
  },
  js: {
    src: './src/javascripts/script.js',
    dist: './build/javascripts'
  },
  images: {
    src: './src/images/**/*',
    dist: './build/images'
  },
  html: {
    src: './src/**/*.html',
    dist: './build/'
  }
}

gulp.task('css', () => {
  return gulp.src(paths.css.src)
    .pipe(size())
    .pipe(plumber())
    .pipe(sass())
    .pipe(autoprefixir())
    .pipe(cssnano())
    .pipe(size())
    .pipe(gulp.dest(paths.css.dist))
    .pipe(browserSync.stream());
});

gulp.task('js', () => {
  return gulp.src(paths.js.src)
    .pipe(webpack({
      output: {
        filename: 'bundle.js',
      },
      module: {
        loaders: [
          {
            test: /.js?$/,
            loader: 'babel-loader',
            exclude: /node_modules/
          }
        ],
      },
    }))
    .pipe(gulp.dest(paths.js.dist))
    .pipe(browserSync.stream());
})

gulp.task('images', () => {
  return gulp.src(paths.images.src)
    .pipe(size())
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()]
    }))
    .pipe(size())
    .pipe(gulp.dest(paths.images.dist))
    .pipe(browserSync.stream());
});

gulp.task('html', () => {
  return gulp.src(paths.html.src)
    .pipe(htmlmin())
    .pipe(gulp.dest(paths.html.dist))
})

// Browser-sync base server
gulp.task('browser-sync', () => {
  return browserSync.init({
    server: {
      baseDir: './build'
    }
  })
});

// Default gulp task
gulp.task('default', ['css', 'js', 'images', 'html'], () => {});

// Watch assets and recompile
gulp.task('watch', ["css", "js", "images", "html", "browser-sync"], () => {
  gulp.watch('./src/stylesheets/**/*.scss', ['css'])
  gulp.watch('./src/javascripts/**/*.js', ['js'])
  gulp.watch('./src/images/*', ['images'])
  gulp.watch('./src/**/*.html', ['html'])
});
