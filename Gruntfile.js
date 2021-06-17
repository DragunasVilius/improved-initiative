const appVersion = require("./package.json").version;

module.exports = function(grunt) {
  grunt.loadNpmTasks("grunt-ts");
  grunt.loadNpmTasks("grunt-webpack");
  grunt.loadNpmTasks("grunt-contrib-less");
  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-copy");

  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    ts: {
      server: {
        tsconfig: "./server/tsconfig.json"
      }
    },
    webpack: {
      options: {
        keepalive: false
      },
      dev: require("./webpack.config.dev"),
      prod: require("./webpack.config.prod")
    },
    less: {
      default: {
        files: {
          ["public/css/improved-initiative." + appVersion + ".css"]: [
            "lesscss/improved-initiative.less"
          ]
        }
      }
    },
    watch: {
      tsserver: {
        files: "server/**/*.ts",
        tasks: ["ts:server"]
      },
      lesscss: {
        files: "lesscss/**/*.less",
        tasks: ["less"]
      }
    },
    copy: {
      main: {
        files: [
          {
            expand: true,
            cwd: "node_modules/@fortawesome/fontawesome-free/webfonts/",
            src: ["**"],
            dest: "public/webfonts/"
          }
        ]
      }
    }
  });

  grunt.registerTask("build_dev", ["webpack:dev", "ts:server", "less"]);
  grunt.registerTask("build_min", ["webpack:prod", "ts:server", "less"]);
  grunt.registerTask("default", ["build_dev", "watch"]);
  grunt.registerTask("postinstall", ["copy"]);
};
