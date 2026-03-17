import { useState } from "react";
import axios from "axios";

function AddProduct() {

    const [productid, setProductId] = useState();
   // const [name, setName] = useState("");
    // const [description, setDescription] = useState("");
    // const [price, setPrice] = useState();
    // const [quantity, setQuantity] = useState();
    const [product, setProduct] = useState(null);

    const handleSubmit =  async  (event) => {
        event.preventDefault();

        // const product = {
        //     productid: productid,
        //     name: name,
        //     description: description,
        //     price: price,
        //     quantity: quantity
        // };

        try {
            const response =  await axios.get(`http://localhost:8082/product/${productid}`); // 5 sec
            console.log("Product Saved:", response.data); // undefined ??? async await
            setProduct(response.data);

        } catch (error) {
            console.error("Error saving product:", error);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="number"
                    value={productid}
                    onChange={(e) => setProductId(Number(e.target.value))}
                    placeholder="Enter product id"
                    required
                />

                {/* <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter product name"
                    required
                /> */}

                {/* <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter product description"
                    required
                /> */}

                {/* <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    placeholder="Enter product price"
                    required
                /> */}

                {/* <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    placeholder="Enter product quantity"
                    required
                /> */}

                <button type="submit">search Product</button>
            </form>
            {product && (
            <div style={{ marginTop: "10px", border: "1px solid black", padding: "10px" }}>
                <p><b>ID:</b> {product.productid}</p>
                <p><b>Name:</b> {product.name}</p>
                <p><b>Description:</b> {product.description}</p>
                <p><b>Price:</b> {product.price}</p>
                <p><b>Quantity:</b> {product.quantity}</p>
            </div>
        )}
        </div>
    );
}

export default AddProduct;
