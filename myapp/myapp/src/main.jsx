import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';

import TodoList from './TodoList.jsx';
import App from './App.jsx';
import Login from './Login.jsx';
import AddProduct from './AddProduct.jsx';
import SearchProduct from './SearchProduct.jsx';
import UpdateProduct from './UpdateProduct.jsx';
import Demo from './Demo.jsx';
import Greeting from './Greeting.jsx';
import MyHoc from './GreetingWithBorders.jsx';

const person = {
  name: "Gireesh",
  occupation: "Software"
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Greeting person={person} />
    <MyHoc person={person} />
  </StrictMode>
);