var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var cssnano = require('gulp-cssnano');
var rename = require('gulp-rename');
var del = require('del');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var cache = require('gulp-cache');
var autoprefixer = require('gulp-autoprefixer');
// gulp.task('hello',function(){
//    return gulp.src('source-files')
//    .pipe(plugin())
//    .pipe(gulp.dest('folder'))
// });

// Sass preprocessing
gulp.task('sass', function(){
   return gulp.src('app/scss/*.scss')
   .pipe(sass({nesting: false}))
   .pipe(autoprefixer(['last 15 versions'], {cascade: true}))
   .pipe(gulp.dest('app/css'))
   .pipe(browserSync.reload({stream:true}));
});

gulp.task('browser-sync',function(){
   browserSync({
      server:{
         baseDir: 'app'
      },
      notify: false
   });
});

gulp.task('css-min',['sass'], function(){
   return gulp.src('app/css/main.css')
   .pipe(cssnano())
   .pipe(rename({suffix: '.min'}))
   .pipe(gulp.dest('app/css'));
});

gulp.task('clean',function(){
   return del.sync('dist');
});

gulp.task('cleanCache',function(){
   return cache.clearAll();
});

gulp.task('img', function(){
   return gulp.src('app/img/**/*')
   .pipe(cache(imagemin({
      interlaced: true,
      processive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()]
   })))
   .pipe(gulp.dest('dist/img'));
});

gulp.task('watch', ['browser-sync', 'img', 'css-min'], function(){
   gulp.watch('app/scss/*.scss', ['sass']);
   gulp.watch('app/*.html', browserSync.reload);
   gulp.watch('app/js/*.js', browserSync.reload);
});

gulp.task('build', ['clean','sass'], function(){
   var buildCss = gulp.src([
      'app/css/main.css',
      'app/css/main.min.css'
   ])
   .pipe(gulp.dest('dist/css'));

   var buildFonts = gulp.src('app/fonts/**/*')
   .pipe(gulp.dest('dist/fonts'));

   var buildJs = gulp.src('app/js/**/*')
   .pipe(gulp.dest('dist/js'));

   var buildHtml = gulp.src('app/*.html')
   .pipe(gulp.dest('dist'));
});
