module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt, {scope: 'devDependencies'});

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // Need a copy to handle release tasks.
        pkgCopy: grunt.file.readJSON('package.json'),

        clean: ['dist/'],

        lintspaces: {
            options: {
                editorconfig: '.editorconfig'
            },
            all: [
                'src/**/*.{json,mcmeta}',
                'src/**/*.properties'
            ],
        },

        jsonlint: {
            all: {
                options: {
                    indent: 2
                },
                src: ['src/**/*.{json,mcmeta}']
            }
        },

        jsonmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'src/',
                    src: ['**/*.{json,mcmeta}'],
                    dest: 'dist/'
                }]
            }
        },

        imagemin: {
            dist: {
                options: {
                    optimizationLevel: 3
                },
                files: [{
                    expand: true,
                    cwd: 'src/',
                    src: ['**/*.png'],
                    dest: 'dist/'
                }]
            }
        },

        copy: {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'src/',
                    src: [
                        '**',
                        '!<%= jsonmin.dist.files[0].src %>',
                        '!<%= imagemin.dist.files[0].src %>',
                        '!**/*.xcf'
                    ],
                    dest: 'dist/'
                }, {
                    'dist/assets/minecraft/lang/en_AU.lang': 'src/assets/minecraft/lang/en_US.lang',
                    'dist/assets/minecraft/lang/en_CA.lang': 'src/assets/minecraft/lang/en_US.lang'
                }]
            },
            lang: {
                options: {
                    process: function(content, srcPath) {
                        return content
                            .replace('language.region=United States', 'language.region=Great Britain')
                            .replace('language.code=en_US', 'language.code=en_GB')
                            .replace(/=([^\n]*)\b(col|flav|behavi|harb|hon|hum|lab|neighb|rum|splend)or\b/ig, '=$1$2our')
                            .replace(/=([^\n]*)\b(calib|cent|fib|goit|lit|lust|manoeuv|meag|met|mit|nit|och|reconnoit|sab|saltpet|sepulch|somb|spect|theat|tit)er\b/ig, '=$1$2re')
                            .replace(/=([^\n]*)\b(defen|offen|preten)se/g, '=$1$2ce');
                    }
                },
                src: 'src/assets/minecraft/lang/en_US.lang',
                dest: 'dist/assets/minecraft/lang/en_GB.lang'
            }
        },

        compress: {
            build: {
                options: {
                    archive: 'minecraft-rp-<%= new Date().getTime() %>.zip',
                },
                files: [{
                    expand: true,
                    dot: false,
                    cwd: 'dist/',
                    src: ['**'],
                    dest: '.'
                }]
            }
        }
    });

    // Default task
    grunt.registerTask('default', ['rebuild']);

    grunt.registerTask('build', ['lintspaces', 'jsonlint', 'clean', 'jsonmin', 'imagemin', 'copy', 'compress']);
    grunt.registerTask('rebuild', ['lintspaces', 'jsonlint', 'newer:jsonmin', 'newer:imagemin', 'copy', 'compress'])
};
