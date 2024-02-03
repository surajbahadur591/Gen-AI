import { UserButton } from "@clerk/nextjs";

const Dashboard = () => {
    return (
        <div>
            dashboard
            <UserButton afterSignOutUrl="/" />
        </div>
    );
}

export default Dashboard;