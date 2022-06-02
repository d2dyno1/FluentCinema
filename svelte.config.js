import path from 'path';
import adapter from '@sveltejs/adapter-node';
import preprocess from 'svelte-preprocess';
import * as fs from "fs";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
            vite: {
                    resolve: {
                            alias: {
                                "$": path.resolve("./src"),
                                $static: path.resolve("./static"),
                                $lib: path.resolve("./src/lib"),
                                $layout: path.resolve("./src/layout"),
                                $data: path.resolve("./src/data"),
                                $db: path.resolve("./src/db"),
                                $api: path.resolve("./src/api"),
                            }
                    },
                    server: {
                            fs: {
                                allow: ['static'],
                            },
                            https: {
                                // key: fs.readFileSync('/path/to/key'),
                                // cert: fs.readFileSync('/path/to/cert.pem')
                            }
                    },
            },
		adapter: adapter()
	}
};

export default config;
