export default {
    root: 'src',
    base: './',
    publicDir: '../public',
    build: {
        outDir: '../dist',
        rollupOptions: {
            input: {
                index: './src/index.html',
                game: './src/game.html',
                training: './src/training.html',
            },
            output: {
                assetFileNames: "assets/[name][extname]",
                entryFileNames: "js/[name].js",
            }
        },
        minify: false
    },
    css: {
        devSourcemap: true
    }
}