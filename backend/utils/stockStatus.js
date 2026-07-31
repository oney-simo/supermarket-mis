const DEFAULT_LOW_STOCK_THRESHOLD = 5;

function resolveLowStockThreshold(item, thresholdOverride = null) {
  const candidates = [
    thresholdOverride,
    item?.lowStockThreshold,
    item?.product?.lowStockThreshold,
    item?.product?.reorderLevel,
    item?.reorderLevel,
    DEFAULT_LOW_STOCK_THRESHOLD
  ];

  for (const candidate of candidates) {
    const numericValue = Number(candidate);
    if (Number.isFinite(numericValue) && numericValue >= 0) {
      return numericValue;
    }
  }

  return DEFAULT_LOW_STOCK_THRESHOLD;
}

function getInventoryStockStatus(item, now = new Date(), lowStockThreshold = null) {
  const quantity = Number(item?.quantity ?? item?.stockQuantity ?? 0) || 0;
  const threshold = resolveLowStockThreshold(item, lowStockThreshold);

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

module.exports = {
  DEFAULT_LOW_STOCK_THRESHOLD,
  getInventoryStockStatus
};
