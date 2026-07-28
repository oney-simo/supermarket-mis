import { useEffect, useState } from "react";
import api from "../../api/axios";
import { buildProductPayload, getCategoryId, getProductId, normalizeCategoriesResponse } from "./productFormUtils";

function AddProductForm({ productToEdit, onProductSaved }) {
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "",
    buyingPrice: "",
    sellingPrice: "",
    barcode: "",
    unit: "Piece",
    reorderLevel: 10,
    description: ""
  });
  const [categories, setCategories] = useState([]);

  // Populate form if we are editing an existing product
  useEffect(() => {
    if (productToEdit) {
      setFormData({
        name: productToEdit.name || "",
        sku: productToEdit.sku || "",
        category: getCategoryId(productToEdit.category) || "",
        buyingPrice: productToEdit.buyingPrice || "",
        sellingPrice: productToEdit.sellingPrice || "",
        barcode: productToEdit.barcode || "",
        unit: productToEdit.unit || "Piece",
        reorderLevel: productToEdit.reorderLevel || 10,
        description: productToEdit.description || ""
      });
    }
  }, [productToEdit]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/categories");
        setCategories(normalizeCategoriesResponse(response));
      } catch (error) {
        console.log(error);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = buildProductPayload(formData);

    if (!formData.name.trim()) {
      alert("Please enter a product name.");
      return;
    }

    if (!formData.sku.trim()) {
      alert("Please enter a SKU.");
      return;
    }

    if (!payload.category) {
      alert("Please select a category before saving the product.");
      return;
    }

    if (!formData.buyingPrice || !formData.sellingPrice) {
      alert("Please enter both buying and selling prices.");
      return;
    }

    try {
      if (productToEdit) {
        const productId = getProductId(productToEdit);

        if (!productId) {
          alert("Unable to update the product because its ID is missing.");
          return;
        }

        // Update existing product
        await api.put(`/products/${productId}`, payload);
        alert("Product updated successfully");
      } else {
        // Create new product
        await api.post("/products", payload);
        alert("Product added successfully");
      }

      onProductSaved?.();
    } catch (error) {
      console.log("FULL ERROR:", error);
      alert("Operation failed. Check the browser console.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="product-form">
      <h2>{productToEdit ? "Edit Product" : "Add New Product"}</h2>

      <input
        name="name"
        placeholder="Product name"
        value={formData.name}
        onChange={handleChange}
      />

      <input
        name="sku"
        placeholder="SKU"
        value={formData.sku}
        onChange={handleChange}
      />

      <select
        name="category"
        value={formData.category}
        onChange={handleChange}
      >
        <option value="">Select Category</option>
        {categories.map((category) => {
          const categoryId = getCategoryId(category);
          if (!categoryId) return null;
          return (
            <option key={categoryId} value={categoryId}>
              {category.name}
            </option>
          );
        })}
      </select>

      <select
        name="unit"
        value={formData.unit}
        onChange={handleChange}
      >
        <option value="Piece">Piece</option>
        <option value="Bottle">Bottle</option>
        <option value="Carton">Carton</option>
        <option value="Box">Box</option>
      </select>

      <input
        name="sellingPrice"
        placeholder="Selling price"
        value={formData.sellingPrice}
        onChange={handleChange}
      />

      <input
        name="buyingPrice"
        placeholder="Buying price"
        value={formData.buyingPrice}
        onChange={handleChange}
      />

      <input
        name="barcode"
        placeholder="Barcode"
        value={formData.barcode}
        onChange={handleChange}
      />

      <input
        name="reorderLevel"
        placeholder="Reorder level"
        value={formData.reorderLevel}
        onChange={handleChange}
      />

      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
      />

      <button type="submit">
        {productToEdit ? "Update Product" : "Save Product"}
      </button>
    </form>
  );
}

export default AddProductForm;