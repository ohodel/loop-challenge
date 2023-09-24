import parseLinkHeader from 'parse-link-header';
import dotenv from 'dotenv';
dotenv.config();

export default async function fetchShopify(url) {
  try {
    let raw = await fetch(url, {
      headers: {
        Authorization: 'Basic ' + btoa(process.env.btoa),
      },
    });
    let data = await raw.json();

    let linkHeaders = raw.headers.get('Link');
    const links = parseLinkHeader(linkHeaders);

    return { data, links };
  } catch (err) {
    console.log(err);
  }
}
