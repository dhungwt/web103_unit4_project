import React from "react";
import { Link } from "react-router-dom";
import './Card.css'

const Card = (props) => {
  return (
    <div className="card">
      <div
        className="top-container"
        style={{ backgroundImage: `url(${props.image})` }}
      ></div>
      <div className="bottom-container">
        <h3>{props.name}</h3>
        <p>{"Ride: " + props.ride}</p>
        <p>{"Food: " + props.food}</p>
        <p>{"Attraction: " + props.attraction}</p>
        <Link to={"/customparks/" + props.id}>Read More →</Link>
        <Link to={"/edit/" + props.id}>✏️ Edit</Link>
        <button onClick={() => props.onDelete(props.id)}>🗑️ Delete</button>
      </div>
    </div>
  );
};

export default Card;
