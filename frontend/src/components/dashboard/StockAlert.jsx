function StockAlert({ products }) {

  return (
    <div className="stock-alert">

      <h2>
        ⚠ Low Stock Products
      </h2>


      {products.length === 0 ? (

        <p>
          No low stock products
        </p>

      ) : (

        products.map((product) => (

          <div key={product._id}>

            <h3>
              📦 {product.name}
            </h3>

            <p>
              Current Stock: {product.stockQuantity}
            </p>

            <p>
              Reorder Level: {product.reorderLevel}
            </p>

          </div>

        ))

      )}

    </div>
  );

}


export default StockAlert;