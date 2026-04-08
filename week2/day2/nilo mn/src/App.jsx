import { useState } from 'react';
import './App.css';

// ========== TASK 1: Counter Component ==========
function Counter() {
  const [count, setCount] = useState(0);
  
  const increment = () => {
    setCount(count + 1);
  };
  
  const decrement = () => {
    // Do not let the count go below 0
    if (count > 0) {
      setCount(count - 1);
    }
  };
  
  const reset = () => {
    setCount(0);
  };
  
  return (
    <div className="counter-container">
      <h3>Counter Component</h3>
      <div className="counter-display">{count}</div>
      <div className="counter-buttons">
        <button onClick={decrement} disabled={count === 0}>−</button>
        <button onClick={increment}>+</button>
        <button onClick={reset}>Reset</button>
      </div>
    </div>
  );
}

// ========== TASK 1: ToggleCard Component ==========
function ToggleCard() {
  const [isVisible, setIsVisible] = useState(true);
  
  const toggleContent = () => {
    setIsVisible(!isVisible);
  };
  
  return (
    <div className="toggle-container">
      <h3>ToggleCard Component</h3>
      <button onClick={toggleContent}>
        {isVisible ? 'Hide Content' : 'Show Content'}
      </button>
      {isVisible && (
        <div className="toggle-content">
          <p>This is the hidden content! 🎉</p>
          <p>You can show or hide me by clicking the button above.</p>
        </div>
      )}
    </div>
  );
}

// ========== TASK 1: ColorPicker Component ==========
function ColorPicker() {
  const [selectedColor, setSelectedColor] = useState('#667eea');
  
  const colors = [
    { name: 'Purple', value: '#667eea' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Green', value: '#10b981' },
    { name: 'Orange', value: '#f59e0b' }
  ];
  
  return (
    <div className="colorpicker-container">
      <h3>ColorPicker Component</h3>
      <div className="color-buttons">
        {colors.map((color, index) => (
          <button
            key={index}
            className="color-btn"
            style={{ backgroundColor: color.value }}
            onClick={() => setSelectedColor(color.value)}
          >
            {color.name}
          </button>
        ))}
      </div>
      <div 
        className="color-preview"
        style={{ backgroundColor: selectedColor }}
      >
        <p>Preview Box</p>
        <p className="color-code">{selectedColor}</p>
      </div>
    </div>
  );
}

// ========== TASK 2: CartSummary Component ==========
function CartSummary({ totalItems }) {
  return (
    <div className="cart-summary">
      <h3>🛒 Cart Summary</h3>
      <div className="cart-count">
        <span className="cart-icon">🛍️</span>
        <span className="cart-number">{totalItems}</span>
      </div>
      <p>Total items in cart: <strong>{totalItems}</strong></p>
      {totalItems === 0 && <p className="empty-cart">Your cart is empty</p>}
      {totalItems > 0 && (
        <button className="checkout-btn">Proceed to Checkout</button>
      )}
    </div>
  );
}

// ========== TASK 2: ProductCard Component (Child) ==========
function ProductCard({ product, onAddToCart }) {
  const { id, name, price, image, description } = product;
  
  return (
    <div className="product-card">
      <div className="product-image">
        <span className="product-emoji">{image}</span>
      </div>
      <div className="product-info">
        <h4>{name}</h4>
        <p className="product-description">{description}</p>
        <div className="product-price">${price}</div>
        <button 
          className="add-to-cart-btn"
          onClick={() => onAddToCart(id, name, price)}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

// ========== TASK 2: ShoppingCart Parent Component ==========
function ShoppingCart() {
  // Lift cart state to parent
  const [cartItems, setCartItems] = useState([]);
  
  // Handler function passed down to ProductCard
  const addToCart = (productId, productName, productPrice) => {
    setCartItems(prevItems => {
      // Check if product already exists in cart
      const existingItem = prevItems.find(item => item.id === productId);
      
      if (existingItem) {
        // If exists, increase quantity
        return prevItems.map(item =>
          item.id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // If new item, add with quantity 1
        return [...prevItems, {
          id: productId,
          name: productName,
          price: productPrice,
          quantity: 1
        }];
      }
    });
  };
  
  // Products data
  const products = [
    {
      id: 1,
      name: 'Wireless Headphones',
      price: 99.99,
      image: '🎧',
      description: 'High-quality sound with noise cancellation'
    },
    {
      id: 2,
      name: 'Smart Watch',
      price: 199.99,
      image: '⌚',
      description: 'Track your fitness and stay connected'
    },
    {
      id: 3,
      name: 'Laptop Backpack',
      price: 49.99,
      image: '🎒',
      description: 'Water-resistant with laptop compartment'
    },
    {
      id: 4,
      name: 'USB-C Hub',
      price: 39.99,
      image: '🔌',
      description: '7-in-1 multiport adapter'
    }
  ];
  
  // Calculate total items in cart
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  
  return (
    <div className="shopping-cart">
      <div className="products-section">
        <h3>📦 Products</h3>
        <div className="products-grid">
          {products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={addToCart}
            />
          ))}
        </div>
      </div>
      <div className="cart-section">
        <CartSummary totalItems={totalItems} />
        {cartItems.length > 0 && (
          <div className="cart-details">
            <h4>Cart Items:</h4>
            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <span>{item.name}</span>
                <span>x{item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ========== Main App Component ==========
function App() {
  return (
    <div className="app">
      <h1>Day 2: Props & State Tasks</h1>
      
      {/* Task 1 Components */}
      <section className="task-section">
        <h2>Task 1: Interactive Components</h2>
        <div className="task1-grid">
          <Counter />
          <ToggleCard />
          <ColorPicker />
        </div>
      </section>
      
      {/* Task 2 Components */}
      <section className="task-section">
        <h2>Task 2: Product Listing with Shared State</h2>
        <ShoppingCart />
      </section>
    </div>
  );
}

export default App;