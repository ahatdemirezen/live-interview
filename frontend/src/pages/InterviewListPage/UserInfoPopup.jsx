import React from "react";
import useInterviewStore from "../../stores/InterviewListPageStore";
import Modal from "../../components/modal";

const UserInfoPopup = () => {
  const { isUserInfoModalOpen, selectedUserInfo, closeUserInfoModal } = useInterviewStore();

  if (!isUserInfoModalOpen || !selectedUserInfo) return null;

  return (
    <Modal isOpen={isUserInfoModalOpen} onClose={closeUserInfoModal} title="Candidate Information">
      <div>
        <p><strong className="text-netural-600">Name:</strong> {selectedUserInfo.name}</p>
        <p><strong className="text-netural-600">Surname:</strong> {selectedUserInfo.surname}</p>
        <p><strong className="text-netural-600">Email:</strong> {selectedUserInfo.email}</p>
        <p><strong className="text-netural-600">Phone:</strong> {selectedUserInfo.phone}</p>
        {/* Diğer bilgiler burada gösterilebilir */}
      </div>
    </Modal>
  );
};

export default UserInfoPopup;
