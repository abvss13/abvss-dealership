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

  componentDidMount() {
    axios.get('https://api.npoint.io/9f8ea6d2ec305842a78c')
      .then(response => {
        const { cars, motorbikes } = response.data;
        this.setState({ cars, motorbikes });
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }

  render() {
    const { cars, motorbikes } = this.state;

    return (
      <div className="dealership">
        <h1>Welcome to Our Dealership</h1>
        <h2>Cars</h2>
        <div className="vehicle-list">
          {cars.map((car, index) => (
            <div key={index} className="vehicle">
              <img src={car.image_url} alt={car.name} />
              <h3>{car.name}</h3>
              <p>Price: {car.price}</p>
            </div>
          ))}
        </div>

        <h2>Motorbikes</h2>
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
