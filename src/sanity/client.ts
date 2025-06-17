import { createClient } from "@sanity/client";
import imageUrlBuilder from '@sanity/image-url';

export const sanityClient = createClient({
  projectId: "c0yyh9c8",
  dataset: "production",
  apiVersion: "2025-06-13",
  useCdn: false,
});

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
