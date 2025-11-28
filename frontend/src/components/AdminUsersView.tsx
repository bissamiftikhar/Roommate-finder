import { useState } from 'react';
import { User } from '../App';
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
import { Search, MoreVertical, UserCheck, UserX, Mail } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

// Mock registered users
const mockUsers: (User & { status: 'active' | 'suspended'; registeredAt: string })[] = [
  {
    id: '2',
    email: 'sarah.johnson@university.edu',
    name: 'Sarah Johnson',
    role: 'student',
    status: 'active',
    registeredAt: '2024-01-15',
    profile: {
      age: 21,
      gender: 'Female',
      bio: 'Computer Science major',
      university: 'State University',
      major: 'Computer Science',
      year: 'Junior',
    },
  },
  {
    id: '3',
    email: 'mike.chen@university.edu',
    name: 'Mike Chen',
    role: 'student',
    status: 'active',
    registeredAt: '2024-01-16',
    profile: {
      age: 22,
      gender: 'Male',
      bio: 'Business major',
      university: 'State University',
      major: 'Business Administration',
      year: 'Senior',
    },
  },
  {
    id: '4',
    email: 'emma.wilson@university.edu',
    name: 'Emma Wilson',
    role: 'student',
    status: 'suspended',
    registeredAt: '2024-01-14',
    profile: {
      age: 20,
      gender: 'Female',
      bio: 'Art student',
      university: 'State University',
      major: 'Fine Arts',
      year: 'Sophomore',
    },
  },
  {
    id: '6',
    email: 'lisa.park@university.edu',
    name: 'Lisa Park',
    role: 'student',
    status: 'active',
    registeredAt: '2024-01-17',
    profile: {
      age: 22,
      gender: 'Female',
      bio: 'Psychology major',
      university: 'State University',
      major: 'Psychology',
      year: 'Junior',
    },
  },
];

export function AdminUsersView() {
  const [users, setUsers] = useState(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSuspend = (user: User) => {
    // Mock API call - replace with your backend
    // fetch(`/api/admin/users/${user.id}/suspend`, { method: 'POST' })

    setUsers(
      users.map((u) =>
        u.id === user.id ? { ...u, status: 'suspended' as const } : u
      )
    );
    toast.success(`${user.name} has been suspended`);
  };

  const handleActivate = (user: User) => {
    // Mock API call - replace with your backend
    // fetch(`/api/admin/users/${user.id}/activate`, { method: 'POST' })

    setUsers(
      users.map((u) =>
        u.id === user.id ? { ...u, status: 'active' as const } : u
      )
    );
    toast.success(`${user.name} has been activated`);
  };

  const handleDelete = (user: User) => {
    // Mock API call - replace with your backend
    // fetch(`/api/admin/users/${user.id}`, { method: 'DELETE' })

    setUsers(users.filter((u) => u.id !== user.id));
    toast.success(`${user.name} has been deleted`);
  };

  const handleSendEmail = (user: User) => {
    // Mock API call - replace with your backend
    // fetch(`/api/admin/users/${user.id}/email`, { method: 'POST' })

    toast.success(`Email sent to ${user.name}`);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeUsersCount = users.filter((u) => u.status === 'active').length;
  const suspendedUsersCount = users.filter((u) => u.status === 'suspended').length;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1>Manage Users</h1>
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
            <CardTitle className="text-sm">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl text-green-600">{activeUsersCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Suspended Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl text-red-600">{suspendedUsersCount}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Registered Students</CardTitle>
            <div className="relative w-72">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Major</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Registered</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.profile?.major}</TableCell>
                  <TableCell>{user.profile?.year}</TableCell>
                  <TableCell>
                    <Badge
                      variant={user.status === 'active' ? 'default' : 'destructive'}
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.registeredAt}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {user.status === 'active' ? (
                          <DropdownMenuItem onClick={() => handleSuspend(user)}>
                            <UserX className="w-4 h-4 mr-2" />
                            Suspend User
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => handleActivate(user)}>
                            <UserCheck className="w-4 h-4 mr-2" />
                            Activate User
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => handleSendEmail(user)}>
                          <Mail className="w-4 h-4 mr-2" />
                          Send Email
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(user)}
                          className="text-red-600"
                        >
                          <UserX className="w-4 h-4 mr-2" />
                          Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No users found matching your search
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
