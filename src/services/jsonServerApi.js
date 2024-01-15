import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const jsonServerApi = createApi({
  reducerPath: 'jsonServerApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://dummyjson.com/' }),
  tagTypes: ['Posts'],
  endpoints: (builder) => ({
    getAlbums: builder.query({
      query: (page = 1) => `products?total=${page}&limit=150`,
      providesTags: ['Posts'],
    }),
//create
    createAlbum: builder.mutation({
      query: (title) => ({
        
        url: `products/add`,
        method: 'POST',
        body: { title },
      }),
      invalidatesTags: ['Posts'],
    }),
//update
updateAlbum: builder.mutation({
  query: ({ id, title }) => ({
    url: `products/${id}`,
    method: 'PUT',
    body: { title },
  }),
  invalidatesTags: ['Posts'],
}),

//delete
deleteAlbum: builder.mutation({
  query: (id) => ({
    url: `products/${id}`,
    method: 'DELETE',
  }),
  invalidatesTags: ['Posts'],
}),
  }),
});

export const { useGetAlbumsQuery, useCreateAlbumMutation, useUpdateAlbumMutation, useDeleteAlbumMutation } = jsonServerApi;