var gulp = require('gulp'),
watch = require('gulp-watch'),
browserSync = require('browser-sync').create();

gulp.task('watch', function(){

  browserSync.init({
    notify: false,
    server:{
      baseDir: "app/public"
    }
  })

  watch('./app/public/**/*.html', function(){
    browserSync.reload();
  });

  watch('./app/public/scripts/*.js', function(){
    browserSync.reload();
  });

  watch('./app/styles/**/*.css', function(){
    gulp.start('cssInject');
  })

})

gulp.task('cssInject', ['styles'], function(){
  return gulp.src('./app/public/styles.css')
    .pipe(browserSync.stream());
});
