import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableItem = ({ question, handleDeleteQuestion }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: question._id
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="grid grid-cols-5 gap-4 items-center bg-gray-50 p-4 rounded-md shadow"
    >
      {/* Sıra numarası ve drag handle */}
      <div className="flex items-center justify-center">
        <span className="text-xl mr-2">{question.sequenceNumber}</span>
        {/* Drag Handle simgesi */}
        <span
          {...listeners}
          {...attributes}
          className="cursor-move text-gray-500 hover:text-gray-700"
        >
          ⠿ {/* Sürükle simgesi: üç çizgi */}
        </span>
      </div>
      
      {/* Soru Metni */}
      <div className="text-lg">{question.questionText}</div>
      
      {/* Süre Limiti */}
      <div className="text-lg">{question.timeLimit} min</div>
      
      {/* Silme Butonu */}
      <div className="flex items-center justify-center">
        <button
          onClick={() => handleDeleteQuestion(question._id)}  // question._id'yi kullanarak silme
          className="text-red-600 hover:text-red-800"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};

export default SortableItem;
