import "./App.css";
import { useQuery, useLazyQuery, useMutation, gql } from "@apollo/client";
import { useState } from "react";
import Card from "./components/Card";
import PlusIcon from "./assets/icons/PlusIcon";

// GraphQL queries & mutations
const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      email
    }
  }
`;

const GET_USER_BY_ID  = gql`
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
  const [createUser] = useMutation(CREATE_USER);
  const [updateUser] = useMutation(UPDATE_USER);
  const [deleteUser] = useMutation(DELETE_USER);
  const [getUserById] = useLazyQuery(GET_USER_BY_ID, {
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      if (data?.user) {
        setSelectedUser(data.user);
      }
    },
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedUser, setSelectedUser] = useState<null | {
    id: string;
    name: string;
    email: string;
  }>(null);

  const handleViewUser = (id: string) => {
    getUserById({ variables: { id } });
  };

  const openCreateModal = () => {
    setEditingUserId(null);
    setName("");
    setEmail("");
    setModalOpen(true);
  };

  const openEditModal = (user: { id: string; name: string; email: string }) => {
    setEditingUserId(user.id);
    setName(user.name);
    setEmail(user.email);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setName("");
    setEmail("");
    setEditingUserId(null);
  };

  const handleSubmit = async () => {
    if (!name || !email) return;

    if (editingUserId) {
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

  if (loading) return <p className="flex items-center justify-center">Loading...</p>;
  if (error) return <p className="flex items-center justify-center">Error: {error.message}</p>;
  if (!data || !data.users) return <p className="flex items-center justify-center">No users found</p>;

  return (
    <div className="p-6 w-full mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">User Management</h1>
        <button
          className="bg-cardcolor  text-white py-2 px-3 rounded text-xl"
          onClick={openCreateModal}
        >
          <PlusIcon />
        </button>
      </div>

      {/* User List */}
      <ul className="space-y-4">
        {data.users.map((user: { id: string; name: string; email: string }) => (
          <li key={user.id}>
            <Card
              name={user.name}
              email={user.email}
              onDelete={() => handleDelete(user.id)}
              onEdit={() => openEditModal(user)}
              onClick={() => handleViewUser(user.id)}
            />
          </li>
        ))}
      </ul>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 dark:bg-white/10 z-50">
          <div className="bg-background p-6 rounded-lg w-full max-w-md shadow-lg space-y-4 border border-border">
            <h2 className="text-lg font-semibold mb-2">
              {editingUserId ? "Edit User" : "Add New User"}
            </h2>
            <input
              type="text"
              placeholder="Name"
              className="border border-border bg-cardcolor rounded-lg p-2 w-full text-base"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              className="border border-border bg-cardcolor rounded-lg p-2 w-full text-base"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              >
                {editingUserId ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 dark:bg-white/10 z-50">
          <div className="bg-background p-6 rounded-lg w-full max-w-md shadow-lg border border-border space-y-4">
            <h2 className="text-xl font-bold">User Details</h2>
            <p>
              <span className="font-semibold">Name:</span> {selectedUser.name}
            </p>
            <p>
              <span className="font-semibold">Email:</span> {selectedUser.email}
            </p>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setSelectedUser(null)}
                className="bg-foreground text-background px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
