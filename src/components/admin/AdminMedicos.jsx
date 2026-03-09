import { Stethoscope } from "lucide-react";
import AdminCardList from "./AdminCardList";

const AdminMedicos = () => {
    return (
        <AdminCardList
            title="Médicos"
            icon={<Stethoscope size={22} />}
            endpoint="/medicos"
            colorClass="text-info"
        />
    );
};

export default AdminMedicos;
