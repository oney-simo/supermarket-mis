import axiosInstance from './axios';

// Get all inventory items
export const fetchInventory = async () => {
    try {
        const response = await axiosInstance.get('/inventory');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch inventory' };
    }
};

// Get inventory by product ID
export const fetchInventoryByProduct = async (productId) => {
    try {
        const response = await axiosInstance.get(`/inventory/product/${productId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch inventory for this product' };
    }
};

// Get expiring products
export const fetchExpiringProducts = async () => {
    try {
        const response = await axiosInstance.get('/inventory/expiry');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch expiring products' };
    }
};