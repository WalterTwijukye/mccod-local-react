import React from 'react';

interface CauseOfDeathRowProps {
  index: number;
  label?: string;
  rowLetter?: string;
  labelHtml?: React.ReactNode;
  showLabel?: boolean;
  causeValue: string;
  codeValue: string;
  freeTextValue: string;
  timeUnitValue: string;
  timeQtyValue: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onNestedChange: (field: string, subField: string, value: string) => void;
}

const CauseOfDeathRow: React.FC<CauseOfDeathRowProps> = ({
  index,
  rowLetter,
  label,
  labelHtml,
  showLabel = true,
  causeValue,
  codeValue,
  freeTextValue,
  timeUnitValue,
  timeQtyValue,
  onChange,
  onNestedChange,
}) => {
  return (
    <tr>
      {showLabel ? (label ? <th>{label}</th> : labelHtml ? labelHtml : <></>) : <></>}
      <th>{rowLetter}</th>
      <td>
        <input
          type="text"
          className="form-control ctw-input"
          autoComplete="off"
          name={`causeOfDeath${index}`}
          value={causeValue}
          onChange={onChange}
        />
      </td>
      <td>
        <input
          type="text"
          className="form-control"
          name={`code${index}`}
          value={codeValue}
          onChange={onChange}
        />
      </td>
      <td>
        <input
          type="text"
          className="form-control"
          name={`causeOfDeathFreeText${index}`}
          value={freeTextValue}
          onChange={onChange}
        />
      </td>
      <td>
        <select
          className="form-select"
          name={`timeUnit${index}`}
          value={timeUnitValue}
          onChange={(e) =>
            onNestedChange(`Time_Interval_From_Onset_To_Death${index}`, 'Time_Interval_Unit', e.target.value)
          }
        >
          <option value="">Select</option>
          <option value="Years">Years</option>
          <option value="Months">Months</option>
          <option value="Weeks">Weeks</option>
          <option value="Days">Days</option>
          <option value="Hours">Hours</option>
        </select>
      </td>
      <td>
        <input
          type="text"
          className="form-control"
          name={`timeQty${index}`}
          value={timeQtyValue}
          onChange={(e) =>
            onNestedChange(`Time_Interval_From_Onset_To_Death${index}`, 'Time_Interval_Qtty', e.target.value)
          }
        />
      </td>
      <div className="ctw-window" data-ctw-ino={`icd-${index}`}></div>
    </tr>
  );
};

export default CauseOfDeathRow;
