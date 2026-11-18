// app/dashboard/page.tsx
"use client";

import { clearTokens } from "@/lib/auth";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  LogOut,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
  X,
} from "lucide-react";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { apiClient } from "@/lib/api";
import { CONFIG } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Department {
  department_id: number;
  department_name: string;
  id?: number;
  created_at?: string;
  updated_at?: string;
}

const DEPARTMENTS_ENDPOINT = "/departments";

export default function DashboardPage() {
  const router = useRouter();
  const { isChecking } = useAuthGuard({ requireAuth: true });

  // Data states
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form states (Create and Update)
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [departmentName, setDepartmentName] = useState("");

  // READ (All Departments)
  const fetchDepartments = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await apiClient<Department[]>(DEPARTMENTS_ENDPOINT, {
        method: "GET",
        requiresAuth: true,
      });
      setDepartments(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch departments.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isChecking) {
      fetchDepartments();
    }
  }, [isChecking, fetchDepartments]);

  // READ (Single Department)
  const handleViewDepartment = async (departmentId: number) => {
    setError("");
    setSuccess("");
    try {
      const data = await apiClient<Department>(
        `${DEPARTMENTS_ENDPOINT}/${departmentId}`,
        {
          method: "GET",
          requiresAuth: true,
        }
      );
      setSelectedDepartment(data);
    } catch (err: any) {
      setError(err.message || "Failed to load department details.");
    }
  };

  // Open Form for CREATE
  const openCreateForm = () => {
    setEditingId(null);
    setDepartmentName("");
    setSelectedDepartment(null);
    setError("");
    setSuccess("");
    setIsFormOpen(true);
  };

  // Open Form for UPDATE
  const openEditForm = (dept: Department) => {
    const id = dept.department_id ?? dept.id!;
    setEditingId(id);
    setDepartmentName(dept.department_name);
    setSelectedDepartment(null);
    setError("");
    setSuccess("");
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setDepartmentName("");
  };

  // CREATE & UPDATE Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      // Aligned with the database schema columns (department_name)
      const payload = {
        department_name: departmentName,
      };

      if (editingId !== null) {
        // UPDATE
        await apiClient(`${DEPARTMENTS_ENDPOINT}/${editingId}`, {
          method: "PUT",
          requiresAuth: true,
          body: JSON.stringify(payload),
        });
        setSuccess(`Department #${editingId} updated successfully.`);
      } else {
        // CREATE
        await apiClient(DEPARTMENTS_ENDPOINT, {
          method: "POST",
          requiresAuth: true,
          body: JSON.stringify(payload),
        });
        setSuccess("New department created successfully.");
      }

      closeForm();
      await fetchDepartments();
    } catch (err: any) {
      setError(err.message || "Operation failed.");
    } finally {
      setSubmitting(false);
    }
  };

  // DELETE
  const handleDelete = async (departmentId: number) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete Department #${departmentId}?`
    );
    if (!confirmed) return;

    setError("");
    setSuccess("");
    try {
      await apiClient(`${DEPARTMENTS_ENDPOINT}/${departmentId}`, {
        method: "DELETE",
        requiresAuth: true,
      });

      const selectedId =
        selectedDepartment?.department_id ?? selectedDepartment?.id;
      if (selectedId === departmentId) {
        setSelectedDepartment(null);
      }
      setSuccess(`Department #${departmentId} deleted successfully.`);
      await fetchDepartments();
    } catch (err: any) {
      setError(err.message || "Failed to delete department.");
    }
  };

  const handleLogout = () => {
    clearTokens();
    router.push(CONFIG.ROUTES.LOGIN);
  };

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-slate-100">
        <p className="text-sm text-slate-400">Verifying session...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-8 bg-black text-slate-100">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Top Navbar */}
        <header className="flex justify-between items-center border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Dashboard
            </h1>
            <p className="text-sm text-slate-400">
              Manage organization departments
            </p>
          </div>
          <Button variant="destructive" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </header>

        {/* Status Notifications */}
        {error && (
          <div className="p-3 text-sm text-red-400 bg-red-950/40 rounded-md border border-red-900/60">
            {error}
          </div>
        )}
        {success && (
          <div className="p-3 text-sm text-emerald-400 bg-emerald-950/40 rounded-md border border-emerald-900/60">
            {success}
          </div>
        )}

        {/* CREATE / UPDATE Form Card */}
        {isFormOpen && (
          <Card className="bg-slate-950 border-slate-800 text-slate-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-white">
                  {editingId !== null
                    ? `Update Department #${editingId}`
                    : "Create New Department"}
                </CardTitle>
                <CardDescription className="text-slate-400">
                  {editingId !== null
                    ? "Modify the department name below."
                    : "Fill in the details to add a new department."}
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={closeForm}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="department_name" className="text-slate-300">
                    Department Name
                  </Label>
                  <Input
                    id="department_name"
                    placeholder="e.g. Information Technology"
                    value={departmentName}
                    onChange={(e) => setDepartmentName(e.target.value)}
                    className="bg-black border-slate-800 text-white placeholder:text-slate-600 focus-visible:ring-slate-700"
                    required
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={closeForm}
                    className="border-slate-800 bg-black text-slate-300 hover:bg-slate-900 hover:text-white"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="bg-white text-black hover:bg-slate-200"
                  >
                    {submitting
                      ? "Saving..."
                      : editingId !== null
                      ? "Save Changes"
                      : "Create Department"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* READ Single Item Details Card */}
        {selectedDepartment && (
          <Card className="bg-slate-950 border-slate-800 text-slate-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-white">
                  Department Details (#
                  {selectedDepartment.department_id ?? selectedDepartment.id})
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Fetched directly from backend API
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedDepartment(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-slate-400 block">Department ID</span>
                <span className="font-medium text-white">
                  {selectedDepartment.department_id ?? selectedDepartment.id}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Department Name</span>
                <span className="font-medium text-white">
                  {selectedDepartment.department_name}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Created At</span>
                <span className="font-medium text-white">
                  {selectedDepartment.created_at
                    ? new Date(
                        selectedDepartment.created_at
                      ).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Departments Table Card */}
        <Card className="bg-slate-950 border-slate-800 text-slate-100">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-white">Departments</CardTitle>
              <CardDescription className="text-slate-400">
                A list of all departments stored in the backend.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={fetchDepartments}
                disabled={loading}
                className="border-slate-800 bg-black text-slate-300 hover:bg-slate-900 hover:text-white"
              >
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
                />
                Read / Refresh
              </Button>
              <Button
                onClick={openCreateForm}
                className="bg-white text-black hover:bg-slate-200"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Department
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-slate-800 overflow-hidden">
              <Table>
                <TableHeader className="bg-black">
                  <TableRow className="border-slate-800 hover:bg-transparent">
                    <TableHead className="w-[90px] text-slate-400">
                      ID
                    </TableHead>
                    <TableHead className="text-slate-400">
                      Department Name
                    </TableHead>
                    <TableHead className="text-slate-400">
                      Created At
                    </TableHead>
                    <TableHead className="text-right text-slate-400">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow className="border-slate-800">
                      <TableCell
                        colSpan={4}
                        className="h-24 text-center text-slate-500"
                      >
                        Loading departments...
                      </TableCell>
                    </TableRow>
                  ) : departments.length === 0 ? (
                    <TableRow className="border-slate-800">
                      <TableCell
                        colSpan={4}
                        className="h-24 text-center text-slate-500"
                      >
                        No departments found. Click &quot;Create Department&quot;
                        to add one.
                      </TableCell>
                    </TableRow>
                  ) : (
                    departments.map((dept) => {
                      const deptId = dept.department_id ?? dept.id!;
                      return (
                        <TableRow
                          key={deptId}
                          className="border-slate-800 hover:bg-slate-900/50"
                        >
                          <TableCell className="font-medium text-white">
                            {deptId}
                          </TableCell>
                          <TableCell className="text-slate-300">
                            {dept.department_name}
                          </TableCell>
                          <TableCell className="text-slate-400">
                            {dept.created_at
                              ? new Date(dept.created_at).toLocaleDateString()
                              : "-"}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewDepartment(deptId)}
                                className="border-slate-800 bg-black text-slate-300 hover:bg-slate-900 hover:text-white"
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                Read
                              </Button>
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => openEditForm(dept)}
                                className="bg-slate-800 text-slate-100 hover:bg-slate-700"
                              >
                                <Pencil className="w-4 h-4 mr-1" />
                                Update
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDelete(deptId)}
                              >
                                <Trash2 className="w-4 h-4 mr-1" />
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}