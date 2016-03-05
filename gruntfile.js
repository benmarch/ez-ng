/**
 * @file
 *
 * ### Responsibilities
 * - automate common tasks using grunt
 *
 * Scaffolded with generator-microjs v0.1.2
 *
 * @author  <>
 */
'use strict';

module.exports = function (grunt) {
    var config = {
        app: 'src',
        dist: 'dist',
        test: 'test'
    };

    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    grunt.initConfig({
        config: config,


        jshint: {
            options: {
                jshintrc: '.jshintrc',
                ignores: ['<%= config.app %>/lib/**/*.js']
            },
            all: [
                'gruntfile.js',
                '<%= config.app %>/{,*/}*.js',
                'test/spec/{,*/}*.js'
            ]
        },


        concat: {
            all: {
                src: ['<%= config.app %>/ez-ng.js', '<%= config.app %>/**/*.js'],
                dest: '<%= config.dist %>/ez-ng.js'
            }
        },


        uglify: {
            all: {
                src: '<%= config.dist %>/ez-ng.js',
                dest: '<%= config.dist %>/ez-ng.min.js'
            }
        },


        karma: {
            unit: {
                configFile: '<%= config.test %>/karma.conf.js'
            }
        },


        wiredep: {
            test: {
                src: '<%= config.test %>/karma.conf.js',
                devDependencies: true,
                fileTypes: {
                    js: {
                        block: /(([\s\t]*)\/\/\s*bower:*(\S*))(\n|\r|.)*?(\/\/\s*endbower)/gi,
                        detect: {
                            js: /'(.*\.js)'/gi
                        },
                        replace: {
                            js: '\'{{filePath}}\','
                        }
                    }
                }
            }
        },

        release: {
            options: {
                additionalFiles: ['bower.json'],
                indentation: '    ',
                commitMessage: 'Bumped version to <%= version %>',
                tagMessage: 'Committing release tag <%= version %>'
            }
        },

        jsdoc2md: {
            oneOutputFile: {
                src: 'src/**/*.js',
                dest: 'docs/documentation.md'
            }
        }
    });

    grunt.registerTask('test', [
        'karma:unit'
    ]);

    grunt.registerTask('build', [
        'concat',
        'uglify'
    ]);

    grunt.registerTask('docs', [
        'jsdoc2md',
        'readme'
    ]);

    grunt.registerTask('default', [
        'jshint',
        'test',
        'build'
    ]);

    grunt.registerTask('readme', function () {
        var readme = grunt.file.read('README.template.md'),
            docs = grunt.file.read('docs/documentation.md');

        grunt.file.write('README.md', readme.replace('{{{DOCUMENTATION}}}', docs));
    });
};
