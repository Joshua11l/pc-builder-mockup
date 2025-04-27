import React, { useState } from 'react';
import BuildList from '../components/BuildList';

export default function SavedBuildsScreen() {
  const [saved] = useState([]); // hook up real saved data later

  return (
    <div className="container">
      <h2 className="section-title">Saved Builds</h2>
      {saved.length === 0 ? (
        <p className="empty-state">You have no saved builds yet.</p>
      ) : (
        <BuildList items={saved} />
      )}
    </div>
  );
}
