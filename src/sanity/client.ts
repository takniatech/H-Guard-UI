import { createClient } from "@sanity/client";
import imageUrlBuilder from '@sanity/image-url';

export const sanityClient = createClient({
  projectId: "c0yyh9c8",
  dataset: "production",
  apiVersion: "2025-06-13",
  useCdn: false,
  token:"skwpBDcrq3QdpWLuI0PlaSm8X3pD9vZ2apqE0amgnDB22VLwx3b4fNVmcVyZcLtG5zYZlqJTsH6C5GS4SwXP3DTouPTt5HsVxZEOcly6IqbgKk6sZu0G0c1jrZbsCoJvl3ecPlRkwXcXArGZDgELlDIk4Ldr9BFvKXY3qYdUj5LOxxiTz42q"
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
