import React, { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import useFetch from '../../hooks/useFetch';
import './UserInfo.css';

const UserInfo = () => {
  const { currentUser, API_BASE } = useContext(UserContext);

  const { data: fullUser, loading, error } = useFetch(
    currentUser?.id ? `${API_BASE}/users/${currentUser.id}` : null
  );

  if (loading) {
    return (
      <div className="infoWrapper">
        <div className="loadingSpinner">
          <div className="spinner"></div>
          <p>Retrieving your full profile...</p>
        </div>
      </div>
    );
  }

  if (error || !fullUser || Array.isArray(fullUser)) { 
    return (
      <div className="infoWrapper">
        <div className="infoCard">
          <h2>Access Error</h2>
          <p>Please log in again to view your information.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="infoWrapper">
      <div className="infoCard">
        <div className="infoHeader">
          <div className="userAvatar">👤</div>
          <h2>User Profile</h2>
          <p>Details for <strong>{fullUser.username}</strong></p>
        </div>

        <section className="infoSection">
          <h3>Personal Identity</h3>
          <div className="infoGrid">
            <div className="infoItem"><label>Full Name</label><span>{fullUser.name}</span></div>
            <div className="infoItem"><label>Email Address</label><span>{fullUser.email}</span></div>
            <div className="infoItem"><label>Phone Number</label><span>{fullUser.phone}</span></div>
          </div>
        </section>

        <section className="infoSection">
          <h3>Address & Location</h3>
          <div className="infoGrid">
            <div className="infoItem"><label>City</label><span>{fullUser.address?.city}</span></div>
            <div className="infoItem"><label>Street</label><span>{fullUser.address?.street}</span></div>
            <div className="infoItem"><label>Zipcode</label><span>{fullUser.address?.zipcode}</span></div>
          </div>
        </section>

        <section className="infoSection">
          <h3>Company</h3>
          <div className="infoGrid">
            <div className="infoItem"><label>Name</label><span>{fullUser.company?.name}</span></div>
            <div className="infoItem"><label>Business Strategy</label><span>{fullUser.company?.bs}</span></div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default UserInfo;




