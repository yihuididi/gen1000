import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createNewOrganization } from '../backend/organization';
import { getAllUsers, getUserOrganizations } from '../backend/user';
import { auth } from '../../firebase-config';
import '../../static/css/organization/organizations.css';

export const Organizations = () => {
    const [userId, setUserId] = useState("");
    const [organizations, setOrganizations] = useState([]);
    const [users, setUsers] = useState([]);
    const [form, setForm] = useState({
        name: '',
        members: []
    });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        auth.onAuthStateChanged((currentUser) => {
            setUserId(currentUser.uid);
        });
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const userData = await getAllUsers();
            setUsers(userData);
            const organizationData = await getUserOrganizations(userId);
            setOrganizations(organizationData);
            setLoading(false);
        };

        fetchData(); 
    }, [userId]);

    const createNewOrganizationFormHandler = async (e) => {
        e.preventDefault();
        await createNewOrganization(form.name, form.members);
        const userOrganizations = await getUserOrganizations(userId);
        setOrganizations(userOrganizations);
    }

    const updateName = (e) => {
        setForm({ ...form, name: e.target.value });
    }

    const updateSelectedMembers = (e) => {
        const selected = Array.from(e.target.selectedOptions).map((option) => option.value);
        setForm({ ...form, members: selected });
    };

    const navigateHandler = (e) => {
        const organization = e.target.value;
        navigate('/board', { state: organization });
    };

    return (
        <div className="organizations my-3">
            {loading ? (
                "Loading..."
            ) : (
                <>
                    <form>
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">Organization Name</label>
                            <input type="text" className="form-control" id="name" value={form.name} onChange={updateName}></input>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="members" className="form-label">Organization members</label>
                            <select className="form-select" multiple defaultValue={[userId]} onChange={updateSelectedMembers}>
                                {users.map(u => (
                                    <option key={u.id} value={u.id}>{u.email}</option>
                                ))}
                            </select>
                        </div>
                        <button className="btn btn-dark" onClick={createNewOrganizationFormHandler}>
                            New Organization
                        </button>
                    </form>

                    <div className="card-container">
                        {organizations?.map(organization => (
                            <div className="card" key={organization.id}>
                                <img src={organization.wallpaper} alt="wallpaper"></img>
                                <div className="card-content">
                                    <h3>{organization.name}</h3>
                                    <p>test</p>
                                    <button onClick={navigateHandler} className="btn" value={organization.id}>Enter</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};