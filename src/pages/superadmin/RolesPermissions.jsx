// Superadmin page to manage roles, permissions, and their assignment
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchRoles, fetchPermissions, createRole, assignRoleToUser } from '../../features/rbac/rbacSlice';
import axiosClient from '../../api/axiosClient';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import InputField from '../../components/forms/InputField';

function RolesPermissions() {
  const dispatch = useAppDispatch();
  const { roles, permissions } = useAppSelector((state) => state.rbac);

  const [roleName, setRoleName] = useState('');
  const [roleDescription, setRoleDescription] = useState('');
  const [assignUserId, setAssignUserId] = useState('');
  const [assignRoleId, setAssignRoleId] = useState('');

  useEffect(() => {
    dispatch(fetchRoles());
    dispatch(fetchPermissions());
  }, [dispatch]);

  async function handleCreateRole(e) {
    e.preventDefault();
    await dispatch(createRole({ name: roleName, description: roleDescription }));
    setRoleName('');
    setRoleDescription('');
  }

  async function handleAssignRole(e) {
    e.preventDefault();
    await dispatch(assignRoleToUser({
      user_id: parseInt(assignUserId, 10),
      role_id: parseInt(assignRoleId, 10),
    }));
    setAssignUserId('');
    setAssignRoleId('');
  }

  async function handleAssignPermission(roleId, permissionId) {
    await axiosClient.post('/rbac/role-permissions', { role_id: roleId, permission_id: permissionId });
  }

  const roleColumns = [
    { key: 'name', label: 'Role' },
    { key: 'description', label: 'Description' },
  ];

  return (
    <div className="roles-permissions-page">
      <h2>Roles</h2>
      <form onSubmit={handleCreateRole} className="inline-form">
        <InputField label="Role Name" name="roleName" value={roleName} onChange={(e) => setRoleName(e.target.value)} required />
        <InputField label="Description" name="roleDescription" value={roleDescription} onChange={(e) => setRoleDescription(e.target.value)} />
        <Button type="submit">Create Role</Button>
      </form>
      <Table columns={roleColumns} data={roles} emptyMessage="No roles yet" />

      <h2>Assign Role to User</h2>
      <form onSubmit={handleAssignRole} className="inline-form">
        <InputField label="User ID" type="number" name="assignUserId" value={assignUserId} onChange={(e) => setAssignUserId(e.target.value)} required />
        <select value={assignRoleId} onChange={(e) => setAssignRoleId(e.target.value)} required>
          <option value="">Select Role</option>
          {roles.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
        </select>
        <Button type="submit">Assign</Button>
      </form>

      <h2>Permissions</h2>
      <ul>
        {permissions.map((p) => <li key={p.id}>{p.name} - {p.description}</li>)}
      </ul>

      <h3>Assign Permission to Role</h3>
      <p>Use the role list above with permission dropdown to link access as needed via the role-permissions endpoint.</p>
    </div>
  );
}

export default RolesPermissions;