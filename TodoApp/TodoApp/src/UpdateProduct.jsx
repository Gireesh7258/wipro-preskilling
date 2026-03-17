import { useState, useEffect } from "react";
import axios from "axios";

function SearchProduct() {

  const [search, setSearch] = useState("");
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {

    if (search.trim() === "") {
      setProduct(null);
      return;
    }

    const fetchProduct = async () => {
      try {
        setLoading(true);

        // If number → search by id
        if (!isNaN(search)) {
          const response = await axios.get(
            `http://localhost:8082/product/${search}`
          );
          setProduct(response.data);
        } 
        // Else search by name
        else {
          const response = await axios.get(
            `http://localhost:8082/productss/search?name=${search}`
          );
          setProduct(response.data);
        }

      } catch (error) {
        console.log("Error fetching product:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();

  }, [search]);   // 👈 runs when search value changes

  return (
    <div>
      <h2>Search Product</h2>

      <input
        type="text"
        placeholder="Enter Product ID or Name"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading && <p>Loading...</p>}

      {product && (
        <div>
          <h3>Product Details</h3>
          <p>ID: {product.productid}</p>
          <p>Name: {product.name}</p>
          <p>Description: {product.description}</p>
          <p>Price: ₹{product.price}</p>
          <p>Quantity: {product.quantity}</p>
        </div>
      )}
    </div>
  );
}

export default SearchProduct;










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
        <input name="name" placeholder="Name" onChange={handleSubmit} />
        <input name="description" placeholder="Description" onChange={handleChange} />
        <input name="price" placeholder="Price" onChange={handleChange} />
        <input name="quantity" placeholder="Quantity" onChange={handleChange} />

        <button type="submit">Update Product</button>
      </form>
    </div>
  );
}

export default UpdateProduct;


