import type { ApolloError } from "@apollo/client";
import { motion } from "framer-motion";
import type { FC } from "react";

interface UserDetailsModalProps {
  isOpen: boolean;
  user?: { id: string; name: string; email: string };
  loading: boolean;
  error?: ApolloError;
  onClose: () => void;
}

const UserDetailsModal: FC<UserDetailsModalProps> = ({
  isOpen,
  onClose,
  user,
  loading,
  error,
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
        <h2 className="text-xl font-bold">User Details</h2>
        {loading ? (
          <p className="text-center">Loading user...</p>
        ) : error ? (
          <p className="text-center text-red-500">Error: {error.message}</p>
        ) : user?.name && user?.email ? (
          <>
            <p>
              <span className="font-semibold">Name:</span> {user?.name}
            </p>
            <p>
              <span className="font-semibold">Email:</span> {user?.email}
            </p>
          </>
        ) : (
          <p className="text-center">User not found</p>
        )}
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="bg-foreground text-background px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default UserDetailsModal;
