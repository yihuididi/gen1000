import { useEffect, useState } from 'react';
import { createNewOrganization } from '../backend/organization';
import { getAllUsers, getUserOrganizations } from '../backend/user';
import '../../static/css/home/organizations.css';

export const Organizations = ({ user }) => {
    const [organizations, setOrganizations] = useState([]);
    const [users, setUsers] = useState([]);
    const [form, setForm] = useState({
        name: '',
        members: []
    });

    useEffect(() => {
        const fetchData = async () => {
            const allUsers = await getAllUsers();
            setUsers(allUsers);
            const userOrganizations = await getUserOrganizations(user);
            setOrganizations(userOrganizations);
        };

        if (user) {
            fetchData();
        }
    }, [user]);

    const createNewOrganizationFormHandler = async () => {
        await createNewOrganization(form.name, form.members);
        const userOrganizations = await getUserOrganizations(user);
        setOrganizations(userOrganizations);
    }

    const updateName = (e) => {
        setForm({ ...form, name: e.target.value });
    }

    const updateSelectedMembers = (e) => {
        const selected = Array.from(e.target.selectedOptions).map((option) => option.value);
        setForm({ ...form, members: selected });
    };

    return (
        <div className="organizations">
            <button className="btn btn-dark" data-bs-toggle="modal" data-bs-target="#form">
                New Organization
            </button>
            <div className="modal fade" id="form" tabIndex="-1" aria-labelledby="new-organization-label" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="new-organization-label">Create New Organization</h1>
                            <button className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">Organization Name</label>
                                <input type="text" className="form-control" id="name" value={form.name} onChange={updateName}></input>
                            </div>
                            <select className="form-select mb-3" multiple aria-label="Users" defaultValue={[user]} onChange={updateSelectedMembers}>
                                {users.map(u => (
                                    <option key={u.id} value={u.id}>{u.email}</option>
                                ))}
                            </select>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button className="btn btn-dark" onClick={createNewOrganizationFormHandler}>Create</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card-container">
                {organizations?.map(organization => (
                    <div className="card" key={organization.id}>
                        <img src={organization.wallpaper} alt="wallpaper"></img>
                        <div className="card-content">
                            <h3>{organization.name}</h3>
                            <p>test</p>
                            <a href="#" className="btn">Enter</a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};