import api from "./axios";

export const getProducts = () => {
    return api.get("/products");
};