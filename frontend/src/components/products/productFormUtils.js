export const getCategoryId = (category) => {
  if (!category) return '';

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

export const buildProductPayload = (formData) => ({
  ...formData,
  category: typeof formData.category === 'string' ? formData.category.trim() : formData.category,
  buyingPrice: Number(formData.buyingPrice),
  sellingPrice: Number(formData.sellingPrice),
  reorderLevel: Number(formData.reorderLevel) || 10
});
