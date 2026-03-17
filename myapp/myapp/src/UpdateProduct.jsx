import { useState } from "react";

function UpdateProduct() {

  const [product, setProduct] = useState({
    productid: "",
    name: "",
    description: "",
    price: "",
    quantity: ""
  });


  const handleChange = (e) => {
    setProduct(
             { ...product,
             [e.target.name]: e.target.value
               // productid: 101
               // name : hp laptop
               //description :  hp laptop with some extra features
             }
            );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`http://localhost:8082/product/${product.productid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(product)
    })
    .then(res => res.json())
    .then(data => {
      console.log("Updated:", data);
      alert("Product Updated Successfully");
    })
    .catch(err => console.error("Error:", err));
  };

  return (
    <div>
      <h2>Update Product</h2>

      <form onSubmit={handleSubmit}>
        <input name="productid" placeholder="ID" onChange={handleChange} />
        <input name="name" placeholder="Name" onChange={handleChange} />
        <input name="description" placeholder="Description" onChange={handleChange} />
        <input name="price" placeholder="Price" onChange={handleChange} />
        <input name="quantity" placeholder="Quantity" onChange={handleChange} />

        <button type="submit">Update Product</button>
      </form>
    </div>
  );
}

export default UpdateProduct;
