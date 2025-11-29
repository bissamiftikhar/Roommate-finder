import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
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
  DialogFooter,
} from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { AlertTriangle, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { adminApi } from '../services/api';

interface Report {
  report_id: string;
  reporter_id: string | null;
  reported_id: string;
  reason: string;
  status: 'pending' | 'under_review' | 'resolved' | 'dismissed';
  admin_notes: string | null;
  created_at: string;
  resolved_at: string | null;
  reporter: any;
  reported: any;
}

export function AdminReportsView() {
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [adminNotes, setAdminNotes] = useState('');
  const [newStatus, setNewStatus] = useState<string>('');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await adminApi.getReports();
      setReports(response.data);
    } catch (error: any) {
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const handleViewReport = (report: Report) => {
    setSelectedReport(report);
    setAdminNotes(report.admin_notes || '');
    setNewStatus(report.status);
    setDialogOpen(true);
  };

  const handleUpdateReport = async () => {
    if (!selectedReport) return;

    try {
      await adminApi.updateReport(selectedReport.report_id, newStatus, adminNotes);
      toast.success('Report updated successfully');
      setDialogOpen(false);
      fetchReports();
    } catch (error: any) {
      toast.error('Failed to update report');
    }
  };

  const pendingCount = reports.filter((r) => r.status === 'pending').length;
  const underReviewCount = reports.filter((r) => r.status === 'under_review').length;
  const resolvedCount = reports.filter((r) => r.status === 'resolved').length;

  const getStatusBadge = (status: Report['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="destructive">Pending</Badge>;
      case 'under_review':
        return <Badge variant="secondary">Under Review</Badge>;
      case 'resolved':
        return <Badge>Resolved</Badge>;
      case 'dismissed':
        return <Badge variant="outline">Dismissed</Badge>;
    }
  };

  if (loading) {
    return <div className="p-8">Loading reports...</div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Reports & Moderation</h1>
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
            <CardTitle className="text-sm">Under Review</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl text-yellow-600">{underReviewCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Resolved</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl text-green-600">{resolvedCount}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            Recent Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          {reports.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No reports found</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Reported User</TableHead>
                  <TableHead>Reporter</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((report) => (
                  <TableRow key={report.report_id}>
                    <TableCell>
                      {new Date(report.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">
                          {report.reported?.bio || 'No name'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Age: {report.reported?.age || 'N/A'}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {report.reporter ? (
                        <div>
                          <p className="text-sm">
                            {report.reporter.bio || 'Anonymous'}
                          </p>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Anonymous</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <p className="max-w-xs truncate">{report.reason}</p>
                    </TableCell>
                    <TableCell>{getStatusBadge(report.status)}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewReport(report)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Report Details</DialogTitle>
            <DialogDescription>
              Review and take action on this report
            </DialogDescription>
          </DialogHeader>

          {selectedReport && (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Reported User</h4>
                <div className="p-3 bg-muted rounded">
                  <p><strong>Bio:</strong> {selectedReport.reported?.bio || 'N/A'}</p>
                  <p><strong>Age:</strong> {selectedReport.reported?.age || 'N/A'}</p>
                  <p><strong>Gender:</strong> {selectedReport.reported?.gender || 'N/A'}</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Report Reason</h4>
                <p className="p-3 bg-muted rounded">{selectedReport.reason}</p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Status</h4>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="under_review">Under Review</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="dismissed">Dismissed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Admin Notes</h4>
                <Textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add notes about your investigation or action taken..."
                  rows={4}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateReport}>
              Update Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
