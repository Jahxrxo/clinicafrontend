import { Users } from "lucide-react";
import AdminCardList from "./AdminCardList";

const AdminPatients = () => {
  return (
    <AdminCardList
      title="Pacientes"
      icon={<Users size={22} />}
      endpoint="/pacientes"
      colorClass="text-success"
    />
  );
};

export default AdminPatients;
