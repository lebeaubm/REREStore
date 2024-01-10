import React from 'react';

const Review = ({ products })=> {
    return (
      <div>
        <h2>Reviews</h2>
        <ul>
          {
            products.map( product => {
             
              return (
                <li key={ product.id }>
  
                  { product.name } - {product.review}- {product.rating}
                  
                  
                </li>
              );
            })
          }
        </ul>
      </div>
    );
  };
  
  export default Review;