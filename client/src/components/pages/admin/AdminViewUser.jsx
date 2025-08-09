import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { UserRound, Trash2 } from 'lucide-react';
import gsap from 'gsap';

export default function AdminUserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const rowRefs = useRef([]);

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('http://localhost:9000/api/admin/admin-user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId, index) => {
  const confirmDelete = window.confirm('Are you sure you want to delete this user?');
  if (!confirmDelete) return;

  try {
    const token = localStorage.getItem('token');

    // Animate the row before deletion
    const row = rowRefs.current[index];
    if (row) {
      await gsap.to(row, {
        opacity: 0,
        y: -20,
        duration: 0.4,
        ease: 'power2.inOut',
      });
    }

    // Perform delete request
    await axios.delete(`http://localhost:9000/api/admin/delete-user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Remove from state after animation
    setUsers((prev) => prev.filter((u) => u._id !== userId));
  } catch (err) {
    console.error('Error deleting user:', err);
  }
};


  useEffect(() => {
    fetchUsers();
  }, []);

  // GSAP animation after users are loaded
  useEffect(() => {
    if (!loading && users.length > 0) {
      rowRefs.current.forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.5, delay: i * 0.1, ease: 'power2.out' }
        );
      });
    }
  }, [loading, users]);

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-indigo-700 mb-6 flex items-center gap-2">
        <UserRound className="w-7 h-7" />
        Registered Users
      </h1>

      {loading ? (
        <p className="text-gray-600">Loading users...</p>
      ) : users.length === 0 ? (
        <p className="text-gray-600">No users found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl shadow-md">
            <thead className="bg-indigo-100 text-indigo-700 text-left">
              <tr>
                <th className="py-3 px-5">Name</th>
                <th className="py-3 px-5">Email</th>
                <th className="py-3 px-5">Role</th>
                <th className="py-3 px-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr
                  key={user._id}
                  ref={(el) => (rowRefs.current[index] = el)}
                  className="border-t hover:bg-indigo-50 transition duration-150"
                >
                  <td className="py-3 px-5">{user.username}</td>
                  <td className="py-3 px-5">{user.email}</td>
                  <td className="py-3 px-5 capitalize">{user.role}</td>
                  <td className="py-3 px-5 text-center">
                    <button
                      onClick={() => handleDelete(user._id, index)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded flex items-center gap-1 mx-auto"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
