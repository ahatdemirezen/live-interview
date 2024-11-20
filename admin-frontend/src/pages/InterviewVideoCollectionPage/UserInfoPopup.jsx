import React from "react";
import { FaUser, FaEnvelope, FaPhone } from "react-icons/fa";
import useInterviewStore from "../../stores/InterviewListPageStore";
import Modal from "../../components/modal";

const UserInfoPopup = () => {
  const { isUserInfoModalOpen, selectedUserInfo, closeUserInfoModal } = useInterviewStore();

  if (!isUserInfoModalOpen || !selectedUserInfo) return null;

  return (
    <Modal isOpen={isUserInfoModalOpen} onClose={closeUserInfoModal} title="Candidate Information">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <FaUser className="text-gray-500" />
            <p><strong className="text-gray-700">Name:</strong> {selectedUserInfo.name}</p>
          </div>
          <div className="flex items-center space-x-2">
            <FaUser className="text-gray-500" />
            <p><strong className="text-gray-700">Surname:</strong> {selectedUserInfo.surname}</p>
          </div>
          <div className="flex items-center space-x-2">
            <FaEnvelope className="text-gray-500" />
            <p><strong className="text-gray-700">Email:</strong> {selectedUserInfo.email}</p>
          </div>
          <div className="flex items-center space-x-2">
            <FaPhone className="text-gray-500" />
            <p><strong className="text-gray-700">Phone:</strong> {selectedUserInfo.phone}</p>
          </div>
          {/* Diğer bilgiler burada gösterilebilir */}
        </div>
      </div>
    </Modal>
  );
};

export default UserInfoPopup;
