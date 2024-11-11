import React from "react";
import ModalForVideos from "../../components/modalForVideos";
import Button from "../../components/buttonComponent";
import TextareaComponent from "../../components/textAreaComponent";
import Checkbox from "../../components/checkBoxComponent";

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
          <video controls className="w-full h-full rounded-xl mb-2">
            <source src={selectedVideo} type="video/webm" />
            Your browser does not support the video tag.
          </video>

          <div className="flex flex-col w-full h-[500px] max-w-md">
          <div className="bg-gray-100 h-2/3 p-6 rounded-lg shadow-lg border border-gray-200 overflow-y-auto">
            <h3 className="text-xl font-bold text-neutral-600 mb-4">Questions</h3>
             {questions.map((question, index) => (
             <div
               key={index}
               className="mb-4 p-3 bg-gray-50 hover:bg-[#80ACD2] rounded-md transition duration-300 ease-in-out"
             >
              <p className="text-gray-800 font-medium text-sm">
                Q{index + 1}: {question.questionText}
              </p>
          </div>
             ))}
          </div>
         
              {/* Not alanı */}
            <TextareaComponent
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Enter note here..."
              className="bg-gray-50 shadow-lg rounded-lg p-4 w-full h-32 resize-none bg-white border border-[#c3c8cf]"
            />
           
           {/* Passed ve Failed butonları */}
            <div className="flex justify-start items-center mt-2">
             <Checkbox id="passedStatus" label="Passed" checked={status === "passed"} onChange={() => toggleStatus("passed")} className="accent-[#4B8D75]" labelClassName="mr-4 text-gray-700 font-medium"/>
             <Checkbox id="failedStatus" label="Failed" checked={status === "failed"} onChange={() => toggleStatus("failed")} className="accent-[#D9534F] " labelClassName="ml-2 text-gray-700 font-medium"/>
            </div>
          </div>
        </div>

        {/* Kaydet butonu */}
        <div className="flex gap-4 justify-end mt-4">
          <Button label="Save" onClick={handleSaveNote} variant="outline" size="md" />
        </div>
      </div>
    </ModalForVideos>
  );
};

export default VideoPopupContent;
