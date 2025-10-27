// src/components/QuizModal.jsx
import React, { useState } from 'react';
import { getQuizData } from '../quizData'; // Import quiz data loader

const PASSING_PERCENTAGE = 70; // Set the passing threshold

function QuizModal({ topicId, topicTitle, onClose, onQuizPassed }) {
  const allQuizData = getQuizData();
  const questions = allQuizData[topicId] || []; // Get questions for the specific topic
  const [currentAnswers, setCurrentAnswers] = useState({}); // { questionId: selectedOptionIndex }
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [passed, setPassed] = useState(false);

  if (!questions.length) {
    // Handle case where no questions exist for the topic
    return (
      <div className="modal-backdrop">
        <div className="quiz-modal">
          <h2>Quiz for: {topicTitle}</h2>
          <p>No quiz questions available for this topic yet.</p>
          <button onClick={onClose} className='quiz-button'>Close</button>
        </div>
      </div>
    );
  }

  const handleOptionChange = (questionId, optionIndex) => {
    setCurrentAnswers({
      ...currentAnswers,
      [questionId]: optionIndex,
    });
  };

  const handleSubmit = () => {
    let correctCount = 0;
    questions.forEach(q => {
      if (currentAnswers[q.id] === q.correct) {
        correctCount++;
      }
    });

    const calculatedScore = (correctCount / questions.length) * 100;
    const didPass = calculatedScore >= PASSING_PERCENTAGE;

    setScore(calculatedScore);
    setPassed(didPass);
    setShowResults(true);

    if (didPass) {
      onQuizPassed(); // Call the callback function if passed
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}> {/* Close if backdrop is clicked */}
      <div className="quiz-modal" onClick={(e) => e.stopPropagation()}> {/* Prevent closing when clicking inside modal */}
        <h2>Quiz: {topicTitle}</h2>

        {!showResults ? (
          <>
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
              {questions.map((q, index) => (
                <div key={q.id} className="quiz-question">
                  <p><strong>{index + 1}. {q.q}</strong></p>
                  <div className="quiz-options">
                    {q.options.map((option, optIndex) => (
                      <label key={optIndex} className="quiz-option-label">
                        <input
                          type="radio"
                          name={q.id}
                          value={optIndex}
                          checked={currentAnswers[q.id] === optIndex}
                          onChange={() => handleOptionChange(q.id, optIndex)}
                          required // Make sure an option is selected
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
              <button type="submit" className='quiz-button submit'>Submit Answers</button>
              <button type="button" onClick={onClose} className='quiz-button cancel'>Cancel</button>
            </form>
          </>
        ) : (
          <div className="quiz-results">
            <h3>Quiz Results</h3>
            <p className={`score ${passed ? 'passed' : 'failed'}`}>
              Your Score: {score.toFixed(0)}%
            </p>
            {passed ? (
              <p className="result-message passed">Congratulations! You passed. Topic unlocked!</p>
            ) : (
              <p className="result-message failed">
                Keep studying! You need {PASSING_PERCENTAGE}% to pass.
              </p>
            )}
            <button onClick={onClose} className='quiz-button'>Close</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default QuizModal;