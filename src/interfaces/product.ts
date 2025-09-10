export interface Product {
    id: number;
    name: string;
    nameAr: string;
    description: string;
    image: string;
    imageUrl?: string;
    medicineFamily: string;
    price: number;
    categoryId: number;
    createdAt: string;
    updatedAt: string;
}

export interface ProductResponse extends Product {
    category: {
        id: number;
        name: string;
    };
}

export interface ProductCreateRequest {
    name: string;
    description: string;
    price: number;
    categoryId: number;
    image: string;
}

export interface ProductCategory {
    id: number,
    name: string
}