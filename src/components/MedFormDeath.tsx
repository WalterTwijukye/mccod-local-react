import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import FormHeader from './Header';
import FormFooter from './Footer';
import './MedFormDeath.css';
import FacilitySelect from './FacilitySelect';
import useFacilityStore from '../stores/useFacilityStore';
import { addEvent, getStats } from '../stores/useEventsDB';
import { FormData } from '../types/FormData';
import EventListModal from './EventListModal';
import CauseOfDeathRow from './CauseOfDeathRow';
import OtherConditionsRow from './OtherConditionRow';

const defaultFormData: FormData = {
    MOH_National_Case_Number: '',
    Inpatient_Number: '',
    NIN: '',
    Name: '',
    Region: '',
    Occupation: '',
    District: '',
    Date_Of_Birth_Known: false,
    Date_Of_Birth_notKnown: false,
    County: '',
    Date_Of_Birth: '',
    Sub_County: '',
    Age: { Years: '', Months: '', Days: '', Hours: '', Minutes: '' },
    Village: '',
    Sex: '',
    placeOfDeath: '',
    Date_Time_Of_Death: '',
    causeOfDeath1: '',
    code1: '',
    causeOfDeathFreeText1: '',
    Time_Interval_From_Onset_To_Death1: { Time_Interval_Unit1: '', Time_Interval_Qtty1: '' },
    causeOfDeath2: '',
    code2: '',
    causeOfDeathFreeText2: '',
    Time_Interval_From_Onset_To_Death2: { Time_Interval_Unit2: '', Time_Interval_Qtty2: '' },
    causeOfDeath3: '',
    code3: '',
    causeOfDeathFreeText3: '',
    Time_Interval_From_Onset_To_Death3: { Time_Interval_Unit3: '', Time_Interval_Qtty3: '' },
    causeOfDeath4: '',
    code4: '',
    causeOfDeathFreeText4: '',
    Time_Interval_From_Onset_To_Death4: { Time_Interval_Unit4: '', Time_Interval_Qtty4: '' },
    State_Underlying_Cause: '',
    State_Underlying_Cause_Code: '',
    Doris_Underlying_Cause: '',
    dorisCode: '',
    Final_Underlying_Cause: '',
    Final_Underlying_CauseCode: '',
    lastSurgeryPerformed: '',
    dateOfSurgery: '',
    reasonForSurgery: '',
    autopsyRequested: '',
    findingsInCertification: '',
    disease: false,
    assault: false,
    notDetermined: false,
    accident: false,
    legalIntervention: false,
    pendingInvenstigation: false,
    intentionalSelfHarm: false,
    war: false,
    unknown: false,
    externalCause: false,
    dateOfInjury: '',
    describeExternalCause: '',
    occuranceOfExternalCause: '',
    multiplePregnancy: '',
    stillBorn: '',
    numberOfHrsSurvived: '',
    birthWeight: '',
    numberOfCompletedPregWeeks: '',
    ageOfMother: '',
    conditionsPerinatalDeath: '',
    wasDeceasedPreg: '',
    atWhatPoint: '',
    didPregancyContributeToDeath: '',
    parity: '',
    modeOfDelivery: '',
    placeOfDelivery: '',
    deliveredBySkilledAttendant: '',
    I_Attended_Deceased: false,
    I_Examined_Body: false,
    I_Conducted_PostMortem: false,
    Other: '',
    examinedBy: '',
    facility: '',
    syncStatus: 'pending', // Default sync status
};

