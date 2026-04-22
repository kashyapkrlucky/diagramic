import Modal from "./Modal";

interface ConfirmBoxProps {
  isOpen: boolean;
  onSubmit: () => void;
  onClose: () => void;
  message: string;
}

export default function ConfirmBox({
  isOpen,
  onSubmit,
  onClose,
  message,
}: ConfirmBoxProps) {
  return (
    <Modal title="Confirm" isOpen={isOpen} onClose={onClose}>
      <div className="mb-4">{message}</div>
      <div className="flex justify-end gap-2">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          onClick={onSubmit}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Submit
        </button>
      </div>
    </Modal>
  );
}
