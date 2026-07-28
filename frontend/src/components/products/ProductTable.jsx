import ProductRow from "./ProductRow";

function ProductTable({ products, onDelete, onEdit }) {
  return (
    <table className="product-table">

      <thead>
        <tr>
          <th>SKU</th>
          <th>Name</th>
          <th>Category</th>
          <th>Price</th>
          <th>Stock</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>

        {products.length === 0 ? (

          <tr>
            <td colSpan="6">
              No products found
            </td>
          </tr>

        ) : (

         products.map((product) => (
            <ProductRow
              key={product._id}
              product={product}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))

        )}

      </tbody>

    </table>
  );
}

export default ProductTable;