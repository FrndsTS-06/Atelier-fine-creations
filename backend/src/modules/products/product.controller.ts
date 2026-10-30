import { Request, Response } from 'express';
import { productService } from './product.service.js';
import { AuthenticatedRequest } from '../../middleware/authenticate.js';

export async function listProducts(req: Request, res: Response) {
  try {
    const result = await productService.getProducts(req.query);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { code: 'PRODUCT_FETCH_FAILED', message: error.message },
    });
  }
}

export async function getProduct(req: Request, res: Response) {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: { code: 'PRODUCT_NOT_FOUND', message: 'Requested jewel not found in catalog.' },
      });
    }
    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { code: 'PRODUCT_GET_FAILED', message: error.message },
    });
  }
}

export async function createProduct(req: AuthenticatedRequest, res: Response) {
  try {
    const product = await productService.createProduct(req.body, req.user?.id);
    res.status(201).json({
      success: true,
      data: product,
      message: 'Masterpiece registered successfully in boutique catalog.',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { code: 'PRODUCT_CREATION_FAILED', message: error.message },
    });
  }
}

export async function updateProduct(req: AuthenticatedRequest, res: Response) {
  try {
    const product = await productService.updateProduct(req.params.id, req.body);
    res.status(200).json({
      success: true,
      data: product,
      message: 'Product specifications updated successfully.',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { code: 'PRODUCT_UPDATE_FAILED', message: error.message },
    });
  }
}

export async function deleteProduct(req: AuthenticatedRequest, res: Response) {
  try {
    await productService.deleteProduct(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Product decommissioned from catalog.',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { code: 'PRODUCT_DELETE_FAILED', message: error.message },
    });
  }
}
