/**
 *
 * @author ak-code <alaunalkauniyyah3@gmail.com>
 * @copyright 2020 A.kauniyyah | Front-end Web developer
 *
 * ________________________________________________________________________________
 *
 * gulpfile.config.js
 *
 * The gulp configuration file.
 *
 */


// -- Settings | Turn on/off build features

const SETTINGS = {
    clean: true,
    scripts: true,
    styles: true,
    static: true,
    public: true,
    reload: true
};

// -- Header Template | Append of header in script js or css

const BANNERS = {
    main: '/*!' +
        ' <%= package.name %> v<%= package.version %>' +
        ' | (c) ' + new Date().getFullYear() + ' <%= package.author.name %>' +
        ' | <%= package.license %> License' +
        ' | author <%= package.author %>' +
        ' */\n'
};

// -- Uglify setup | setup of dev or prod env build

const UGLIFY = {
    prod: {
        compress: {
            drop_console: true,
            drop_debugger: true
        }
    },
    dev: {
        compress: {
            drop_console: false,
            drop_debugger: false
        }
    }
};


// -- path config | setup of path src or dist file

const SRC = './src/';
const BUILD = './build/';
const STATIC = BUILD + 'static/';
const ASSETS = SRC + 'assets/';
const LIBS = SRC + 'libs/';
const HTML = SRC + 'public/';

const PATHS = {
    output: STATIC,
    input: ASSETS,
    libs: LIBS,
    build: BUILD,
    html: HTML,
    src: SRC,
    styles: {
        dir: ASSETS + 'scss/',
        input: ASSETS + 'scss/*.scss',
        watch: ASSETS + 'scss/**/*.scss',
        output: STATIC + 'css/'
    },
    scripts: {
        dir: ASSETS + 'js/',
        input: ASSETS + 'js/*.js',
        watch: ASSETS + 'js/**/*.js',
        output: STATIC + 'js/'
    },
    public: {
        input: [
            HTML + '*.html',
            '!' + HTML + '_*.html'
        ],
        output: BUILD,
        watch: HTML + '**/*.html',
        data: './site.config',
    }
};


// -- bundle config | all for export

module.exports = {
    paths: PATHS,
    uglify: UGLIFY,
    header: BANNERS,
    settings: SETTINGS
};
