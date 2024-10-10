import React, { useState, useEffect } from 'react';
import { Package } from '../../types'; // Update the import path

const PackageList: React.FC = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [destination, setDestination] = useState('');
  const [pickup, setPickup] = useState('');
  const [days, setDays] = useState('');

  useEffect(() => {
    fetchPackages();
  }, [destination, pickup, days]);

  const fetchPackages = async () => {
    const queryParams = new URLSearchParams({
      ...(destination && { destination }),
      ...(pickup && { pickup }),
      ...(days && { days }),
    });

    const response = await fetch(`/api/packages?${queryParams}`);
    const data = await response.json();
    setPackages(data);
  };

  return (
    <div>
      <div>
        <input
          type="text"
          placeholder="Destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />
        <input
          type="text"
          placeholder="Pickup Location"
          value={pickup}
          onChange={(e) => setPickup(e.target.value)}
        />
        <input
          type="number"
          placeholder="Number of Days"
          value={days}
          onChange={(e) => setDays(e.target.value)}
        />
      </div>
      <ul>
        {packages.map((pkg) => (
          <li key={pkg._id}>
            {pkg.location} - {pkg.tripDays} days
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PackageList;