module.exports = {
    mode: 'development',
    devtool: 'inline-source-map',
    entry: './src/tensor.ts',
    watch: true,
    output: {
        path: __dirname ,
        filename: 'build/tensor.js'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'expose-loader',
                        options: 'Tensor'
                    },
                    {
                        loader: 'ts-loader'
                    }
                ]
            }
        ]
    }
}