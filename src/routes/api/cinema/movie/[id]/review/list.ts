import type {RequestHandler} from "@sveltejs/kit";
import {Movie} from "$db/movie/Movie";
import fs from "fs";
import {client} from "$db";

// @ts-ignore
export const get: RequestHandler = async ({ params }) => {
    let img = new Uint8Array(fs.readFileSync("/home/marcin/Projects/WebstormProjects/FluentCinema/static/images/StarWars8/Star-Wars-The-Last-Jedi.jpg"));
    await client.query('UPDATE movies SET "bannerImage"=$1 WHERE name=\'Star Wars\'', [img]);
    return {
        status: 200,
        body: await (await Movie.getFromId(parseInt(params.id))).getReviews()
    }
}