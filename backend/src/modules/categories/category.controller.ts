import { Request, Response } from 'express';
import { categoryService } from './category.service.js';

export async function listCategories(req: Request, res: Response) {
  try {
    const categories = await categoryService.getAllCategories();
    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { code: 'CATEGORIES_FETCH_FAILED', message: error.message },
    });
  }
}

export async function getCategory(req: Request, res: Response) {
  try {
    const category = await categoryService.getCategoryBySlug(req.params.slug);
    if (!category) {
      return res.status(404).json({
        success: false,
        error: { code: 'CATEGORY_NOT_FOUND', message: 'Category not found.' },
      });
    }
    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { code: 'CATEGORY_GET_FAILED', message: error.message },
    });
  }
}

export async function createCategory(req: Request, res: Response) {
  try {
    const category = await categoryService.createCategory(req.body);
    res.status(201).json({
      success: true,
      data: category,
      message: 'New jewelry collection category registered.',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { code: 'CATEGORY_CREATION_FAILED', message: error.message },
    });
  }
}

export async function updateCategory(req: Request, res: Response) {
  try {
    const category = await categoryService.updateCategory(req.params.id, req.body);
    res.status(200).json({
      success: true,
      data: category,
      message: 'Category updated successfully.',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { code: 'CATEGORY_UPDATE_FAILED', message: error.message },
    });
  }
}

export async function deleteCategory(req: Request, res: Response) {
  try {
    await categoryService.deleteCategory(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Category removed successfully.',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { code: 'CATEGORY_DELETION_FAILED', message: error.message },
    });
  }
}
