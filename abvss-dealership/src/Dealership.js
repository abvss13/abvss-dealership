import React, { Component } from 'react';
import axios from 'axios';
import './App.css';

class Dealership extends Component {
  state = {
    cars: [],
    motorbikes: [],
    cart: [],
    isCartModalOpen: false,
    notificationMessage: '',
    searchQuery: '',
    sortBy: 'price-high',
    vehicleType: 'all',
  };

  generateRandomPrice = () => `Ksh ${Math.floor(Math.random() * (80000000 - 15000000) + 15000000)}`;

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
      const vehicle = { ...vehicles[index] }; // Create a copy of the vehicle

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
      }, 2000);
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

  handleFilterChange = (event) => {
    this.setState({ vehicleType: event.target.value });
  }

  render() {
    const { cars, motorbikes, cart, isCartModalOpen, notificationMessage, searchQuery, sortBy, vehicleType } = this.state;

    const filteredVehicles = vehicleType === 'all'
      ? [...cars, ...motorbikes]
      : vehicleType === 'cars'
      ? cars
      : motorbikes;

    const sortedVehicles = [...filteredVehicles].sort((a, b) => {
      if (sortBy === 'price-high') return parseFloat(b.price.split(' ')[1]) - parseFloat(a.price.split(' ')[1]);
      if (sortBy === 'price-low') return parseFloat(a.price.split(' ')[1]) - parseFloat(b.price.split(' ')[1]);
      if (sortBy === 'name-a-z') return a.name.localeCompare(b.name);
      if (sortBy === 'name-z-a') return b.name.localeCompare(a.name);
      return 0;
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
            <option value="price-high">Sort by Highest Price</option>
            <option value="price-low">Sort by Lowest Price</option>
            <option value="name-a-z">Sort by Name (A to Z)</option>
            <option value="name-z-a">Sort by Name (Z to A)</option>
          </select>
          <button onClick={() => this.handleFilterChange({ target: { value: 'all' } })}>All</button>
          <button onClick={() => this.handleFilterChange({ target: { value: 'cars' } })}>Cars</button>
          <button onClick={() => this.handleFilterChange({ target: { value: 'motorbikes' } })}>Motorbikes</button>
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

        <h3>{vehicleType === 'cars' ? 'Cars' : vehicleType === 'motorbikes' ? 'Motorbikes' : 'All Vehicles'}</h3>
        <div className="vehicle-list">
          {sortedVehicles.map((vehicle, index) => (
            <div key={index} className="vehicle">
              <img src={vehicle.image_url} alt={vehicle.name} />
              <h3>{vehicle.name}</h3>
              <p>Price: {vehicle.price}</p>
              <button
                className={vehicle.isInCart ? 'remove-from-cart-button' : 'add-to-cart-button'}
                onClick={() => this.handleCartToggle(vehicleType === 'cars' ? 'cars' : 'motorbikes', index)}
              >
                {vehicle.isInCart ? 'Remove from Cart' : 'Add to Cart'}
              </button>
            </div>
          ))}
        </div>

        {notificationMessage && (
          <div className="notification">
            <p>{notificationMessage}</p>
          </div>
        )}
      </div>
    );
  }
}

export default Dealership;
