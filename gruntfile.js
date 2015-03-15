module.exports = function (grunt) {
  'use strict';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    connect: {
      server: {
        options: {
          port: 8090,
          base: '.'
        }
      }
    },

    open: {
      dev: {
        path: 'http://localhost:8090'
      }
    },

    watch: {
      all: {
        files: ['*.html', 'css/*.css', 'js/*.js'],
        options: {
          livereload: true
        }
      }
    },

    uglify: {
      dist: {
        files: {
          'dist/js/main.js': ['js/main.js'],
          'dist/js/chop-bundle.js': ['js/chop-bundle.js'],
          'dist/vendor/js/chopjs.js': ['vendor/js/chopjs.js']
        }
      }
    },

    htmlmin: {
      dist: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        files: {
          'dist/index.html': 'index.html',
          'dist/targetTemplate.html': 'targetTemplate.html',
          'dist/listTemplate.html': 'listTemplate.html'
        }
      }
    },

    cssmin: {
      dist: {
        files: {
          'dist/css/style.css': ['css/style.css'],
          'dist/vendor/css/normalize.css': ['vendor/css/normalize.css'],
          'dist/vendor/css/ui.css': ['vendor/css/ui.css']
        }
      }
    },

    copy: {
      dist: {
        files: [
          {expand: true, src: ['dict.json'], dest: 'dist/'}
        ]
      }
    },

    ftpush: {
      dist: {
        auth: {
          host: 'feifeihang.info',
          port: 21,
          authKey: 'key'
        },
        src: 'dist/',
        dest: '/public_html/guess/'
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-open');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-ftpush');

  grunt.registerTask('serve', ['connect', 'open', 'watch']);
  grunt.registerTask('build', ['uglify', 'htmlmin', 'cssmin', 'copy']);
  grunt.registerTask('deploy', ['ftpush']);

};
