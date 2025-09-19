import { createClient } from "@sanity/client";
import imageUrlBuilder from '@sanity/image-url';

export const sanityClient = createClient({
  projectId: "jlu7alw9",
  dataset: "production",
  apiVersion: "2025-06-25",
  useCdn: true,
  token:"skP8aqr2RAA3kndlSR804ZAYWAwkpo0iQ1OPcX3JDLfLdM41ohIen8kCwKBo4PvOZjhT5eLRibfEVADnnVWrj38KlW0Wz1PDLAdLC5YrfBbbLTC3PDC5j9kHz3w4c2qvC5OE63Wt0XuVMaUO6TeyMwh5M8buc2uwhyhL3rl2NsX6Bzq2h7Rm"
});

// Upload image
export async function uploadImage(file: File) {
  const asset = await sanityClient.assets.upload('image', file, {
    filename: file.name,
  });

  return asset.url; // Direct CDN URL to image
}

// Create the builder
const builder = imageUrlBuilder(sanityClient);

// Helper to generate URLs from image objects
export function urlFor(source: any) {
  return builder.image(source);
}


export const postQuery = `*[_type == "blogPost"]{
  ...,
  "coverImage": coverImage.asset->url,
   "category": category->{
    title,
    "slug": slug.current
  },
  "author": author->{
    name,
    bio,
    "imageUrl": image.asset->url
  },
  body[]{
    ...,
    // for image blocks
    _type == "image" => {
      ...,
      "asset": asset->{_id, url}
    },
  }
}`;

export const postsByCateogry = `*[_type == "blogPost" && category->slug.current == "first-aids"]{
  ...,
  "coverImage": coverImage.asset->url,
   "category": category->{
    title,
    "slug": slug.current
  },
  "author": author->{
    name,
    bio,
    "imageUrl": image.asset->url
  },
  body[]{
    ...,
    // for image blocks
    _type == "image" => {
      ...,
      "asset": asset->{_id, url}
    },
  }
}`;

export const postBySlugQuery = `
*[
  _type == "blogPost" &&
  slug.current == $slug
][0]{
  _id,
  title,
  publishedAt,
  "coverImageUrl": coverImage.asset->url,
   body[]{
    ...,
    // for image blocks
    _type == "image" => {
      ...,
      "asset": asset->{_id, url}
    },
  },
  "author": author->{
    name,
    bio,
    "imageUrl": image.asset->url
  },
  "category": category->{
    title,
    "slug": slug.current
  }
}
`;

export const allCategories = `*[_type == "category"] {
    _id,
    title,
    "slug": slug.current
}`;
