var expect = require('expect.js');

module.exports = function(grunt) {

  // Project configuration

  var pkg = grunt.file.readJSON('package.json');

  grunt.initConfig({
    pkg: pkg,
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
        sourceMap: 'build/<%= pkg.name %>-min.map'

      },
      build: {
        src: 'build/<%= pkg.name %>.js',
        dest: 'build/<%= pkg.name %>-min.js'
      }
    },
    requirejs: {
      compile: {
        options: {
          baseUrl: 'src',
          name: '<%= pkg.name %>', // assumes a production build using almond
          out: 'build/<%= pkg.name %>.js',
          wrap: {
            startFile: 'src/intro.js',
            endFile: 'src/outro.js'
          },
          optimize: 'none',
          skipSemiColonInsertion: true,
          onBuildWrite: convert,
          paths: {
            'core' : './core'
          }
        }
      }
    },

    // Configure a MochaTest task
    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/*.js']
      }
    },

    clean: ['build']
  });


  function convert( name, path, contents ) {
    var amdName;
    var rdefineEnd = /\}\);[^}\w]*$/;

    // Convert var modules
    if ( /.\/var\//.test( path ) ) {
      contents = contents
        .replace( /define\([\w\W]*?return/, "var " + (/var\/([\w-]+)/.exec(name)[1]) + " =" )
        .replace( rdefineEnd, "" );
    } else {
    
        contents = contents
          .replace( /\s*return\s+[^\}]+(\}\);[^\w\}]*)$/, "$1" )
          // Multiple exports
          .replace( /\s*exports\.\w+\s*=\s*\w+;/g, "" );


      // Remove define wrappers, closure ends, and empty declarations
      contents = contents
        .replace( /define\([^{]*?{/, "" )
        .replace( rdefineEnd, "" );

      // Remove anything wrapped with
      // /* ExcludeStart */ /* ExcludeEnd */
      // or a single line directly after a // BuildExclude comment
      contents = contents
        .replace( /\/\*\s*ExcludeStart\s*\*\/[\w\W]*?\/\*\s*ExcludeEnd\s*\*\//ig, "" )
        .replace( /\/\/\s*BuildExclude\n\r?[\w\W]*?\n\r?/ig, "" );

      // Remove empty definitions
      contents = contents
        .replace( /define\(\[[^\]]+\]\)[\W\n]+$/, "" );
    }

    contents = contents
      // Embed Version
      .replace( /\%version\%/g, pkg.version);

    return "\n" + contents.trim();
  }


  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Load the require optimizer task
  grunt.loadNpmTasks('grunt-contrib-requirejs');

  // Load Mocha task
  grunt.loadNpmTasks('grunt-mocha-test');

  // Build task
  grunt.registerTask('build', ['requirejs', 'uglify']);

  // Test task
  grunt.registerTask('test', ['mochaTest']);

  // Load clean task
  grunt.loadNpmTasks('grunt-contrib-clean');

  // Default task(s).
  grunt.registerTask('default', ['build']);
};