import { createClient } from "@sanity/client";
import imageUrlBuilder from '@sanity/image-url';

export const sanityClient = createClient({
  projectId: "jlu7alw9",
  dataset: "production",
  apiVersion: "2025-06-25",
  useCdn: false,
  token:"skjuVM8CymX5vX6f2l1VuzsqfOX1THvSjesPlQCvFdTkyyoaynUK72rRO7pwkvxV7nyzYDBwSnDwDgSzmZD9jYgUdq46INHiN6GVoHRSPFVRQhrVjxohs3vXy2ZKVVTUJ8D9AU9FVqT5ICQBFjzZWJGH9rnnSwQFYi0xufnmMLAPeQU3D1Ea"
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
