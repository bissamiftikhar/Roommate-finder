import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from './ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { Search, MoreVertical, UserCheck, UserX, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { adminApi } from '../services/api';

interface Student {
  student_id: string;
  student_email: string;
  status: 'active' | 'inactive' | 'suspended';
  created_at: string;
  last_login: string | null;
  profile: any;
}

export function AdminUsersView() {
  const [users, setUsers] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<Student | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await adminApi.getUsers();
      setUsers(response.data);
    } catch (error: any) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (userId: string, status: string) => {
    try {
      await adminApi.updateUserStatus(userId, status);
      toast.success(`User status updated to ${status}`);
      fetchUsers();
    } catch (error: any) {
      toast.error('Failed to update user status');
    }
  };

  const handleDelete = async () => {
    if (!userToDelete) return;

    try {
      await adminApi.deleteUser(userToDelete.student_id);
      toast.success('User deleted successfully');
      setDeleteDialogOpen(false);
      setUserToDelete(null);
      fetchUsers();
    } catch (error: any) {
      toast.error('Failed to delete user');
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.student_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.profile?.bio || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeUsersCount = users.filter((u) => u.status === 'active').length;
  const suspendedUsersCount = users.filter((u) => u.status === 'suspended').length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge>Active</Badge>;
      case 'suspended':
        return <Badge variant="destructive">Suspended</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inactive</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return <div className="p-8">Loading users...</div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto relative">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Manage Users</h1>
        <p className="text-muted-foreground">
          View and manage all registered students
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl">{users.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl text-green-600">{activeUsersCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Suspended</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl text-red-600">{suspendedUsersCount}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-visible">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>All Users</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="overflow-visible">
          {filteredUsers.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No users found</p>
          ) : (
            <div className="overflow-x-auto overflow-y-visible">
              <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Profile</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Registered</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.student_id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{user.student_email}</p>
                        <p className="text-sm text-muted-foreground">
                          ID: {user.student_id.slice(0, 8)}...
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {user.profile ? (
                        <div>
                          <p className="text-sm">
                            {user.profile.age} • {user.profile.gender}
                          </p>
                          <p className="text-sm text-muted-foreground truncate max-w-xs">
                            {user.profile.bio || 'No bio'}
                          </p>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">No profile</span>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                    <TableCell>
                      {new Date(user.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {user.last_login
                        ? new Date(user.last_login).toLocaleDateString()
                        : 'Never'}
                    </TableCell>
                    <TableCell>
                      <div className="relative">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(openMenuId === user.student_id ? null : user.student_id);
                          }}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                        
                        {openMenuId === user.student_id && (
                          <>
                            <div 
                              className="fixed inset-0 z-40" 
                              onClick={() => setOpenMenuId(null)}
                            />
                            <div 
                              className="absolute right-0 top-full mt-1 w-48 bg-white shadow-lg border border-gray-200 rounded-lg py-1 z-50"
                            >
                              {user.status === 'active' ? (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenMenuId(null);
                                    handleUpdateStatus(user.student_id, 'suspended');
                                  }}
                                  className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-sm"
                                >
                                  <UserX className="h-4 w-4" />
                                  <span>Suspend User</span>
                                </button>
                              ) : (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenMenuId(null);
                                    handleUpdateStatus(user.student_id, 'active');
                                  }}
                                  className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-sm"
                                >
                                  <UserCheck className="h-4 w-4" />
                                  <span>Activate User</span>
                                </button>
                              )}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenMenuId(null);
                                  setUserToDelete(user);
                                  setDeleteDialogOpen(true);
                                }}
                                className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2 text-sm"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span>Delete User</span>
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the user account for{' '}
              <strong>{userToDelete?.student_email}</strong> and all their data.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              className="hover:bg-red-700"
              style={{ backgroundColor: '#dc2626', color: '#ffffff' }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
