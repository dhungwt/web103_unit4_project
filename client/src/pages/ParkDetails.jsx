import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../App.css";

const ParkDetails = () => {
  const [park, setPark] = useState({
    id: 0,
    park_name: "",
    is_family_friendly: false,
    ride: "",
    food: "",
    attraction: "",
    total_price: 0,
    img_url: "",
  });
  
  const { id } = useParams();

    useEffect(() => {
        const fetchParkById = async () => {
            const response = await fetch(`/api/parks/${id}`);
            const data = await response.json();
            setPark(data);
        };
        
        fetchParkById();
    }, [id]);

 return (
    <div className="ParkDetails">
      <main id="park-content" className="park-info">
        <div className="image-container">
          <img id="image" src={park.img_url} alt={park.park_name} />
        </div>
        <div className="park-details">
          <h2 id="name">{park.park_name}</h2>
          <p id="is_family_friendly">{"Family Friendly: " + park.is_family_friendly}</p>
          <p id="ride">{"Ride: " + park.ride}</p>
          <p id="food">{"Food: " + park.food}</p>
          <p id="attraction">{"Attraction: " + park.attraction}</p>
            <p id="total_price">{"Total Price: $" + park.total_price.toLocaleString()}</p>
        </div>
      </main>
    </div>
  );
};

export default ParkDetails;
