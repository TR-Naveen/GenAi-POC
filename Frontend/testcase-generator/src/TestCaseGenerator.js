import React, { useState } from 'react';
import './TestCaseGenerator.css';
import { handleserver } from './service';

function TestCaseGenerator() {
  const [codeInput, setCodeInput] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [totalTestCases, setTotalTestCases] = useState();
  const [positiveTestCases, setPositiveTestCases] = useState();
  const [negativeTestCases, setNegativeTestCases] = useState();
  const [scenario, setScenario] = useState('');
  const [associationProcess, setAssociationProcess] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false); 
  const [showPopup, setShowPopup] = useState(false);

  
  const handleClosePopup = () => 
  {
    setShowPopup(false);
    setIsModalOpen(false)
    setCodeInput('')
    setSelectedLanguage('')
    setTotalTestCases('')
    setPositiveTestCases('')
    setNegativeTestCases('')
    setScenario('')
    setAssociationProcess('')
  }
    

  const handleSubmit = async () => {
    if (codeInput !== '' && totalTestCases !== '' && positiveTestCases !== '' && negativeTestCases !== '') {
      setResult('');
      setIsLoading(true); 
      console.log(positiveTestCases+negativeTestCases,"total +ve and -ve")
      const prompt = `generate ${positiveTestCases+negativeTestCases} unit test cases automation code of ${positiveTestCases} positive and ${negativeTestCases} negative test cases in ${selectedLanguage} for the code ${codeInput} and ${associationProcess}`;

      try {
        const responseData = await handleserver(prompt);
        if (responseData && responseData.data_from_model) {
          setResult(responseData.data_from_model);
          setIsModalOpen(true);
        } else {
          console.error('Unexpected response format:', responseData);
          setResult('Unexpected response format from server');
        }
      } catch (error) {
        console.error('Failed to fetch result from server:', error);
        setResult('Error retrieving data from server');
      } finally {
        setIsLoading(false); 
      }
    }
    
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setShowPopup(true)
  }
  const handleReGenerate =  () => {
    setIsLoading(true);  
    handleSubmit(); 
    console.log('handleReGenerate clicked');
  };
  
  return (
    <div className="test-case-generator">
      <h2>Test-Case Generator</h2>

      <div className="top-page">
        <div className="input-section">
          <label>Enter Your Code Here:</label>
          <textarea
            value={codeInput}
            onChange={(e) => setCodeInput(e.target.value)}
            placeholder="Enter code here..."
          />
        </div>
        <br />
        <div className="language-and-test-cases">
          <div className="language-selection">
            <label>Select a Language:</label>
            <div className="languages">
              <div onClick={() => setSelectedLanguage('Java')} className={selectedLanguage === 'Java' ? 'active' : ''}>Java</div>
              <div onClick={() => setSelectedLanguage('Python')} className={selectedLanguage === 'Python' ? 'active' : ''}>Python</div>
              <div onClick={() => setSelectedLanguage('C#')} className={selectedLanguage === 'C#' ? 'active' : ''}>C#</div>
            </div>
          </div>
        </div>

        <div className="test-cases">
          {/* <label>Total Test Cases</label>
          <input
            type="number"
            value={totalTestCases}
            onChange={(e) => setTotalTestCases(Number(e.target.value))}
            placeholder="Enter total cases"
          /> */}
          <label>Positive Test Cases</label>
          <input
            type="number"
            value={positiveTestCases}
            onChange={(e) => setPositiveTestCases(Number(e.target.value))}
            placeholder="Enter positive cases"
          />
          <label>Negative Test Cases</label>
          <input
            type="number"
            value={negativeTestCases}
            onChange={(e) => setNegativeTestCases(Number(e.target.value))}
            placeholder="Enter negative cases"
          />
        </div>
      </div>

      <div className="scenario-section">
        <label>Type Scenario (Optional):</label>
        <textarea
          value={scenario}
          onChange={(e) => setScenario(e.target.value)}
          placeholder="Enter scenario here..."
        />
      </div>

      <div className="association-process-section">
        <label>Type Any Association Process (Optional):</label>
        <textarea
          value={associationProcess}
          onChange={(e) => setAssociationProcess(e.target.value)}
          placeholder="Enter association process here..."
        />
      </div>

      <button className="submit-button" onClick={handleSubmit}>Generate</button>
      
      {isLoading && (
        <div className="loader-wrapper">
          <span className="loader"></span>
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              Generated Test-Case :
              <button className="close-button" onClick={handleCloseModal}>✕</button>
            </div>
            <div className="modal-body">
              <pre>
                <code><p className="modal-body-p">{result}</p></code>
              </pre>
            </div>
            <button className="copy-button" onClick={handleCopy}>Copy</button>
            {showPopup && (
              <div className="popup-overlay">
                <div className="popup">
                  <button className="close-btn" onClick={handleClosePopup}>X</button>
                  <p>Text copied</p>
                </div>
              </div>
            )}
            <button className="copy-button" onClick={handleReGenerate}>Re-Generate</button>
            {isLoading && (
              <div className="loader-wrapper">
                <span className="loader"></span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default TestCaseGenerator;
