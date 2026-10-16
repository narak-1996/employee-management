
import { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const API_URL = `${import.meta.env.VITE_API_URL}/employees`;

function App() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selected, setSelected] = useState(null);
    const [mode, setMode] = useState('');
    const [form, setForm] = useState({
        name: '',
        email: '',
        job_role: ''
    });

    const loadEmployees = async () => {
        try {
            const response = await axios.get(API_URL);
            const data = response.data;
            setEmployees(Array.isArray(data) ? data : data.data ?? []);
            setError('');
        } catch (err) {
            console.error(err.response?.data || err.message);
            setError('Could not load employees. Check your Laravel API.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadEmployees();
    }, []);

    const openView = (employee) => {
        setSelected(employee);
        setMode('view');
    };

    const openEdit = (employee) => {
        setSelected(employee);
        setForm({
            name: employee.name,
            email: employee.email,
            job_role: employee.job_role
        });
        setMode('edit');
    };

  const saveEmployee = async (e) => {
    e.preventDefault();

    try {
        if (mode === 'create') {
            await axios.post(API_URL, form);
        } else {
            await axios.put(`${API_URL}/${selected.id}`, form);
        }

        setMode('');
        setSelected(null);
        await loadEmployees();
    } catch (err) {
        alert(
            err.response?.data?.message ||
            'Unable to save employee.'
        );
    }
};

    const deleteEmployee = async (employee) => {
        if (!window.confirm(`Delete ${employee.name}?`)) return;

        try {
            await axios.delete(`${API_URL}/${employee.id}`);
            await loadEmployees();
        } catch (err) {
            alert(
                err.response?.data?.message ||
                'Unable to delete employee.'
            );
        }
    };

    const openCreate = () => {
    setForm({
        name: '',
        email: '',
        job_role: ''
    });

    setSelected(null);
    setMode('create');
    setError('');
};

    return (
        <div className="container py-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
    <h2 className="fw-bold mb-0">Employee Management</h2>

   <button
    type="button"
    className="btn btn-primary"
    onClick={() => {
        setForm({
            name: '',
            email: '',
            job_role: ''
        });

        setSelected(null);
        setError('');
        setMode('create');
    }}
>
    + Create Employee
</button>
</div>

            {error && <div className="alert alert-danger">{error}</div>}

            {loading ? (
                <p>Loading employees...</p>
            ) : (
                <div className="card border-0 shadow-sm">
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead className="table-dark">
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Job Role</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {employees.map((employee) => (
                                        <tr key={employee.id}>
                                            <td>{employee.id}</td>
                                            <td>{employee.name}</td>
                                            <td>{employee.email}</td>
                                            <td>{employee.job_role}</td>
                                            <td>
                                                <div className="d-flex gap-2">
                                                    <button
                                                        className="btn btn-sm btn-success"
                                                        onClick={() => openView(employee)}
                                                    >
                                                        View
                                                    </button>

                                                    <button
                                                        className="btn btn-sm btn-warning"
                                                        onClick={() => openEdit(employee)}
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        className="btn btn-sm btn-danger"
                                                        onClick={() => deleteEmployee(employee)}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}

                                    {employees.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="text-center py-4">
                                                No employees found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* View / Edit Modal */}
            
{/* Create / Edit / View Modal */}
{mode && (
    <div
        className="modal d-block"
        tabIndex="-1"
        role="dialog"
        style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
        <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">

                {/* Modal Header */}
                <div className="modal-header">
                    <h5 className="modal-title">
                        {mode === 'create'
                            ? 'Create Employee'
                            : mode === 'edit'
                                ? 'Edit Employee'
                                : 'Employee Details'}
                    </h5>

                    <button
                        type="button"
                        className="btn-close"
                        onClick={() => {
                            setMode('');
                            setSelected(null);
                        }}
                    />
                </div>

                {/* View Employee */}
                {mode === 'view' && selected && (
                    <>
                        <div className="modal-body">
                            <p><strong>ID:</strong> {selected.id}</p>
                            <p><strong>Name:</strong> {selected.name}</p>
                            <p><strong>Email:</strong> {selected.email}</p>
                            <p><strong>Job Role:</strong> {selected.job_role}</p>
                        </div>

                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => {
                                    setMode('');
                                    setSelected(null);
                                }}
                            >
                                Close
                            </button>
                        </div>
                    </>
                )}

                {/* Create / Edit Employee Form */}
                {(mode === 'create' || mode === 'edit') && (
                    <form onSubmit={saveEmployee}>
                        <div className="modal-body">

                            <div className="mb-3">
                                <label className="form-label">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={form.name}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            name: e.target.value
                                        })
                                    }
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    className="form-control"
                                    value={form.email}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            email: e.target.value
                                        })
                                    }
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">
                                    Job Role
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={form.job_role}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            job_role: e.target.value
                                        })
                                    }
                                    required
                                />
                            </div>

                        </div>

                        {/* Form Footer */}
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => {
                                    setMode('');
                                    setSelected(null);
                                }}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="btn btn-primary"
                            >
                                {mode === 'create'
                                    ? 'Create Employee'
                                    : 'Update Employee'}
                            </button>
                        </div>
                    </form>
                )}

            </div>
        </div>
    </div>
)}
           {/* {mode && (
                <div
                    className="modal d-block"
                    tabIndex="-1"
                    style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {mode === 'create'
                                        ? 'Create Employee'
                                        : mode === 'edit'
                                            ? 'Edit Employee'
                                            : 'Employee Details'}
                                </h5>
                                <button
                                    className="btn-close"
                                    onClick={() => setMode('')}
                                />
                            </div>

                            {mode === 'view' ? (
                                <div className="modal-body">
                                    <p><strong>ID:</strong> {selected.id}</p>
                                    <p><strong>Name:</strong> {selected.name}</p>
                                    <p><strong>Email:</strong> {selected.email}</p>
                                    <p><strong>Job Role:</strong> {selected.job_role}</p>
                                </div>
                            ) : (
                                <form onSubmit={saveEmployee}>
                                    <div className="modal-body">
                                        <div className="mb-3">
                                            <label className="form-label">Name</label>
                                            <input
                                                className="form-control"
                                                value={form.name}
                                                onChange={(e) => setForm({
                                                    ...form,
                                                    name: e.target.value
                                                })}
                                                required
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label">Email</label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                value={form.email}
                                                onChange={(e) => setForm({
                                                    ...form,
                                                    email: e.target.value
                                                })}
                                                required
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label">Job Role</label>
                                            <input
                                                className="form-control"
                                                value={form.job_role}
                                                onChange={(e) => setForm({
                                                    ...form,
                                                    job_role: e.target.value
                                                })}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="modal-footer">
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={() => setMode('')}
                                        >
                                            Cancel
                                        </button>

                                        <button type="submit" className="btn btn-primary">
                                            Update Employee
                                        </button>
                                    </div>
                                </form>
                            )}

                            {mode === 'view' && (
                                <div className="modal-footer">
                                    <button
                                        className="btn btn-secondary"
                                        onClick={() => setMode('')}
                                    >
                                        Close
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )} */}
        </div>
    );
}

export default App;