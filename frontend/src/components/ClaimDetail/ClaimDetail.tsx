import React, { useEffect, useState } from 'react';

export const ClaimDetail = ({ claimId }) => {
  const [claim, setClaim] = useState(null);

  useEffect(() => {
    const fetchClaimDetails = async () => {
      try {
        const response = await fetch(`/api/claims/${claimId}`);
        const data = await response.json();
        setClaim(data);
      } catch (error) {
        console.error('Error fetching claim details:', error);
      }
    };
    fetchClaimDetails();
  }, [claimId]);

  return (
    claim ? <div>{/* Render claim details here */}</div> : <p>Loading...</p>
  );
};