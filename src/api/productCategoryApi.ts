import type { ProductCategory } from 'src/interfaces/product';

// src/api/categoryApi.ts
import { baseApi } from './baseApi';

export const productCategoryApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Get all categories
        getProductCategories: builder.query<{value:number, label:string}[], void>({
            query: () => '/product-category',
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ value }) => ({ type: 'Category' as const, id: value })),
                        { type: 'Category', id: 'LIST' },
                    ]
                    : [{ type: 'Category', id: 'LIST' }],
            transformResponse: (response: Array<{ id: number; name: string }>) =>
                response.map(category => ({
                    value: category.id,
                    label: category.name
                }))
        }),

        // Create new category
        createProductCategory: builder.mutation<ProductCategory, { name: string }>({
            query: (body) => ({
                url: '/product-category',
                method: 'POST',
                body,
            }),
            invalidatesTags: [{ type: 'Category', id: 'LIST' }],
        }),

        // Update category by ID
        updateProductCategory: builder.mutation<ProductCategory, { id: number; name: string }>({
            query: ({ id, ...body }) => ({
                url: `/product-category/${id}`,
                method: 'PATCH', // or 'PUT' depending on your API
                body,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Category', id },
                { type: 'Category', id: 'LIST' },
            ],
        }),

        // Delete category by ID
        deleteProductCategory: builder.mutation<void, number>({
            query: (id) => ({
                url: `/product-category/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'Category', id },
                { type: 'Category', id: 'LIST' },
            ],
        }),
    }),
});

// Export hooks for usage in components
export const {
    useGetProductCategoriesQuery,
    useCreateProductCategoryMutation,
    useUpdateProductCategoryMutation,
    useDeleteProductCategoryMutation,
} = productCategoryApi;