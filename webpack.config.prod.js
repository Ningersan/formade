const path = require('path')
const webpack = require('webpack')
const autoprefixer = require('autoprefixer')

module.exports = {
    // 编译入口
    entry: [
        path.resolve(__dirname, './src/index.js'),
    ],

    // 编译出口
    output: {
        path: path.resolve(__dirname, './build'),
        publicPath: '/build',
        filename: 'bundle.js',
    },

    // 引用但是不打包的文件
    externals: {
        'react.min.js': 'window.React',
    },

    plugins: [
        // 设置LoaderOptionsPlugin 开启代码压缩
        new webpack.LoaderOptionsPlugin({
            minimize: false,
            debug: true,
        }),

        // uglify 配置
        new webpack.optimize.UglifyJsPlugin({
            beautify: false,
            comments: false,
            compress: {
                warnings: false,
                drop_console: true,
                collapse_vars: true,
            },
        }),

        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production'),
            },
        }),
    ],

    resolve: {
        alias: { _: path.resolve(__dirname, 'src') },
        extensions: ['.js', '.jsx'],
    },

    module: {
        rules: [
            {
                test: /.jsx?/,
                use: {
                    loader: 'babel-loader',
                },
                exclude: /node_modules/,
            },

            {
                test: /\.scss$/,
                use: [
                    { loader: 'style-loader' },

                    {
                        loader: 'css-loader',

                        // 开启css Module功能，避免类名冲突问题
                        options: {
                            modules: true,
                            localIdentName: '[name]-[local]',
                        },
                    },

                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins() {
                                return [
                                    autoprefixer,
                                ]
                            },
                        },
                    },

                    {
                        loader: 'sass-loader',
                    },
                ],
            },

            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    { loader: 'css-loader' },
                ],
            },

            {
                test: /\.(png|jpg|jpeg|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10000,
                            name: './img/[name].[ext]',
                        },
                    },
                ],
            },

            {
                test: /\.(woff|woff2|svg|eot|ttf)\??.*$/,
                use: [
                    {
                        loader: 'url-loader?limit=30000&name=[name]-[hash].[ext]',
                    },
                ],
            },
        ],
    },

    devServer: {
        hot: true,
        inline: true,
        contentBase: './',
        historyApiFallback: true,
    },
}
