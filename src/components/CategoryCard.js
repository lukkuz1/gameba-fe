import React from "react";
import { Link } from "react-router-dom";

const CategoryCard = ({ category }) => {
  return (
    <Link to={`/categories/${category.Id}`} className="category-link">
      <div className="category-card">
        <h3>{category.Name}</h3>
        <p>{category.Description}</p>
      </div>
    </Link>
  );
};

export default CategoryCard;
