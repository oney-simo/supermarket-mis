export const getCategoryId = (category) => {
  if (typeof category === 'string') {
    return category.trim();
  }

  if (!category || typeof category !== 'object') return '';

  if (typeof category._id === 'string' && category._id.trim()) {
    return category._id.trim();
  }

  if (typeof category.id === 'string' && category.id.trim()) {
    return category.id.trim();
  }

  if (category._id) {
    return String(category._id);
  }

  if (category.id) {
    return String(category.id);
  }

  return '';
};

export const getProductId = (product) => {
  if (typeof product === 'string') {
    return product.trim();
  }

  if (!product || typeof product !== 'object') return '';

  if (typeof product._id === 'string' && product._id.trim()) {
    return product._id.trim();
  }

  if (typeof product.id === 'string' && product.id.trim()) {
    return product.id.trim();
  }

  if (product._id) {
    return String(product._id);
  }

  if (product.id) {
    return String(product.id);
  }

  return '';
};

export const normalizeCategoriesResponse = (response) => {
  const payload = response?.data ?? response;

  if (Array.isArray(payload)) {
    return payload.map((category) => ({
      ...category,
      _id: getCategoryId(category)
    }));
  }

  const categories = payload?.categories ?? payload?.data ?? [];

  if (!Array.isArray(categories)) {
    return [];
  }

  return categories.map((category) => ({
    ...category,
    _id: getCategoryId(category)
  }));
};

export const buildProductPayload = (formData) => {
  const payload = {
    ...formData,
    category: getCategoryId(formData.category),
    buyingPrice: Number(formData.buyingPrice),
    sellingPrice: Number(formData.sellingPrice),
    reorderLevel: Number(formData.reorderLevel) || 10
  };

  if (typeof payload.name === 'string') {
    payload.name = payload.name.trim();
  }

  if (typeof payload.sku === 'string') {
    payload.sku = payload.sku.trim().toUpperCase();
  }

  if (typeof payload.barcode === 'string') {
    payload.barcode = payload.barcode.trim();
    if (!payload.barcode) {
      delete payload.barcode;
    }
  }

  if (typeof payload.description === 'string') {
    payload.description = payload.description.trim();
  }

  if (typeof payload.unit === 'string') {
    payload.unit = payload.unit.trim();
  }

  if (payload.category === '') {
    delete payload.category;
  }

  return payload;
};
