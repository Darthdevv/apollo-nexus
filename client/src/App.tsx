import "./App.css";
import { useQuery, useLazyQuery, useMutation } from "@apollo/client";
import { useState } from "react";
import Card from "./components/Card";
import PlusIcon from "./assets/icons/PlusIcon";
import { motion, AnimatePresence } from "framer-motion";
import UserFormModal from "./components/forms/UserFormModal";
import UserDetailsModal from "./components/forms/UserDetailsModal";
import {
  GET_USERS,
  GET_USER_BY_ID,
  CREATE_USER,
  UPDATE_USER,
  DELETE_USER,
} from "./graphql/userOperations";

function App() {
  const { loading, error, data, refetch } = useQuery(GET_USERS);
  const [createUser, { loading: creating }] = useMutation(CREATE_USER);
  const [updateUser, { loading: updating }] = useMutation(UPDATE_USER);
  const [deleteUser] = useMutation(DELETE_USER);
  const [
    getUserById,
    { loading: loadingUser, data: userData, error: errorUser },
  ] = useLazyQuery(GET_USER_BY_ID, { fetchPolicy: "network-only" });

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

      <AnimatePresence>
        <UserFormModal
          isOpen={modalOpen}
          onClose={closeModal}
          onSubmit={handleSubmit}
          name={form.name}
          email={form.email}
          onNameChange={(val) => setForm({ ...form, name: val })}
          onEmailChange={(val) => setForm({ ...form, email: val })}
          isEditing={!!editingUserId}
          loading={creating || updating}
        />
      </AnimatePresence>

      <AnimatePresence>
        <UserDetailsModal
          isOpen={!!viewingUserId}
          user={userData?.user}
          loading={loadingUser}
          error={errorUser}
          onClose={closeDetailModal}
        />
      </AnimatePresence>
    </div>
  );
}

export default App;
