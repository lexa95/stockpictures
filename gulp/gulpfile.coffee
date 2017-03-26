gulp 		= require 'gulp'
livereload 	= require 'gulp-livereload'
rename 		= require 'gulp-rename'
source 		= require 'vinyl-source-stream'
browserify 	= require 'browserify'
reactify 	= require 'reactify'
uglify 		= require 'gulp-uglify'
buffer 		= require 'vinyl-buffer'

gulp.task 'react-board-app', ->
	process.env.NODE_ENV = 'production'
	browserify  ("src/pictures/board/board.jsx")
		.transform reactify
		.transform('loose-envify', {'process.env.NODE_ENV': 'production'})
		.bundle()
		.pipe source 'board.js'
		.pipe do buffer
		.pipe do uglify
		.pipe rename (path) ->
			path.dirname += '/../../project/static/static_files/js'
		.pipe gulp.dest './project'

gulp.task 'react-like-app', ->
	process.env.NODE_ENV = 'production'
	browserify  ("src/pictures/like/like.jsx")
		.transform reactify
		.transform('loose-envify', {'process.env.NODE_ENV': 'production'})
		.bundle()
		.pipe source 'like.js'
		.pipe do buffer
		.pipe do uglify
		.pipe rename (path) ->
			path.dirname += '/../../project/static/static_files/js'
		.pipe gulp.dest './project'
		
gulp.task 'react-preview-profile-app', ->
	process.env.NODE_ENV = 'production'
	browserify  ("src/profile/profile_preview.jsx")
		.transform reactify
		.transform('loose-envify', {'process.env.NODE_ENV': 'production'})
		.bundle()
		.pipe source 'profile_preview.js'
		.pipe do buffer
		.pipe do uglify
		.pipe rename (path) ->
			path.dirname += '/../../project/static/static_files/js'
		.pipe gulp.dest './project'

gulp.task 'react-boards-app', ->
	process.env.NODE_ENV = 'production'
	browserify  ("src/boards/boards.jsx")
		.transform reactify
		.transform('loose-envify', {'process.env.NODE_ENV': 'production'})
		.bundle()
		.pipe source 'boards.js'
		.pipe do buffer
		.pipe do uglify
		.pipe rename (path) ->
			path.dirname += '/../../project/static/static_files/js'
		.pipe gulp.dest './project'	

gulp.task 'react-pictures-app', ->
	process.env.NODE_ENV = 'production'
	browserify  ("src/pictures/pictures/pictures.jsx")
		.transform reactify
		.bundle()
		.pipe source 'pictures.js'
		.pipe do buffer
		.pipe do uglify
		.pipe rename (path) ->
			path.dirname += '/../../project/static/static_files/js'
		.pipe gulp.dest './project'	

gulp.task 'react-picture-app', ->
	process.env.NODE_ENV = 'production'
	browserify  ("src/picture/picture.jsx")
		.transform reactify
		.bundle()
		.pipe source 'picture.js'
		.pipe do buffer
		.pipe do uglify
		.pipe rename (path) ->
			path.dirname += '/../../project/static/static_files/js'
		.pipe gulp.dest './project'	

gulp.task 'watch', ->
	do livereload.listen
	gulp.watch 'src/pictures/*/*.jsx', ['react-board-app']
	gulp.watch 'src/pictures/*/*.jsx', ['react-like-app']
	gulp.watch 'src/pictures/*/*.jsx', ['react-pictures-app']
	gulp.watch 'src/profile/*.jsx', ['react-preview-profile-app']
	gulp.watch 'src/boards/*.jsx', ['react-boards-app']
	gulp.watch 'src/boards/*/*.jsx', ['react-boards-app']
	gulp.watch 'src/picture/*.jsx', ['react-picture-app']

gulp.task 'default', ['watch', 'react-board-app', 'react-like-app', 'react-preview-profile-app', 'react-boards-app', 'react-picture-app']