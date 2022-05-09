import path from 'path';
import adapter from '@sveltejs/adapter-node';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
            vite: {
                    resolve: {
                            alias: {
                                $static: path.resolve("./static"),
                                $lib: path.resolve("./src/lib"),
                                $layout: path.resolve("./src/layout"),
                                $data: path.resolve("./src/data")
                            }
                    },
                    server: {
                            fs: {
                                allow: ['static'],
                            },
                    },
            },
		adapter: adapter()
	}
};

export default config;
