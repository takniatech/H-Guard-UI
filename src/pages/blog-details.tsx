import type { PortableTextComponents } from '@portabletext/react';

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PortableText } from '@portabletext/react';

import { Box, Link as MuiLink, Avatar, Container, Typography } from '@mui/material';

import { sanityClient, postBySlugQuery } from 'src/sanity/client';

export default function BlogDetailPage() {
    const { slug } = useParams();
    const [post, setPost] = useState<any>(null);

    useEffect(() => {
        if (slug) {
            sanityClient.fetch(postBySlugQuery, { slug }).then((res) => {
                setPost(res);
            });
        }
    }, [slug]);

    const components: PortableTextComponents = {
        types: {
            image: ({ value }) => (
                <Box
                    component="img"
                    src={value.asset.url}
                    alt=""
                    sx={{ width: '100%', borderRadius: 2, my: 3 }}
                />
            ),
            youTube: ({ value }) => {
                const url = value.url;
                const videoId = url.split('v=')[1]?.split('&')[0];
                return (
                    <Box sx={{ my: 3, position: 'relative', paddingTop: '56.25%' }}>
                        <Box
                            component="iframe"
                            src={`https://www.youtube.com/embed/${videoId}`}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                borderRadius: 2,
                            }}
                        />
                    </Box>
                );
            },
            code: ({ value }) => (
                <Box
                    component="pre"
                    sx={{
                        backgroundColor: '#e0e0e0',
                        color: 'common.white',
                        fontSize: 14,
                        px: 2,
                        py: 1.5,
                        borderRadius: 1,
                        overflowX: 'auto',
                        my: 3,
                    }}
                >
                    <code>{value.code}</code>
                </Box>
            ),
        },

        marks: {
            strong: ({ children }) => <strong>{children}</strong>,
            em: ({ children }) => <em>{children}</em>,
            code: ({ children }) => (
                <Box
                    component="code"
                    sx={{
                        backgroundColor: 'grey.100',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        fontFamily: 'monospace',
                    }}
                >
                    {children}
                </Box>
            ),
            link: ({ value, children }) => (
                <MuiLink href={value.href} target="_blank" rel="noopener noreferrer">
                    {children}
                </MuiLink>
            ),
        },

        block: {
            normal: ({ children }) => <Typography paragraph>{children}</Typography>,

            h1: ({ children }) => <Typography variant="h1" sx={{ my: 2 }}>{children}</Typography>,
            h2: ({ children }) => <Typography variant="h2" sx={{ my: 2 }}>{children}</Typography>,
            h3: ({ children }) => <Typography variant="h3" sx={{ my: 2 }}>{children}</Typography>,
            h4: ({ children }) => <Typography variant="h4" sx={{ my: 2 }}>{children}</Typography>,
            h5: ({ children }) => <Typography variant="h5" sx={{ my: 2 }}>{children}</Typography>,

            h6: ({ children }) => <Typography variant="h6" sx={{ fontWeight: 'bold', my: 2 }}>{children}</Typography>,

            blockquote: ({ children }) => (
                <Box
                    component="blockquote"
                    sx={{
                        borderLeft: 3,
                        borderColor: 'grey.500',
                        pl: 2,
                        my: 3,
                        fontStyle: 'italic',
                        color: 'text.secondary',
                    }}
                >
                    {children}
                </Box>
            ),
        },

        list: {
            bullet: ({ children }) => <ul style={{ paddingLeft: '1.5em', marginBottom: '1em' }}>{children}</ul>,
            number: ({ children }) => <ol style={{ paddingLeft: '1.5em', marginBottom: '1em' }}>{children}</ol>,
        },

        listItem: {
            bullet: ({ children }) => <li><Typography component="span">{children}</Typography></li>,
            number: ({ children }) => <li><Typography component="span">{children}</Typography></li>,
        },
    };

    if (!post) return <Typography>Loading...</Typography>;
    return (
        <Container maxWidth="md" sx={{ mt: 5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', mb: 2 }}>
                <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h3" gutterBottom>{post.title}</Typography>
                    <Typography variant="subtitle2" color="text.secondary">
                        {new Date(post.publishedAt).toLocaleDateString()} · {post.category?.title}
                    </Typography>
                </Box>

                {post.author && (
                    <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                        <Avatar src={post.author.imageUrl} sx={{ width: 40, height: 40, mr: 1 }} />
                        <Box>
                            <Typography variant="subtitle2">{post.author.name}</Typography>
                            <Typography variant="caption" color="text.secondary">{post.author.bio}</Typography>
                        </Box>
                    </Box>
                )}
            </Box>

            {post.coverImageUrl && (
                <Box
                    component="img"
                    src={post.coverImageUrl}
                    alt="Cover"
                    sx={{ width: '100%', borderRadius: 2, my: 3 }}
                />
            )}

            <PortableText value={post.body} components={components} />
        </Container>
    );
}
