import React, { useState } from "react";
import useInterviewStore from "../../stores/InterviewListPageStore";
import Modal from "../../components/modal";
import TextInputComponent from "../../components/textInputComponent";
import DateInputComponent from "../../components/dateInputComponent";
import Button from "../../components/buttonComponent";
import Dropdown from "../../components/dropDownComponent";
const AddInterviewModal = ({ isOpen, onClose }) => {
  const {
    setInterviewTitle,
    setPackageId,
    setExpireDate,
    addInterview,
    currentInterview,
  } = useInterviewStore();
  const handleAddInterview = () => {
    addInterview();
    onClose();
  };
  const packages = ["Backend", "Fronend"]
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Create Interview">
        <TextInputComponent value={currentInterview.interviewTitle} onChange={(e) => setInterviewTitle(e.target.value)} textInputHeader="Title"/>
        <Dropdown label="Package" value={currentInterview.packageId} onChange={(value) => setPackageId(value)} options={packages} />
        <DateInputComponent onChange={(e) => setExpireDate(e.target.value)} value={currentInterview.expireDate} dateInputHeader="Expire Date"/>
        <div className="flex justify-end">
          <Button onClick={handleAddInterview} size="md" variant="secondary" rounded="rounded-md" type="button" label="Add" />
        </div>
      </Modal>
    </>
  );
};
export default AddInterviewModal;