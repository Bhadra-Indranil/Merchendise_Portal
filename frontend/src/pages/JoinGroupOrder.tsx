import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function JoinGroupOrder() {
  const [uniqueCode, setUniqueCode] = useState('');
  const navigate = useNavigate();

  function handleJoin() {
    if (uniqueCode.trim()) {
      navigate(`/group-orders/${uniqueCode.trim()}`);
    }
  }

  return (
    <div>
      <div className="page-header text-center">
        <h1 className="page-title">Join a Group Order</h1>
        <p className="page-subtitle">Enter the unique code provided by the group admin.</p>
      </div>

      <div className="card" style={{ maxWidth: '400px', margin: '0 auto' }}>
        <div className="form-group">
          <label className="form-label">Unique Code</label>
          <input
            type="text"
            className="form-input"
            placeholder="Enter unique code"
            value={uniqueCode}
            onChange={(e) => setUniqueCode(e.target.value)}
          />
        </div>
        <button onClick={handleJoin} className="btn" style={{ width: '100%' }}>
          Find Group Order
        </button>
      </div>
    </div>
  );
}