const MedFormDeath: React.FC = () => {

    const { selectedFacility } = useFacilityStore();
    const [formData, setFormData] = useState<FormData>(defaultFormData);
    const [eventStats, setEventStats] = useState({ total: 0, sent: 0, notSent: 0 });
    
    const fetchStats = async () => {
        const stats = await getStats();
        setEventStats(stats);
    };

    useEffect(() => {
        fetchStats(); // fetch initially when the component mounts
    }, []);
    
    // const navigate = useNavigate();

    // const handleGoToDashboard = () => {
    //     navigate('/dashboard'); // Navigate to another page
    // };

    // State for form data

    useEffect(() => {
        if (selectedFacility) {
          // Update formData with the selected facility when the global selectedFacility changes
          setFormData((prevData) => ({
            ...prevData,
            facility: selectedFacility.id, // Set the selected facility id
          }));
        }
      }, [selectedFacility]);

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const updatedFormData = { ...formData, facility: selectedFacility?.id || '' };
            await addEvent(updatedFormData); // Save event data
            setFormData(defaultFormData);
            fetchStats();
            // alert('Event saved!');
            console.log('Form Data Submitted:', formData);
          } catch (error) {
            console.error('Error saving event', error);
          }
        // Add API call or further processing here
    };

    // Handle input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined; // {{ edit_1 }}
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    // Handle nested object changes (e.g., Age, Time_Interval_From_Onset_To_Death)
    const handleNestedChange = (parentKey: string, childKey: string, value: string) => {
        setFormData((prevData) => ({
            ...prevData,
            [parentKey]: {
                ...(prevData[parentKey as keyof typeof prevData] as Record<string, any>), // Fix: Type assertion
                [childKey]: value,
            },
        }));
    };

    return (
        <>
            <FormHeader />
            <div className="header1">
                <h2 className="heading">MCCOD-local</h2>
                <div className="summaryTabs">
                    <span className="tab">Total Records: <p className="stat">{ eventStats.total }</p></span>
                    <span className="tab">Records Sent: <p className="stat">{ eventStats.sent }</p></span>
                    <span className="tab">Records NOT Sent: <p className="stat">{ eventStats.notSent }</p></span>
                </div>
            </div>
            <div className="container">
                <form id="medicalCertDeath" className="main" onSubmit={handleSubmit}>
                    {/* Facility Section */}
                    <div className="row">
                        <div className="col" style={{ border: 'none' }}>
                            <label className="form-label facility" htmlFor="facility">Facility:</label>
                            <span style={{ marginTop: '-7px', marginLeft: '5px' }}><b>{selectedFacility?.name}</b></span>
                        </div>
                        <div className="col" style={{ border: 'none' }}>
                            <FacilitySelect
                                className="form-select"
                                id="facility"
                                name="facility"
                            />
                        </div>
                        <div className="col" style={{ border: 'none' }}>
                            <div className="topBtns">
                                <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#eventListModal">
                                    View Records
                                </button>
                                <button className="btn btn-primary update-button">Update Record</button>
                            </div>
                        </div>
                    </div>

                    <br />
                    {/* Basic Information Section */}
                    <div className="row">
                        <div className="col">
                            <label className="form-label" htmlFor="MOH_National_Case_Number">Ministry of Health National Case Number</label>
                        </div>
                        <div className="col">
                            <input
                                type="text"
                                className="form-control"
                                id="MOH_National_Case_Number"
                                name="MOH_National_Case_Number"
                                value={formData.MOH_National_Case_Number}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="col">
                            <label className="form-label" htmlFor="Inpatient_Number">InPatient Number</label>
                        </div>
                        <div className="col">
                            <input
                                type="text"
                                className="form-control"
                                id="Inpatient_Number"
                                name="Inpatient_Number"
                                value={formData.Inpatient_Number}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Add all other form fields here following the same pattern */}
                    {/* ... */}

                    {/* NIN and Name Section */}
                    <div className="row">
                        <div className="col">
                            <label className="form-label" htmlFor="NIN">NIN</label>
                        </div>
                        <div className="col">
                            <input
                                type="text"
                                className="form-control"
                                id="NIN"
                                name="NIN"
                                value={formData.NIN}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="col">
                            <label className="form-label" htmlFor="Name">Name (Full Name):</label>
                        </div>
                        <div className="col">
                            <input
                                type="text"
                                className="form-control"
                                id="Name"
                                name="Name"
                                value={formData.Name}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Place of Residence Section */}
                    <div className="row rowHeader">
                        <div className="col">
                            <h4>Place of residence of deceased</h4>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <label className="form-label" htmlFor="Region">Region</label>
                        </div>
                        <div className="col">
                            <input
                                type="text"
                                className="form-control"
                                id="Region"
                                name="Region"
                                value={formData.Region}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="col">
                            <label className="form-label" htmlFor="Occupation">Occupation</label>
                        </div>
                        <div className="col">
                            <input
                                type="text"
                                className="form-control"
                                id="Occupation"
                                name="Occupation"
                                value={formData.Occupation}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>

                    {/* District and Date of Birth Section */}
                    <div className="row">
                        <div className="col">
                            <label className="form-label" htmlFor="District">District</label>
                        </div>
                        <div className="col">
                            <input
                                type="text"
                                className="form-control"
                                id="District"
                                name="District"
                                value={formData.District}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="col">
                            <label className="form-label" htmlFor="Date_Of_Birth_Known">Date of Birth Known?</label>
                        </div>
                        <div className="col">
                            <div className="form-check">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="Date_Of_Birth_Known"
                                    name="Date_Of_Birth_Known"
                                    checked={formData.Date_Of_Birth_Known}
                                    onChange={handleInputChange}
                                />
                                <label className="form-check-label" htmlFor="Date_Of_Birth_Known">Yes</label>
                            </div>
                            <div className="form-check">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="Date_Of_Birth_notKnown"
                                    name="Date_Of_Birth_notKnown"
                                    checked={formData.Date_Of_Birth_notKnown}
                                    onChange={handleInputChange}
                                />
                                <label className="form-check-label" htmlFor="Date_Of_Birth_notKnown">No</label>
                            </div>
                        </div>
                    </div>

                    {/* County and Date of Birth Section */}
                    <div className="row">
                        <div className="col">
                            <label className="form-label" htmlFor="County">County</label>
                        </div>
                        <div className="col">
                            <input
                                type="text"
                                className="form-control"
                                id="County"
                                name="County"
                                value={formData.County}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="col">
                            <label className="form-label" htmlFor="Date_Of_Birth">Date of Birth</label>
                        </div>
                        <div className="col">
                            <input
                                type="date"
                                className="form-control"
                                id="Date_Of_Birth"
                                name="Date_Of_Birth"
                                value={formData.Date_Of_Birth}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Sub-County and Age Section */}
                    <div className="row">
                        <div className="col">
                            <label className="form-label" htmlFor="Sub_County">Sub-County</label>
                        </div>
                        <div className="col">
                            <input
                                type="text"
                                className="form-control"
                                id="Sub_County"
                                name="Sub_County"
                                value={formData.Sub_County}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="col" style={{ borderRight: 'none' }}>
                            <label className="form-label" htmlFor="Age.Years">Age:</label>
                            <table style={{ marginRight: '-25px', marginLeft: '20px' }}>
                                <tr>
                                    <th>Years:</th>
                                    <th>Months:</th>
                                </tr>
                                <tr>
                                    <td>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="Age.Years"
                                            name="Age.Years"
                                            value={formData.Age.Years}
                                            onChange={(e) => handleNestedChange('Age', 'Years', e.target.value)}
                                            required
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="Age.Months"
                                            name="Age.Months"
                                            value={formData.Age.Months}
                                            onChange={(e) => handleNestedChange('Age', 'Months', e.target.value)}
                                            required
                                        />
                                    </td>
                                </tr>
                            </table>
                        </div>
                        <div className="col" style={{ borderLeft: 'none' }}>
                            <table>
                                <tr>
                                    <th>Days:</th>
                                    <th>Hours:</th>
                                    <th>Minutes:</th>
                                </tr>
                                <tr>
                                    <td>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="Age.Days"
                                            name="Age.Days"
                                            value={formData.Age.Days}
                                            onChange={(e) => handleNestedChange('Age', 'Days', e.target.value)}
                                            required
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="Age.Hours"
                                            name="Age.Hours"
                                            value={formData.Age.Hours}
                                            onChange={(e) => handleNestedChange('Age', 'Hours', e.target.value)}
                                            required
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="Age.Minutes"
                                            name="Age.Minutes"
                                            value={formData.Age.Minutes}
                                            onChange={(e) => handleNestedChange('Age', 'Minutes', e.target.value)}
                                            required
                                        />
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </div>

                    {/* Village and Sex Section */}
                    <div className="row">
                        <div className="col">
                            <label className="form-label" htmlFor="Village">Village</label>
                        </div>
                        <div className="col">
                            <input
                                type="text"
                                className="form-control"
                                id="Village"
                                name="Village"
                                value={formData.Village}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="col">
                            <label className="form-label" htmlFor="Sex">Sex</label>
                        </div>
                        <div className="col">
                            <select
                                className="form-select"
                                id="Sex"
                                name="Sex"
                                value={formData.Sex}
                                onChange={handleInputChange}
                            >
                                <option value="">Select</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>
                    </div>

                    {/* Place of Death and Date/Time of Death Section */}
                    <div className="row">
                        <div className="col">
                            <label className="form-label" htmlFor="placeOfDeath">Place of Death</label>
                        </div>
                        <div className="col">
                            <input
                                type="text"
                                className="form-control"
                                id="placeOfDeath"
                                name="placeOfDeath"
                                value={formData.placeOfDeath}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="col">
                            <label className="form-label" htmlFor="Date_Time_Of_Death">Date and Time of Death</label>
                        </div>
                        <div className="col">
                            <input
                                type="datetime-local"
                                className="form-control"
                                id="Date_Time_Of_Death"
                                name="Date_Time_Of_Death"
                                value={formData.Date_Time_Of_Death}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Frame A: Medical Data Section */}
                    <div className="row rowHeader">
                        <div className="col">
                            <h4>Frame A: Medical Data. Part 1 and 2</h4>
                        </div>
                    </div>
                    <div className="row tables">
                        <table>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th></th>
                                    <th>Cause of death</th>
                                    <th>Code</th>
                                    <th>Cause of Death Free Text</th>
                                    <th>Time interval type from onset to death</th>
                                    <th>Time interval type from onset to death</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Row 1 */}
                                <CauseOfDeathRow
                                    label="Report disease or condition directly leading to death on line a"
                                    rowLetter="a"
                                    causeValue={formData.causeOfDeath1}
                                    codeValue={formData.code1}
                                    freeTextValue={formData.causeOfDeathFreeText1}
                                    timeUnitValue={formData.Time_Interval_From_Onset_To_Death1.Time_Interval_Unit1}
                                    timeQtyValue={formData.Time_Interval_From_Onset_To_Death1.Time_Interval_Qtty1}
                                    onChange={handleInputChange}
                                    onNestedChange={handleNestedChange}
                                />
                                <CauseOfDeathRow
                                    labelHtml={<th rowSpan={3}>Report chain of events 'due to' (b to d) in order (if applicable)</th>}
                                    rowLetter="b"
                                    causeValue={formData.causeOfDeath2}
                                    codeValue={formData.code2}
                                    freeTextValue={formData.causeOfDeathFreeText2}
                                    timeUnitValue={formData.Time_Interval_From_Onset_To_Death2.Time_Interval_Unit2}
                                    timeQtyValue={formData.Time_Interval_From_Onset_To_Death2.Time_Interval_Qtty2}
                                    onChange={handleInputChange}
                                    onNestedChange={handleNestedChange}
                                />
                                <CauseOfDeathRow
                                    showLabel={false}
                                    rowLetter="c"
                                    causeValue={formData.causeOfDeath3}
                                    codeValue={formData.code3}
                                    freeTextValue={formData.causeOfDeathFreeText3}
                                    timeUnitValue={formData.Time_Interval_From_Onset_To_Death3.Time_Interval_Unit3}
                                    timeQtyValue={formData.Time_Interval_From_Onset_To_Death3.Time_Interval_Qtty3}
                                    onChange={handleInputChange}
                                    onNestedChange={handleNestedChange}
                                />
                                <CauseOfDeathRow
                                    showLabel={false}
                                    rowLetter="d"
                                    causeValue={formData.causeOfDeath4}
                                    codeValue={formData.code4}
                                    freeTextValue={formData.causeOfDeathFreeText4}
                                    timeUnitValue={formData.Time_Interval_From_Onset_To_Death4.Time_Interval_Unit4}
                                    timeQtyValue={formData.Time_Interval_From_Onset_To_Death4.Time_Interval_Qtty4}
                                    onChange={handleInputChange}
                                    onNestedChange={handleNestedChange}
                                />
                                
  <OtherConditionsRow
    mainLabel="Other significant conditions contributing to death (time intervals can be included in brackets after the condition)"
    subLabel="Other 1"
    showMainLabel
    rowSpan={5}
    onChange={handleInputChange}
  />
  <OtherConditionsRow subLabel="Other 2" onChange={handleInputChange} />
  <OtherConditionsRow subLabel="Other 3" onChange={handleInputChange} />
  <OtherConditionsRow subLabel="Other 4" onChange={handleInputChange} />
  <OtherConditionsRow subLabel="Other 5" onChange={handleInputChange} />


                                {/* Add rows 2-9 similarly */}
                            </tbody>
                        </table>
                    </div>

                    {/* Frame B: Other Medical Data Section */}
                    <div className="row rowHeader">
                        <div className="col">
                            <h4>Frame B: Other Medical Data</h4>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <label className="form-label" htmlFor="lastSurgeryPerformed">Was surgery performed within the last 4 weeks?</label>
                        </div>
                        <div className="col">
                            <select
                                className="form-select"
                                id="lastSurgeryPerformed"
                                name="lastSurgeryPerformed"
                                value={formData.lastSurgeryPerformed}
                                onChange={handleInputChange}
                            >
                                <option value="">Select</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                                <option value="Unknown">Unknown</option>
                            </select>
                        </div>
                    </div>
                    {/* Add other fields similarly */}

                    {/* Date of Surgery Section */}
                    <div className="row">
                        <div className="col">
                            <label className="form-label" htmlFor="dateOfSurgery">If yes, please specify date of surgery</label>
                        </div>
                        <div className="col">
                            <input
                                type="date"
                                className="form-control"
                                id="dateOfSurgery"
                                name="dateOfSurgery"
                                value={formData.dateOfSurgery}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Reason for Surgery Section */}
                    <div className="row">
                        <div className="col">
                            <label className="form-label" htmlFor="reasonForSurgery">If yes, please specify reason for surgery (disease or condition)</label>
                        </div>
                        <div className="col">
                            <input
                                type="text"
                                className="form-control"
                                id="reasonForSurgery"
                                name="reasonForSurgery"
                                value={formData.reasonForSurgery}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Autopsy Requested Section */}
                    <div className="row">
                        <div className="col">
                            <label className="form-label" htmlFor="autopsyRequested">Was an autopsy requested?</label>
                        </div>
                        <div className="col">
                            <select
                                className="form-select"
                                id="autopsyRequested"
                                name="autopsyRequested"
                                value={formData.autopsyRequested}
                                onChange={handleInputChange}
                            >
                                <option value="">Select</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                                <option value="Unknown">Unknown</option>
                            </select>
                        </div>
                    </div>

                    {/* Findings in Certification Section */}
                    <div className="row">
                        <div className="col">
                            <label className="form-label" htmlFor="findingsInCertification">If yes, were the findings used in certification?</label>
                        </div>
                        <div className="col">
                            <select
                                className="form-select"
                                id="findingsInCertification"
                                name="findingsInCertification"
                                value={formData.findingsInCertification}
                                onChange={handleInputChange}
                            >
                                <option value="">Select</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                                <option value="Unknown">Unknown</option>
                            </select>
                        </div>
                    </div>

                    {/* Manner of Death Section */}
                    <div className="row rowHeader">
                        <div className="col">
                            <h4>Manner of Death</h4>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <label className="form-label" htmlFor="disease">Disease</label>
                        </div>
                        <div className="col">
                            <div className="form-check">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="disease"
                                    name="disease"
                                    checked={formData.disease}
                                    onChange={handleInputChange}
                                />
                                <label className="form-check-label" htmlFor="disease">Yes</label>
                            </div>
                        </div>
                        <div className="col">
                            <label className="form-label" htmlFor="assault">Assault</label>
                        </div>
                        <div className="col">
                            <div className="form-check">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="assault"
                                    name="assault"
                                    checked={formData.assault}
                                    onChange={handleInputChange}
                                />
                                <label className="form-check-label" htmlFor="assault">Yes</label>
                            </div>
                        </div>
                        <div className="col">
                            <label className="form-label" htmlFor="notDetermined">Could not be determined</label>
                        </div>
                        <div className="col">
                            <div className="form-check">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="notDetermined"
                                    name="notDetermined"
                                    checked={formData.notDetermined}
                                    onChange={handleInputChange}
                                />
                                <label className="form-check-label" htmlFor="notDetermined">Yes</label>
                            </div>
                        </div>
                    </div>

                    {/* Accident and Legal Intervention Section */}
                    <div className="row">
                        <div className="col">
                            <label className="form-label" htmlFor="accident">Accident</label>
                        </div>
                        <div className="col">
                            <div className="form-check">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="accident"
                                    name="accident"
                                    checked={formData.accident}
                                    onChange={handleInputChange}
                                />
                                <label className="form-check-label" htmlFor="accident">Yes</label>
                            </div>
                        </div>
                        <div className="col">
                            <label className="form-label" htmlFor="legalIntervention">Legal intervention</label>
                        </div>
                        <div className="col">
                            <div className="form-check">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="legalIntervention"
                                    name="legalIntervention"
                                    checked={formData.legalIntervention}
                                    onChange={handleInputChange}
                                />
                                <label className="form-check-label" htmlFor="legalIntervention">Yes</label>
                            </div>
                        </div>
                        <div className="col">
                            <label className="form-label" htmlFor="pendingInvenstigation">Pending investigation</label>
                        </div>
                        <div className="col">
                            <div className="form-check">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="pendingInvenstigation"
                                    name="pendingInvenstigation"
                                    checked={formData.pendingInvenstigation}
                                    onChange={handleInputChange}
                                />
                                <label className="form-check-label" htmlFor="pendingInvenstigation">Yes</label>
                            </div>
                        </div>
                    </div>

                    {/* Intentional Self-Harm and War Section */}
                    <div className="row">
                        <div className="col">
                            <label className="form-label" htmlFor="intentionalSelfHarm">Intentional self-harm</label>
                        </div>
                        <div className="col">
                            <div className="form-check">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="intentionalSelfHarm"
                                    name="intentionalSelfHarm"
                                    checked={formData.intentionalSelfHarm}
                                    onChange={handleInputChange}
                                />
                                <label className="form-check-label" htmlFor="intentionalSelfHarm">Yes</label>
                            </div>
                        </div>
                        <div className="col">
                            <label className="form-label" htmlFor="war">War</label>
                        </div>
                        <div className="col">
                            <div className="form-check">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="war"
                                    name="war"
                                    checked={formData.war}
                                    onChange={handleInputChange}
                                />
                                <label className="form-check-label" htmlFor="war">Yes</label>
                            </div>
                        </div>
                        <div className="col">
                            <label className="form-label" htmlFor="unknown">Unknown</label>
                        </div>
                        <div className="col">
                            <div className="form-check">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="unknown"
                                    name="unknown"
                                    checked={formData.unknown}
                                    onChange={handleInputChange}
                                />
                                <label className="form-check-label" htmlFor="unknown">Yes</label>
                            </div>
                        </div>
                    </div>

                    {/* External Cause Section */}
                    <div className="row">
                        <div className="col">
                            <label className="form-label" htmlFor="externalCause">If external cause or poisoning</label>
                        </div>
                        <div className="col">
                            <div className="form-check">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="externalCause"
                                    name="externalCause"
                                    checked={formData.externalCause}
                                    onChange={handleInputChange}
                                />
                                <label className="form-check-label" htmlFor="externalCause">Yes</label>
                            </div>
                        </div>
                        <div className="col">
                            <label className="form-label" htmlFor="dateOfInjury">Date of injury</label>
                        </div>
                        <div className="col">
                            <input
                                type="date"
                                className="form-control"
                                id="dateOfInjury"
                                name="dateOfInjury"
                                value={formData.dateOfInjury}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Describe External Cause Section */}
                    <div className="row">
                        <div className="col">
                            <label className="form-label" htmlFor="describeExternalCause">Please describe how external cause occurred (if poisoning, please specify poisoning agent)</label>
                        </div>
                        <div className="col">
                            <input
                                type="text"
                                className="form-control"
                                id="describeExternalCause"
                                name="describeExternalCause"
                                value={formData.describeExternalCause}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Place of Occurrence Section */}
                    <div className="row">
                        <div className="col">
                            <label className="form-label" htmlFor="occuranceOfExternalCause">Place of occurrence of the external cause</label>
                        </div>
                        <div className="col">
                            <input
                                type="text"
                                className="form-control"
                                id="occuranceOfExternalCause"
                                name="occuranceOfExternalCause"
                                value={formData.occuranceOfExternalCause}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Fatal or Infant Death Section */}
                    <div className="row rowHeader">
                        <div className="col">
                            <h4>Fatal or Infant Death</h4>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <label className="form-label" htmlFor="multiplePregnancy">Multiple pregnancy</label>
                        </div>
                        <div className="col">
                            <select
                                className="form-select"
                                id="multiplePregnancy"
                                name="multiplePregnancy"
                                value={formData.multiplePregnancy}
                                onChange={handleInputChange}
                            >
                                <option value="">Select</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                                <option value="Unknown">Unknown</option>
                            </select>
                        </div>
                    </div>

                    {/* Stillborn Section */}
                    <div className="row">
                        <div className="col">
                            <label className="form-label" htmlFor="stillBorn">Stillborn?</label>
                        </div>
                        <div className="col">
                            <select
                                className="form-select"
                                id="stillBorn"
                                name="stillBorn"
                                value={formData.stillBorn}
                                onChange={handleInputChange}
                            >
                                <option value="">Select</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                                <option value="Unknown">Unknown</option>
                            </select>
                        </div>
                    </div>

                    {/* Number of Hours Survived and Birth Weight Section */}
                    <div className="row">
                        <div className="col">
                            <label className="form-label" htmlFor="numberOfHrsSurvived">If death within 24 hrs, specify the number of hours survived</label>
                        </div>
                        <div className="col">
                            <input
                                type="text"
                                className="form-control"
                                id="numberOfHrsSurvived"
                                name="numberOfHrsSurvived"
                                value={formData.numberOfHrsSurvived}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="col">
                            <label className="form-label" htmlFor="birthWeight">Birth weight (in grams)</label>
                        </div>
                        <div className="col">
                            <input
                                type="text"
                                className="form-control"
                                id="birthWeight"
                                name="birthWeight"
                                value={formData.birthWeight}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Number of Completed Pregnancy Weeks and Age of Mother Section */}
                    <div className="row">
                        <div className="col">
                            <label className="form-label" htmlFor="numberOfCompletedPregWeeks">Number of completed weeks of pregnancy</label>
                        </div>
                        <div className="col">
                            <input
                                type="text"
                                className="form-control"
                                id="numberOfCompletedPregWeeks"
                                name="numberOfCompletedPregWeeks"
                                value={formData.numberOfCompletedPregWeeks}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="col">
                            <label className="form-label" htmlFor="ageOfMother">Age of mother (years)</label>
                        </div>
                        <div className="col">
                            <input
                                type="text"
                                className="form-control"
                                id="ageOfMother"
                                name="ageOfMother"
                                value={formData.ageOfMother}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Conditions of Perinatal Death Section */}
                    <div className="row">
                        <div className="col">
                            <label className="form-label" htmlFor="conditionsPerinatalDeath">If the death was perinatal, please state conditions of mother that affected the fetus and newborn</label>
                        </div>
                        <div className="col">
                            <input
                                type="text"
                                className="form-control"
                                id="conditionsPerinatalDeath"
                                name="conditionsPerinatalDeath"
                                value={formData.conditionsPerinatalDeath}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>

                    {/* For Women Section */}
                    <div className="row rowHeader">
                        <div className="col">
                            <h4>For Women:</h4>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <label className="form-label" htmlFor="wasDeceasedPreg">Was the deceased pregnant or within 6 weeks of delivery?</label>
                        </div>
                        <div className="col">
                            <select
                                className="form-select"
                                id="wasDeceasedPreg"
                                name="wasDeceasedPreg"
                                value={formData.wasDeceasedPreg}
                                onChange={handleInputChange}
                            >
                                <option value="">Select</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                                <option value="Unknown">Unknown</option>
                            </select>
                        </div>
                    </div>

                    {/* At What Point Section */}
                    <div className="row">
                        <div className="col">
                            <label className="form-label" htmlFor="atWhatPoint">At what point?</label>
                        </div>
                        <div className="col">
                            <select
                                className="form-select"
                                id="atWhatPoint"
                                name="atWhatPoint"
                                value={formData.atWhatPoint}
                                onChange={handleInputChange}
                            >
                                <option value="">Select</option>
                                <option value="At time of death">At time of death</option>
                                <option value="Within 42 days before the death">Within 42 days before the death</option>
                                <option value="Between 43 days up to 1 year before death">Between 43 days up to 1 year before death</option>
                                <option value="Unknown">Unknown</option>
                            </select>
                        </div>
                    </div>

                    {/* Did Pregnancy Contribute to Death Section */}
                    <div className="row">
                        <div className="col">
                            <label className="form-label" htmlFor="didPregancyContributeToDeath">Did the pregnancy contribute to death?</label>
                        </div>
                        <div className="col">
                            <select
                                className="form-select"
                                id="didPregancyContributeToDeath"
                                name="didPregancyContributeToDeath"
                                value={formData.didPregancyContributeToDeath}
                                onChange={handleInputChange}
                            >
                                <option value="">Select</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                                <option value="Unknown">Unknown</option>
                            </select>
                        </div>
                    </div>

                    {/* Parity Section */}
                    <div className="row">
                        <div className="col">
                            <label className="form-label" htmlFor="parity">Parity</label>
                        </div>
                        <div className="col">
                            <input
                                type="text"
                                className="form-control"
                                id="parity"
                                name="parity"
                                value={formData.parity}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Mode of Delivery Section */}
                    <div className="row">
                        <div className="col">
                            <label className="form-label" htmlFor="modeOfDelivery">Mode of delivery</label>
                        </div>
                        <div className="col">
                            <select
                                className="form-select"
                                id="modeOfDelivery"
                                name="modeOfDelivery"
                                value={formData.modeOfDelivery}
                                onChange={handleInputChange}
                            >
                                <option value="">Select</option>
                                <option value="SVD">SVD</option>
                                <option value="Assisted">Assisted</option>
                                <option value="Caesarean">Caesarean</option>
                            </select>
                        </div>
                    </div>

                    {/* Place of Delivery Section */}
                    <div className="row">
                        <div className="col">
                            <label className="form-label" htmlFor="placeOfDelivery">Place of delivery</label>
                        </div>
                        <div className="col">
                            <select
                                className="form-select"
                                id="placeOfDelivery"
                                name="placeOfDelivery"
                                value={formData.placeOfDelivery}
                                onChange={handleInputChange}
                            >
                                <option value="">Select</option>
                                <option value="Heath Facility">Heath Facility</option>
                                <option value="Home">Home</option>
                                <option value="In Transit">In Transit</option>
                                <option value="Don't Know">Don't Know</option>
                                <option value="TBA">TBA</option>
                            </select>
                        </div>
                    </div>

                    {/* Delivered by Skilled Attendant Section */}
                    <div className="row">
                        <div className="col">
                            <label className="form-label" htmlFor="deliveredBySkilledAttendant">Delivered by skilled attendant</label>
                        </div>
                        <div className="col">
                            <select
                                className="form-select"
                                id="deliveredBySkilledAttendant"
                                name="deliveredBySkilledAttendant"
                                value={formData.deliveredBySkilledAttendant}
                                onChange={handleInputChange}
                            >
                                <option value="">Select</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                                <option value="Unknown">Unknown</option>
                            </select>
                        </div>
                    </div>

                    {/* Certification Section */}
                    <div className="row rowHeader">
                        <div className="col">
                            <h4>I hereby certify that (tick as appropriate):</h4>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <label className="form-label" htmlFor="I_Attended_Deceased">I attended the deceased before death</label>
                        </div>
                        <div className="col">
                            <div className="form-check">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="I_Attended_Deceased"
                                    name="I_Attended_Deceased"
                                    checked={formData.I_Attended_Deceased}
                                    onChange={handleInputChange}
                                />
                                <label className="form-check-label" htmlFor="I_Attended_Deceased">Yes</label>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <label className="form-label" htmlFor="I_Examined_Body">I examined the body after death</label>
                        </div>
                        <div className="col">
                            <div className="form-check">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="I_Examined_Body"
                                    name="I_Examined_Body"
                                    checked={formData.I_Examined_Body}
                                    onChange={handleInputChange}
                                />
                                <label className="form-check-label" htmlFor="I_Examined_Body">Yes</label>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <label className="form-label" htmlFor="I_Conducted_PostMortem">I conducted the post mortem of the body</label>
                        </div>
                        <div className="col">
                            <div className="form-check">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="I_Conducted_PostMortem"
                                    name="I_Conducted_PostMortem"
                                    checked={formData.I_Conducted_PostMortem}
                                    onChange={handleInputChange}
                                />
                                <label className="form-check-label" htmlFor="I_Conducted_PostMortem">Yes</label>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <label className="form-label" htmlFor="Other">Other (specify)</label>
                        </div>
                        <div className="col">
                            <input
                                type="text"
                                className="form-control"
                                id="Other"
                                name="Other"
                                value={formData.Other}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Examined By Section */}
                    <div className="row">
                        <div className="col">
                            <label className="form-label" htmlFor="examinedBy">Examined By</label>
                        </div>
                        <div className="col">
                            <input
                                type="text"
                                className="form-control"
                                id="examinedBy"
                                name="examinedBy"
                                value={formData.examinedBy}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>

                    <br />
                    {/* Submit Button */}
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
                <br />
                <br />
                <br />
                <br />
                <FormFooter />
            </div>
            <EventListModal setFormData={setFormData} onDelete={fetchStats} />
        </>
    );
};

export default MedFormDeath;