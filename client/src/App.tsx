import "./App.css";
import { useQuery, useLazyQuery, useMutation, gql } from "@apollo/client";
import { useState } from "react";
import Card from "./components/Card";
import PlusIcon from "./assets/icons/PlusIcon";
import { motion, AnimatePresence } from "framer-motion";

// GraphQL Queries & Mutations
const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      email
    }
  }
`;

const GET_USER_BY_ID = gql`
  query GetUserById($id: ID!) {
    user(id: $id) {
      id
      name
      email
    }
  }
`;

const CREATE_USER = gql`
  mutation CreateUser($name: String!, $email: String!) {
    createUser(name: $name, email: $email) {
      id
      name
      email
    }
  }
`;

const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $name: String, $email: String) {
    updateUser(id: $id, name: $name, email: $email) {
      id
      name
      email
    }
  }
`;

const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`;

function App() {
  const { loading, error, data, refetch } = useQuery(GET_USERS);
  const [createUser, { loading: creating }] = useMutation(CREATE_USER);
  const [updateUser, { loading: updating }] = useMutation(UPDATE_USER);
  const [deleteUser] = useMutation(DELETE_USER);
  const [
    getUserById,
    { loading: loadingUser, data: userData, error: errorUser },
  ] = useLazyQuery(GET_USER_BY_ID, {
    fetchPolicy: "network-only",
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "" });
  const [viewingUserId, setViewingUserId] = useState<string | null>(null);

  const openCreateModal = () => {
    setEditingUserId(null);
    setForm({ name: "", email: "" });
    setModalOpen(true);
  };

  const openEditModal = (user: { id: string; name: string; email: string }) => {
    setEditingUserId(user.id);
    setForm({ name: user.name, email: user.email });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingUserId(null);
    setForm({ name: "", email: "" });
  };

  const handleSubmit = async () => {
    const { name, email } = form;
    if (!name || !email) return;

    if (editingUserId) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const original = data.users.find((u: any) => u.id === editingUserId);
      if (original?.name === name && original?.email === email) {
        closeModal();
        return;
      }
      await updateUser({ variables: { id: editingUserId, name, email } });
    } else {
      await createUser({ variables: { name, email } });
    }

    closeModal();
    refetch();
  };

  const handleDelete = async (id: string) => {
    await deleteUser({ variables: { id } });
    refetch();
  };

  const handleViewUser = (id: string) => {
    setViewingUserId(id);
    getUserById({ variables: { id } });
  };

  const closeDetailModal = () => {
    setViewingUserId(null);
  };

  if (loading)
    return <p className="flex items-center justify-center">Loading...</p>;
  if (error)
    return (
      <p className="flex items-center justify-center">Error: {error.message}</p>
    );
  if (!data?.users)
    return <p className="flex items-center justify-center">No users found</p>;

  return (
    <div className="p-6 w-full mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">User Management</h1>
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="bg-cardcolor text-white py-2 px-3 rounded text-xl"
          onClick={openCreateModal}
        >
          <PlusIcon />
        </motion.button>
      </div>

      {/* User List */}
      <ul className="space-y-4">
        {data.users.map((user: { id: string; name: string; email: string }) => (
          <motion.li
            key={user.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Card
              name={user.name}
              email={user.email}
              onDelete={() => handleDelete(user.id)}
              onEdit={() => openEditModal(user)}
              onClick={() => handleViewUser(user.id)}
            />
          </motion.li>
        ))}
      </ul>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {modalOpen && (
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
                {editingUserId ? "Edit User" : "Add New User"}
              </h2>
              <input
                type="text"
                placeholder="Name"
                className="border border-border bg-cardcolor rounded-lg p-2 w-full text-base"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <input
                type="email"
                placeholder="Email"
                className="border border-border bg-cardcolor rounded-lg p-2 w-full text-base"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  onClick={closeModal}
                  className="text-foreground border px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="bg-foreground text-background px-4 py-2 rounded"
                  disabled={creating || updating}
                >
                  {editingUserId ? "Update" : "Create"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* User Detail Modal */}
      <AnimatePresence>
        {viewingUserId && (
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
              {loadingUser ? (
                <p className="text-center">Loading user...</p>
              ) : errorUser ? (
                <p className="text-center text-red-500">
                  Error: {errorUser.message}
                </p>
              ) : userData?.user ? (
                <>
                  <h2 className="text-xl font-bold">User Details</h2>
                  <p>
                    <span className="font-semibold">Name:</span>{" "}
                    {userData.user.name}
                  </p>
                  <p>
                    <span className="font-semibold">Email:</span>{" "}
                    {userData.user.email}
                  </p>
                </>
              ) : (
                <p className="text-center">User not found</p>
              )}

              <div className="flex justify-end mt-4">
                <button
                  onClick={closeDetailModal}
                  className="bg-foreground text-background px-4 py-2 rounded"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
