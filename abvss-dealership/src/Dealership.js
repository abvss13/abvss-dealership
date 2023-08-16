import React, { Component } from 'react';
import axios from 'axios';
import './App.css'; // Import your CSS file

class Dealership extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cars: [],
      motorbikes: [],
      cart: [],
      isCartModalOpen: false,
      notificationMessage: '',
      searchQuery: '',
      sortBy: 'price', // Default sorting option
    };
  }

  generateRandomPrice = () => {
    return `Ksh ${Math.floor(Math.random() * (80000000 - 15000000) + 15000000)}`;
  }

  componentDidMount() {
    axios.get('https://api.npoint.io/9f8ea6d2ec305842a78c')
      .then(response => {
        const { cars, motorbikes } = response.data;
        const carsWithPrices = cars.map(car => ({ ...car, price: this.generateRandomPrice(), isInCart: false }));
        const motorbikesWithPrices = motorbikes.map(motorbike => ({ ...motorbike, price: this.generateRandomPrice(), isInCart: false }));
        this.setState({ cars: carsWithPrices, motorbikes: motorbikesWithPrices });
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }

  handleCartToggle = (type, index) => {
    this.setState(prevState => {
      const vehicles = [...prevState[type]];
      const vehicle = vehicles[index];

      // Toggle isInCart and update the cart
      vehicle.isInCart = !vehicle.isInCart;
      const updatedCart = vehicle.isInCart
        ? [...prevState.cart, vehicle]
        : prevState.cart.filter(item => item !== vehicle);

      // Show notification message
      const notificationMessage = vehicle.isInCart
        ? `${vehicle.name} added to cart`
        : `${vehicle.name} removed from cart`;
      this.showNotification(notificationMessage);

      return { [type]: vehicles, cart: updatedCart };
    });
  }

  showNotification = (message) => {
    this.setState({ notificationMessage: message }, () => {
      setTimeout(() => {
        this.setState({ notificationMessage: '' });
      }, 2000); // Clear the message after 2 seconds
    });
  }

  handleRemoveFromCart = (index) => {
    this.setState(prevState => {
      const updatedCart = prevState.cart.filter((item, itemIndex) => itemIndex !== index);
      return { cart: updatedCart };
    });
  }

  handleCartModalOpen = () => {
    this.setState({ isCartModalOpen: true });
  }

  handleCartModalClose = () => {
    this.setState({ isCartModalOpen: false });
  }

  handleSearchChange = (event) => {
    this.setState({ searchQuery: event.target.value });
  }

  handleSortChange = (event) => {
    this.setState({ sortBy: event.target.value });
  }

  render() {
    const { cars, motorbikes, cart, isCartModalOpen, notificationMessage, searchQuery, sortBy } = this.state;

    // Filter and sort the vehicles based on search and sorting criteria
    const filteredCars = cars.filter(car =>
      car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.model.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const sortedCars = [...filteredCars].sort((a, b) => {
      if (sortBy === 'price') {
        return a.price - b.price;
      } else {
        return a.name.localeCompare(b.name);
      }
    });

    return (
      <div className="dealership">
        <h1 className="header">Abvss Dealership</h1>
        <h2 className="sub-header">Welcome to Our Dealership</h2>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search for vehicles..."
            value={searchQuery}
            onChange={this.handleSearchChange}
          />
          <select value={sortBy} onChange={this.handleSortChange}>
            <option value="price">Sort by Price</option>
            <option value="name">Sort by Name</option>
          </select>
        </div>

        <button className="view-cart-button" onClick={this.handleCartModalOpen}>
          View Cart
        </button>

        {isCartModalOpen && (
          <div className="cart-modal">
            <div className="cart-content">
              <h3>Your Cart</h3>
              {cart.map((item, index) => (
                <div key={index} className="cart-item">
                  <img src={item.image_url} alt={item.name} />
                  <h3>{item.name}</h3>
                  <p>Price: {item.price}</p>
                  <button className="remove-from-cart-button" onClick={() => this.handleRemoveFromCart(index)}>
                    Remove from Cart
                  </button>
                </div>
              ))}
              <button className="close-button" onClick={this.handleCartModalClose}>
                Close
              </button>
            </div>
          </div>
        )}

        <h3>Cars</h3>
        <div className="vehicle-list">
          {sortedCars.map((car, index) => (
            <div key={index} className="vehicle">
              <img src={car.image_url} alt={car.name} />
              <h3>{car.name}</h3>
              <p>Price: {car.price}</p>
              <button
                className={car.isInCart ? 'remove-from-cart-button' : 'add-to-cart-button'}
                onClick={() => this.handleCartToggle('cars', index)}
              >
                {car.isInCart ? 'Remove from Cart' : 'Add to Cart'}
              </button>
              {notificationMessage && (
                <p className="notification">{notificationMessage}</p>
              )}
            </div>
          ))}
        </div>

        <h3>Motorbikes</h3>
        <div className="vehicle-list">
          {motorbikes.map((motorbike, index) => (
            <div key={index} className="vehicle">
              <img src={motorbike.image_url} alt={motorbike.name} />
              <h3>{motorbike.name}</h3>
              <p>Price: {motorbike.price}</p>
              <button
                className={motorbike.isInCart ? 'remove-from-cart-button' : 'add-to-cart-button'}
                onClick={() => this.handleCartToggle('motorbikes', index)}
              >
                {motorbike.isInCart ? 'Remove from Cart' : 'Add to Cart'}
              </button>
              {notificationMessage && (
                <p className="notification">{notificationMessage}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default Dealership;
