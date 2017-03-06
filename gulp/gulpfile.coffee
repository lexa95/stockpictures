gulp 		= require 'gulp'
jade 		= require 'gulp-jade'
livereload 	= require 'gulp-livereload'
stylus 		= require 'gulp-stylus'
rename 		= require 'gulp-rename'


gulp.task 'jade', ->
	gulp.src 'src/jade-template/*/*.jade'
		.pipe do jade
		.pipe rename (path) ->
			path.dirname += '/templates/' + path.dirname;
		.pipe gulp.dest '../project'
		.pipe do livereload

gulp.task 'stylus', ->
	gulp.src 'src/stylus/*/*.styl'
		.pipe stylus set: ['compress']
		.pipe gulp.dest '../project/static/static_files/css'
		.pipe do livereload

gulp.task 'watch', ->
	do livereload.listen
	gulp.watch 'src/jade-template/*/*.jade', ['jade']
	gulp.watch 'src/stylus/*/*.styl', ['stylus']

gulp.task 'default', ['stylus', 'watch', 'jade']


# 		.pipe rename (path) ->
# 			path.dirname += "/build";


# function getFolders(dir) {
#     return fs.readdirSync(dir)
#       .filter(function(file) {
#         return fs.statSync(path.join(dir, file)).isDirectory();
#       });
# }