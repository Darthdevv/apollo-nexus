import './App.css'
import { useQuery, gql } from '@apollo/client'

function App() {


  const GET_USERS = gql`
    query GetUsers {
      users {
        id
        name
        email
      }
    }
  `;

  const { loading, error, data } = useQuery(GET_USERS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data || !data.users) return <p>No users found</p>;


  return (
    <>
      <h1>Users</h1>
      <div>
        <ul>
          {data.users.map((user: { id: string; name: string; email: string }) => (
            <li key={user.id}>
              <strong>{user.name}</strong> - {user.email}
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

export default App
