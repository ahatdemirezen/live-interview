import React from "react";
import ModalForVideos from "../../components/modalForVideos";

const VideoPopupContent = ({
  isOpen,
  onClose,
  selectedVideo,
  questions,
  note,
  setNote,
  status,
  toggleStatus,
  handleSaveNote,
  
}) => {
  return (
    <ModalForVideos isOpen={isOpen} onClose={onClose} title="Interview Video">
      <div className="flex flex-col w-full gap-4 h-full">
        <div className="flex flex-row h-full flex-grow gap-4">
          <video controls className="w-full h-[500px] rounded-lg mb-2">
            <source src={selectedVideo} type="video/webm" />
            Your browser does not support the video tag.
          </video>

          <div className="flex flex-col w-full h-[500px] max-w-md">
            <div className="bg-gray-100 h-2/3 p-4 rounded-tl-lg rounded-tr-lg border overflow-y-auto">
              <h3 className="text-lg font-semibold mb-2">Questions</h3>
              {questions.map((question, index) => (
                <div key={index} className="mb-2">
                  <p className="text-gray-700 text-sm">
                    Q{index + 1}: {question.questionText}
                  </p>
                </div>
              ))}
            </div>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Enter note here..."
              className="w-full h-1/3 p-2 border rounded-bl-lg rounded-br-lg"
            ></textarea>
          </div>
        </div>

        <div className="flex justify-start items-center mt-2">
          <label htmlFor="passedStatus" className="inline-flex items-center mr-4">
            <input
              type="checkbox"
              id="passedStatus"
              checked={status === "passed"}
              onChange={() => toggleStatus("passed")}
              className="form-checkbox h-5 w-5 text-green-500"
            />
            <span className="ml-2 text-gray-600">Passed</span>
          </label>

          <label htmlFor="failedStatus" className="inline-flex items-center">
            <input
              type="checkbox"
              id="failedStatus"
              checked={status === "failed"}
              onChange={() => toggleStatus("failed")}
              className="form-checkbox h-5 w-5 text-red-500"
            />
            <span className="ml-2 text-gray-600">Failed</span>
          </label>
        </div>

        <div className="flex gap-4 justify-end mt-4">
          <button
            onClick={handleSaveNote}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded shadow-lg"
          >
            Save
          </button>
          
        </div>
      </div>
    </ModalForVideos>
  );
};

export default VideoPopupContent;
