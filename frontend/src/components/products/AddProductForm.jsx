import { useEffect, useState } from "react";
import api from "../../api/axios";
import Modal from "../common/Modal";
import { buildProductPayload, getCategoryId, getProductId, normalizeCategoriesResponse } from "./productFormUtils";

function AddProductForm({ productToEdit, onProductSaved, onCancel }) {
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
  const [notice, setNotice] = useState(null);

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

  const showNotice = (title, message, onConfirm) => {
    setNotice({ title, message, onConfirm });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = buildProductPayload(formData);

    if (!formData.name.trim()) {
      showNotice("Validation needed", "Please enter a product name.");
      return;
    }

    if (!formData.sku.trim()) {
      showNotice("Validation needed", "Please enter a SKU.");
      return;
    }

    if (!payload.category) {
      showNotice("Validation needed", "Please select a category before saving the product.");
      return;
    }

    if (!formData.buyingPrice || !formData.sellingPrice) {
      showNotice("Validation needed", "Please enter both buying and selling prices.");
      return;
    }

    try {
      if (productToEdit) {
        const productId = getProductId(productToEdit);

        if (!productId) {
          showNotice("Update failed", "Unable to update the product because its ID is missing.");
          return;
        }

        await api.put(`/products/${productId}`, payload);
        showNotice("Product updated", "The product was updated successfully.", () => onProductSaved?.());
      } else {
        await api.post("/products", payload);
        showNotice("Product added", "The product was added successfully.", () => onProductSaved?.());
      }
    } catch (error) {
      console.log("FULL ERROR:", error);
      showNotice("Operation failed", "The product could not be saved. Please try again.");
    }
  };

  return (
    <>
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

        <div className="product-form__actions">
          <button type="button" className="btn btn--blue" onClick={onCancel}>
            Back
          </button>
          <button type="button" className="btn btn--red" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn btn--green">
            {productToEdit ? "Update Product" : "Save Product"}
          </button>
        </div>
      </form>

      <Modal
        isOpen={Boolean(notice)}
        title={notice?.title}
        subtitle={notice?.message}
        onClose={() => {
          notice?.onConfirm?.();
          setNotice(null);
        }}
        footer={
          <button
            className="btn btn--blue"
            type="button"
            onClick={() => {
              notice?.onConfirm?.();
              setNotice(null);
            }}
          >
            Continue
          </button>
        }
      />
    </>
  );
}

export default AddProductForm;