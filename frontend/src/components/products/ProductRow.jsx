function ProductRow({ product }) {
  return (
    <tr>

      <td>{product.sku}</td>

      <td>{product.name}</td>

      <td>{product.category?.name}</td>

      <td>{product.sellingPrice}</td>

      <td>{product.stockQuantity}</td>

      <td>
        <button>Edit</button>

        <button>Delete</button>
      </td>

    </tr>
  );
}

export default ProductRow;