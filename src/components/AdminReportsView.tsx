import { useState } from 'react';
import { Report, User } from '../App';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { AlertTriangle, Eye, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

// Mock reports
const mockReports: Report[] = [
  {
    id: '1',
    reportedUser: {
      id: '4',
      email: 'emma.wilson@university.edu',
      name: 'Emma Wilson',
      role: 'student',
      profile: {
        age: 20,
        gender: 'Female',
        bio: 'Art student',
        university: 'State University',
        major: 'Fine Arts',
        year: 'Sophomore',
      },
    },
    reportedBy: {
      id: '2',
      email: 'sarah.johnson@university.edu',
      name: 'Sarah Johnson',
      role: 'student',
    },
    reason: 'Harassment',
    description: 'User sent inappropriate messages multiple times despite being asked to stop.',
    status: 'pending',
    createdAt: '2024-01-20',
  },
  {
    id: '2',
    reportedUser: {
      id: '7',
      email: 'john.doe@university.edu',
      name: 'John Doe',
      role: 'student',
      profile: {
        age: 23,
        gender: 'Male',
        bio: 'Engineering student',
        university: 'State University',
        major: 'Engineering',
        year: 'Senior',
      },
    },
    reportedBy: {
      id: '6',
      email: 'lisa.park@university.edu',
      name: 'Lisa Park',
      role: 'student',
    },
    reason: 'Fake Profile',
    description: 'Profile information seems fabricated. No verification of student status.',
    status: 'reviewed',
    createdAt: '2024-01-18',
  },
  {
    id: '3',
    reportedUser: {
      id: '8',
      email: 'suspicious@email.com',
      name: 'Suspicious User',
      role: 'student',
      profile: {
        age: 25,
        gender: 'Male',
        bio: 'Student',
        university: 'Unknown',
        major: 'Unknown',
        year: 'Unknown',
      },
    },
    reportedBy: {
      id: '3',
      email: 'mike.chen@university.edu',
      name: 'Mike Chen',
      role: 'student',
    },
    reason: 'Spam',
    description: 'Sending spam messages with external links.',
    status: 'action_taken',
    createdAt: '2024-01-15',
  },
];

export function AdminReportsView() {
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleViewReport = (report: Report) => {
    setSelectedReport(report);
    setDialogOpen(true);
  };

  const handleMarkReviewed = (reportId: string) => {
    // Mock API call - replace with your backend
    // fetch(`/api/admin/reports/${reportId}/review`, { method: 'POST' })

    setReports(
      reports.map((r) =>
        r.id === reportId ? { ...r, status: 'reviewed' as const } : r
      )
    );
    toast.success('Report marked as reviewed');
  };

  const handleTakeAction = (reportId: string) => {
    // Mock API call - replace with your backend
    // fetch(`/api/admin/reports/${reportId}/action`, { method: 'POST' })

    setReports(
      reports.map((r) =>
        r.id === reportId ? { ...r, status: 'action_taken' as const } : r
      )
    );
    toast.success('Action taken on report');
    setDialogOpen(false);
  };

  const handleDismiss = (reportId: string) => {
    // Mock API call - replace with your backend
    // fetch(`/api/admin/reports/${reportId}/dismiss`, { method: 'POST' })

    setReports(reports.filter((r) => r.id !== reportId));
    toast.success('Report dismissed');
    setDialogOpen(false);
  };

  const pendingCount = reports.filter((r) => r.status === 'pending').length;
  const reviewedCount = reports.filter((r) => r.status === 'reviewed').length;
  const actionTakenCount = reports.filter((r) => r.status === 'action_taken').length;

  const getStatusBadge = (status: Report['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="destructive">Pending</Badge>;
      case 'reviewed':
        return <Badge variant="secondary">Reviewed</Badge>;
      case 'action_taken':
        return <Badge>Action Taken</Badge>;
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1>Reports & Moderation</h1>
        <p className="text-muted-foreground">
          Monitor and take action on user reports
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl text-red-600">{pendingCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Reviewed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl text-yellow-600">{reviewedCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Action Taken</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl text-green-600">{actionTakenCount}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reported User</TableHead>
                <TableHead>Reported By</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>{report.reportedUser.name}</TableCell>
                  <TableCell>{report.reportedBy.name}</TableCell>
                  <TableCell>{report.reason}</TableCell>
                  <TableCell>{report.createdAt}</TableCell>
                  <TableCell>{getStatusBadge(report.status)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      onClick={() => handleViewReport(report)}
                      variant="outline"
                      size="sm"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {reports.length === 0 && (
            <div className="text-center py-12">
              <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No reports at this time</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Report Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Report Details</DialogTitle>
            <DialogDescription>
              Review the report and take appropriate action
            </DialogDescription>
          </DialogHeader>

          {selectedReport && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Reported User</p>
                  <p>{selectedReport.reportedUser.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedReport.reportedUser.email}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Reported By</p>
                  <p>{selectedReport.reportedBy.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedReport.reportedBy.email}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Reason</p>
                <p>{selectedReport.reason}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Description</p>
                <p>{selectedReport.description}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Date Reported</p>
                <p>{selectedReport.createdAt}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Current Status</p>
                {getStatusBadge(selectedReport.status)}
              </div>

              <div className="flex gap-2 pt-4">
                {selectedReport.status === 'pending' && (
                  <>
                    <Button
                      onClick={() => handleMarkReviewed(selectedReport.id)}
                      variant="outline"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark as Reviewed
                    </Button>
                    <Button
                      onClick={() => handleTakeAction(selectedReport.id)}
                    >
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Take Action (Suspend User)
                    </Button>
                  </>
                )}
                {selectedReport.status === 'reviewed' && (
                  <Button
                    onClick={() => handleTakeAction(selectedReport.id)}
                  >
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Take Action (Suspend User)
                  </Button>
                )}
                <Button
                  onClick={() => handleDismiss(selectedReport.id)}
                  variant="outline"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Dismiss Report
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
