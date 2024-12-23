"use server";

import { prisma } from "@/lib/prisma";
import { ProductResponse } from "./get";
import { uploadZipToFirebase } from "@/lib/firebase/firebase";
import { ProductType } from "@prisma/client";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB in bytes

interface CreateProductData {
  name: string;
  description?: string;
  sku: string;
  price: number;
  categoryId?: string;
  isActive?: boolean;
  fileUrl?: string;
  version: string;
  features: string[];
  previewUrl?: string;
  documentation?: string;
}

interface CreateProductResponse {
  success: boolean;
  data?: ProductResponse;
  error?: string;
}

export async function createProduct(formData: FormData): Promise<CreateProductResponse> {
  try {
    // Handle file upload
    const file = formData.get('file') as File | null;
    let fileUrl: string | undefined;

    if (!file) {
      return {
        success: false,
        error: "Theme file (ZIP) is required"
      };
    }

    if (!file.name.endsWith('.zip')) {
      return {
        success: false,
        error: "Only ZIP files are allowed"
      };
    }

    if (file.size > MAX_FILE_SIZE) {
      return {
        success: false,
        error: "File size exceeds 50MB limit"
      };
    }

    fileUrl = await uploadZipToFirebase(file);

    // Parse form data
    const data: CreateProductData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      sku: formData.get('sku') as string,
      price: Number(formData.get('price')),
      categoryId: formData.get('categoryId') as string || undefined,
      isActive: formData.get('isActive') === 'true',
      fileUrl,
      version: formData.get('version') as string,
      features: (formData.get('features') as string)
        .split(',')
        .map(f => f.trim())
        .filter(Boolean),
      previewUrl: formData.get('previewUrl') as string,
      documentation: formData.get('documentation') as string,
    };

    // Validate required fields
    if (!data.name || !data.sku || !data.price || !data.version) {
      return {
        success: false,
        error: "Missing required fields"
      };
    }

    // Check for existing SKU
    const existingProduct = await prisma.products.findUnique({
      where: { sku: data.sku },
    });

    if (existingProduct) {
      return {
        success: false,
        error: "Product with this SKU already exists"
      };
    }

    // Create product
    const product = await prisma.products.create({
      data: {
        ...data,
        type: ProductType.DIGITAL,
        inventory: 0,
        images: [],
      },
      select: {
        id: true,
        name: true,
        description: true,
        sku: true,
        price: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        isActive: true,
        type: true,
        fileUrl: true,
        version: true,
        features: true,
        previewUrl: true,
        documentation: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      success: true,
      data: {
        ...product,
        price: Number(product.price),
        images: [],
        inventory: 0,
        changelog: null,
        requirements: null,
      },
    };
  } catch (error) {
    console.error("Error creating product:", error);
    return {
      success: false,
      error: "Something went wrong while creating the product"
    };
  }
} 