import React, { useContext,useEffect, useState } from 'react';
// import { ProfileContext } from '../ProfileContext';

const MCQList = () => {
    // const { profile } = useContext(ProfileContext);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Replace this with the actual user profile data you want to send
    // if (!profile) return;

    fetch('http://localhost:8000/generate_mcq/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify()
    })
      .then(res => res.json())
      .then(data => {
        console.log("MCQ Data: ", data);
        if (data.questions) {
          setQuestions(data.questions);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching MCQs:', error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading MCQs...</div>;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Multiple Choice Questions</h2>
      {questions.map((q, index) => (
        <div key={index} className="mb-6 p-4 border rounded-lg shadow-sm">
          <p className="font-medium mb-2">
            Q{index + 1}. {q.question}
          </p>
          {q.options.map((option, optIndex) => (
            <div key={optIndex} className="ml-4 mb-1">
              <label>
                <input
                  type="radio"
                  name={`question-${index}`}
                  className="mr-2"
                />
                {option}
              </label>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default MCQList;
