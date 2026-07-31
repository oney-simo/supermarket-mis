export const DEFAULT_LOW_STOCK_THRESHOLD = 5;

export function getInventoryStockStatus(item, now = new Date(), lowStockThreshold = null) {
  const quantity = Number(item?.quantity ?? item?.stockQuantity ?? 0) || 0;
  const threshold = Number(
    lowStockThreshold ?? item?.lowStockThreshold ?? item?.product?.lowStockThreshold ?? item?.product?.reorderLevel ?? item?.reorderLevel ?? DEFAULT_LOW_STOCK_THRESHOLD
  ) || DEFAULT_LOW_STOCK_THRESHOLD;

  if (item?.status === 'Damaged') {
    return 'Damaged';
  }

  if (item?.status === 'Reserved') {
    return 'Reserved';
  }

  const expiryDate = item?.expiryDate ? new Date(item.expiryDate) : null;
  const isExpired = Boolean(expiryDate && expiryDate < now && quantity > 0) || item?.status === 'Expired';

  if (isExpired) {
    return 'Expired';
  }

  if (quantity <= 0) {
    return 'Out of Stock';
  }

  if (quantity <= threshold) {
    return 'Low Stock';
  }

  return 'In Stock';
}
