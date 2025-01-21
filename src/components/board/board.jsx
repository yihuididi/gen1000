import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getOrganization } from '../backend/organization';
import { Tasks } from './tasks';
import '../../static/css/board/board.css';

export const Board = () => {
    const [loading, setLoading] = useState(true);
    const [organization, setOrganization] = useState({});
    const location = useLocation();
    const organizationId = location.state;

    useEffect(() => {
        const fetchData = async () => {
            const data = await getOrganization(organizationId);
            setOrganization(data);
            setLoading(false);
        };

        fetchData();
    }, [organizationId]);

    return (
        <div className="board">
            {loading ? (
                "Loading..."
            ) : (
                <>
                    <div className="container">
                        <h1>{organization.name}</h1>
                    </div>

                    <Tasks organizationId={organization.id} />
                </>
            )}
        </div>
    );
};