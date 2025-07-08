import { motion } from "framer-motion";
import type { FC } from "react";

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  name: string;
  email: string;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  isEditing: boolean;
  loading: boolean;
}

const UserFormModal: FC<UserFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  name,
  email,
  onNameChange,
  onEmailChange,
  isEditing,
  loading,
}) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center bg-black/50 dark:bg-white/10 z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="bg-background p-6 rounded-lg w-full max-w-md shadow-lg space-y-4 border border-border"
      >
        <h2 className="text-lg font-semibold mb-2">
          {isEditing ? "Edit User" : "Add New User"}
        </h2>
        <input
          type="text"
          placeholder="Name"
          className="border border-border bg-cardcolor rounded-lg p-2 w-full text-base"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          className="border border-border bg-cardcolor rounded-lg p-2 w-full text-base"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
        />
        <div className="flex justify-end space-x-2 mt-4">
          <button
            onClick={onClose}
            className="text-foreground border px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="bg-foreground text-background px-4 py-2 rounded"
            disabled={loading}
          >
            {isEditing ? "Update" : "Create"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default UserFormModal;
