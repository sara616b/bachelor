const path = require('path');
const webpack = require('webpack');
const BundleTracker = require('webpack-bundle-tracker');

module.exports = () => {
    const config = {
        context: __dirname,
        entry: {
            'cms_login': ['/project/frontend/cms/Pages/LoginPage/LoginPage.jsx'],
            'cms_frontpage': ['/project/frontend/cms/Pages/Frontpage/Frontpage.jsx'],
            'cms_usersoverview': ['/project/frontend/cms/Pages/UsersOverview/UsersOverview.jsx'],
            'cms_createuser': ['/project/frontend/cms/Pages/CreateUser/CreateUser.jsx'],
            'cms_edituser': ['/project/frontend/cms/Pages/EditUser/EditUser.jsx'],
            // cms_index: ['./frontend/CMS/Pages/Index/Index.jsx'],
            // cms_page_create: ['./frontend/CMS/Pages/CreatePage/CreatePage.jsx'],
            // cms_page_edit: ['./frontend/CMS/Pages/EditPage/EditPage.jsx'],
            // cms_page_overview: ['./frontend/CMS/Pages/PageOverview/PageOverview.jsx'],
            // website_page: ['./frontend/Website/Pages/Page'],
        },
        output: {
            filename: '[name].js',
            path: path.resolve('static'),
            publicPath: 'http://localhost:3000/static/'
        },
        watchOptions: {
            aggregateTimeout: 200,
            poll: true,
            ignored: /node_modules/,
        },

        mode: 'development',
        devServer: {
            // client: {
            //     webSocketURL: 'ws://localhost:3000/ws'
            // },
            // webSocketServer: 'ws',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'X-Content-Type-Options': 'nosniff',
            },
            port: 3000,
            watchFiles: {
                paths: ['frontend/**/*'],
                options: {
                    usePolling: true
                }
            }
        },
        optimization: {
            runtimeChunk: 'single',
        },
        plugins: [
            new BundleTracker({ filename: 'webpack-stats.json' }),
        ],
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    exclude: /(node_modules)/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: false,
                            presets: [
                                ['@babel/preset-env', { targets: "defaults" }]
                            ]
                        }
                    }
                }
            ]
        },
        resolve: {
            extensions: ['.jsx', '.js']
        }
    }

    return config;
};
