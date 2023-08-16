import React, { Component } from 'react';
import axios from 'axios';

class Dealership extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cars: [],
      motorbikes: [],
      cart: [],
      isCartModalOpen: false
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

      return { [type]: vehicles, cart: updatedCart };
    });
  }

  handleCartModalOpen = () => {
    this.setState({ isCartModalOpen: true });
  }

  handleCartModalClose = () => {
    this.setState({ isCartModalOpen: false });
  }

  render() {
    const { cars, motorbikes, cart, isCartModalOpen } = this.state;

    return (
      <div className="dealership">
        <h1>Abvss Dealership</h1>
        <h2>Welcome to Our Dealership</h2>

        <button onClick={this.handleCartModalOpen}>View Cart</button>

        {isCartModalOpen && (
          <div className="cart-modal">
            <div className="cart-content">
              <h3>Your Cart</h3>
              {cart.map((item, index) => (
                <div key={index} className="cart-item">
                  <img src={item.image_url} alt={item.name} />
                  <h3>{item.name}</h3>
                  <p>Price: {item.price}</p>
                </div>
              ))}
              <button onClick={this.handleCartModalClose}>Close</button>
            </div>
          </div>
        )}

        <h3>Cars</h3>
        <div className="vehicle-list">
          {cars.map((car, index) => (
            <div key={index} className="vehicle">
              <img src={car.image_url} alt={car.name} />
              <h3>{car.name}</h3>
              <p>Price: {car.price}</p>
              <button onClick={() => this.handleCartToggle('cars', index)}>
                {car.isInCart ? 'Remove from Cart' : 'Add to Cart'}
              </button>
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
              <button onClick={() => this.handleCartToggle('motorbikes', index)}>
                {motorbike.isInCart ? 'Remove from Cart' : 'Add to Cart'}
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default Dealership;
