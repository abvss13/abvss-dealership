import React, { Component } from 'react';
import axios from 'axios';

class Dealership extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cars: [],
      motorbikes: []
    };
  }

  generateRandomPrice = () => {
    return `Ksh ${Math.floor(Math.random() * (80000000 - 15000000) + 15000000)}`;
  }

  componentDidMount() {
    axios.get('https://api.npoint.io/9f8ea6d2ec305842a78c')
      .then(response => {
        const { cars, motorbikes } = response.data;
        const carsWithPrices = cars.map(car => ({ ...car, price: this.generateRandomPrice() }));
        const motorbikesWithPrices = motorbikes.map(motorbike => ({ ...motorbike, price: this.generateRandomPrice() }));
        this.setState({ cars: carsWithPrices, motorbikes: motorbikesWithPrices });
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }

  render() {
    const { cars, motorbikes } = this.state;

    return (
      <div className="dealership">
        <h1>Abvss Dealership</h1>
        <h2>Welcome to Our Dealership</h2>
        <h3>Cars</h3>
        <div className="vehicle-list">
          {cars.map((car, index) => (
            <div key={index} className="vehicle">
              <img src={car.image_url} alt={car.name} />
              <h3>{car.name}</h3>
              <p>Price: {car.price}</p>
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
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default Dealership;
