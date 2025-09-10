import { useState, useEffect } from 'react';

import { CONFIG } from 'src/config-global';
import { postQuery, sanityClient } from 'src/sanity/client';

import { BlogView } from 'src/sections/blog/view';



// ----------------------------------------------------------------------

export default function Page() {

  const [posts, setPost] = useState<any>([]);
  useEffect(() => {
      sanityClient
        .fetch(postQuery)
        .then((data:any) => {
          console.log("sanity data", data[0].title)
          // console.log("sanity data", data[0].coverImage.asset.url)
          setPost(data)
        })
        .catch(console.error);
    }, []);

  return (
    <>
      <title>{`Blog - ${CONFIG.appName}`}</title>

      <BlogView posts={posts} />
    </>
  );
}
