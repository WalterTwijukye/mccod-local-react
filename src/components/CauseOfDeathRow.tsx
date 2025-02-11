import React from 'react';

interface CauseOfDeathRowProps {
  label: string;
  rowLetter: string;
  causeValue: string;
  codeValue: string;
  freeTextValue: string;
  timeUnitValue: string;
  timeQtyValue: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onNestedChange: (field: string, subField: string, value: string) => void;
}

const CauseOfDeathRow: React.FC<CauseOfDeathRowProps> = ({
  label,
  rowLetter,
  causeValue,
  codeValue,
  freeTextValue,
  timeUnitValue,
  timeQtyValue,
  onChange,
  onNestedChange
}) => {
  return (
    <tr>
      <th>{label}</th>
      <th>{rowLetter}</th>
      <td>
        <input type="text" className="form-control" name={`causeOfDeath${rowLetter}`} value={causeValue} onChange={onChange} />
      </td>
      <td>
        <input type="text" className="form-control" name={`code${rowLetter}`} value={codeValue} onChange={onChange} />
      </td>
      <td>
        <input type="text" className="form-control" name={`causeOfDeathFreeText${rowLetter}`} value={freeTextValue} onChange={onChange} />
      </td>
      <td>
        <select className="form-select" name={`Time_Interval_From_Onset_To_Death${rowLetter}.Time_Interval_Unit${rowLetter}`} value={timeUnitValue} onChange={(e) => onNestedChange(`Time_Interval_From_Onset_To_Death${rowLetter}`, `Time_Interval_Unit${rowLetter}`, e.target.value)}>
          <option value="">Select</option>
          <option value="Years">Years</option>
          <option value="Months">Months</option>
          <option value="Weeks">Weeks</option>
          <option value="Days">Days</option>
          <option value="Hours">Hours</option>
        </select>
      </td>
      <td>
        <input type="text" className="form-control" name={`Time_Interval_From_Onset_To_Death${rowLetter}.Time_Interval_Qtty${rowLetter}`} value={timeQtyValue} onChange={(e) => onNestedChange(`Time_Interval_From_Onset_To_Death${rowLetter}`, `Time_Interval_Qtty${rowLetter}`, e.target.value)} />
      </td>
    </tr>
  );
};

export default CauseOfDeathRow;
