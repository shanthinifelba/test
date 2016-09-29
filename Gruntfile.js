/**
 * Created by rajendr on 9/29/2016.
 */
module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        requirejs: {
                    compile: {
                       options: {
                               baseUrl: './javascripts',
                                   mainConfigFile: './javascripts/main.js',
                                   name: 'main',
                                   out: './dist/app.js',
                                   optimize: "none",
                               },
                   },
        },
        jshint: {
            files: ["Gruntfile.js", "javascripts/**/*.js"],
            options: {
                maxerr: 30,
                // undef: true,
                // unused: true,
                globals: {
                    jQuery: true,
                    console: true,
                    module: false,
                    alert: true,
                },
            },
        },
        jasmine: {
            src: "javascripts/**/*.js",
        },
        //added grunt watch
        watch:{
            scripts:{
                files: "javascripts/**/*.js",
                tasks:["jshint"],
                options: {
                    spawn:false,
                },
            },
        },
    });

    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-requirejs");
    grunt.loadNpmTasks("grunt-contrib-jasmine");
    grunt.loadNpmTasks("grunt-contrib-watch");

    grunt.registerTask("default", ["jshint", "jasmine","requirejs"]);
};