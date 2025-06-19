import type { RootState } from 'src/store';
import type { PayloadAction } from '@reduxjs/toolkit';

import { createSlice } from '@reduxjs/toolkit';

import type { ProductResponse } from '../../interfaces/product';

interface ProductState {
  allProducts: ProductResponse[];
  filteredProducts: ProductResponse[];
  filters: {
    categoryId: number | null;
    searchQuery: string;
    minPrice: number | null;
    maxPrice: number | null;
  };
  sortOption: 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';
}

const initialState: ProductState = {
  allProducts: [],
  filteredProducts: [],
  filters: {
    categoryId: null,
    searchQuery: '',
    minPrice: null,
    maxPrice: null,
  },
  sortOption: 'name-asc',
};

export const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<ProductResponse[]>) => {
      state.allProducts = action.payload;
      state.filteredProducts = action.payload;
    },
    applyFilters: (state) => {
      state.filteredProducts = state.allProducts.filter(product => {
        const matchesCategory = !state.filters.categoryId || 
                              product.categoryId === state.filters.categoryId;
        const matchesSearch = product.name.toLowerCase().includes(state.filters.searchQuery.toLowerCase()) ||
                            product.description.toLowerCase().includes(state.filters.searchQuery.toLowerCase());
        const matchesPrice = (!state.filters.minPrice || product.price >= state.filters.minPrice) &&
                           (!state.filters.maxPrice || product.price <= state.filters.maxPrice);
        return matchesCategory && matchesSearch && matchesPrice;
      });
    },
    setCategoryFilter: (state, action: PayloadAction<number | null>) => {
      state.filters.categoryId = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.filters.searchQuery = action.payload;
    },
    setPriceRange: (state, action: PayloadAction<{min: number | null; max: number | null}>) => {
      state.filters.minPrice = action.payload.min;
      state.filters.maxPrice = action.payload.max;
    },
    sortProducts: (state, action: PayloadAction<ProductState['sortOption']>) => {
      state.sortOption = action.payload;
      state.filteredProducts.sort((a, b) => {
        switch(action.payload) {
          case 'price-asc': return a.price - b.price;
          case 'price-desc': return b.price - a.price;
          case 'name-asc': return a.name.localeCompare(b.name);
          case 'name-desc': return b.name.localeCompare(a.name);
          default: return 0;
        }
      });
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
      state.filteredProducts = state.allProducts;
    }
  },
});

// Action creators
export const {
  setProducts,
  applyFilters,
  setCategoryFilter,
  setSearchQuery,
  setPriceRange,
  sortProducts,
  resetFilters,
} = productSlice.actions;

// Selectors
export const selectAllProducts = (state: RootState) => state.products.allProducts;
export const selectFilteredProducts = (state: RootState) => state.products.filteredProducts;
export const selectProductFilters = (state: RootState) => state.products.filters;
export const selectSortOption = (state: RootState) => state.products.sortOption;

export default productSlice.reducer;