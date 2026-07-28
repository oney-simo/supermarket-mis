function ProductRow({ product, onDelete, onEdit }) {
  return (
    <tr>

      <td>{product.sku}</td>

      <td>{product.name}</td>

      <td>{product.category?.name}</td>

      <td>{product.sellingPrice}</td>

      <td>{product.stockQuantity}</td>

      <td>
        <button onClick={() => onEdit(product)}>Edit</button>

        <button onClick={() => onDelete(product._id)}>Delete</button>
      </td>

    </tr>
  );
}

export default ProductRow;