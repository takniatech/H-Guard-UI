import type { ProductResponse, ProductCreateRequest } from 'src/interfaces/product';

import { baseApi } from './baseApi';

export const productApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    // Get all products
    getProducts: builder.query<ProductResponse[], void>({
      query: () => '/products',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Product' as const, id })),
              { type: 'Product', id: 'LIST' },
            ]
          : [{ type: 'Product', id: 'LIST' }],
    }),

    // Get product by ID
    getProductById: builder.query<ProductResponse, number>({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),

    // Get products by category ID
    getProductsByCategory: builder.query<ProductResponse[], number>({
      query: (categoryId) => `/products/category/${categoryId}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Product' as const, id })),
              { type: 'Product', id: 'CATEGORY_LIST' },
            ]
          : [{ type: 'Product', id: 'CATEGORY_LIST' }],
    }),

    // Create new product
    createProduct: builder.mutation<ProductResponse, ProductCreateRequest>({
      query: (product) => ({
        url: '/products',
        method: 'POST',
        body: product,
      }),
      invalidatesTags: [{ type: 'Product', id: 'LIST' }, { type: 'Product', id: 'CATEGORY_LIST' }],
    }),

    // Update product
    updateProduct: builder.mutation<ProductResponse, { id: number; data: Partial<ProductCreateRequest> }>({
      query: ({ id, data }) => ({
        url: `/products/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Product', id },
        { type: 'Product', id: 'LIST' },
        { type: 'Product', id: 'CATEGORY_LIST' },
      ],
    }),

    // Delete product
    deleteProduct: builder.mutation<void, number>({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Product', id },
        { type: 'Product', id: 'LIST' },
        { type: 'Product', id: 'CATEGORY_LIST' },
      ],
    }),
  }),
  overrideExisting: false,
});

// Export hooks for usage in components
export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetProductsByCategoryQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;