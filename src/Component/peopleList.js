import React from 'react';
import personCard from './personCard'; // Import the personCard component

const peopleData = [
  {
    imageSrc: 'ChamanModi.jpg', // Replace with your image path
    name: 'Chaman Modi',
    title: 'Software Enginner',
    company: 'Tatvasoft',
    quote:
      '"Code is poetry written in a language only computers understand."',
  },
  {
    imageSrc: 'customer-2.png', // Replace with your image path
    name: 'Jonnie Riley',
    title: 'Employee',
    company: 'Curious Snakes',
    quote:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
  },
  {
    imageSrc: 'customer-3.png', // Replace with your image path
    name: 'Amilia Luna',
    title: 'Teacher',
    company: 'Saint Joseph High School',
    quote:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
  },
  {
    imageSrc: 'customer-4.png', // Replace with your image path
    name: 'Daniel Cardos',
    title: 'Software Engineer',
    company: 'Infinitum Company',
    quote:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
  },
];

const peopleList = () => {
  return (
    <div className="container">
      <div className="row row-cols-1 row-cols-md-2 g-4">
        {peopleData.map((person) => (
          <div className="col" key={person.name}>
            {personCard(person)}
          </div>

        ))}
      </div>
    </div>
  );
};

export default peopleList;
