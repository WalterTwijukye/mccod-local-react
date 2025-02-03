import React, { useEffect } from 'react';
import useFacilityStore from '../stores/useFacilityStore';

interface FacilitySelectProps {
  id?: string;
  name?: string;
  className?: string;
}

const FacilitySelect: React.FC<FacilitySelectProps> = ({
  id = 'facility',
  name = 'facility',
  className = 'form-select',
}) => {
  const { facilities, fetchFacilities, selectedFacility, setSelectedFacility } = useFacilityStore();

  useEffect(() => {
    fetchFacilities();
  }, [fetchFacilities]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const facility = facilities.find((f) => f.id === e.target.value) || null;
    setSelectedFacility(facility);
  };

  return (
    <div className="col" style={{ border: 'none' }}>
      <select id={id} name={name} className={className} onChange={handleChange} value={selectedFacility?.id || ''}>
        <option value="">Select Facility</option>
        {facilities.map((facility) => (
          <option key={facility.id} value={facility.id}>
            {facility.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FacilitySelect;
