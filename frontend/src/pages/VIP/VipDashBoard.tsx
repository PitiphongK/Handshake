import Navbar from "../../components/Navbar/Navbar"
import ProjectCard from "../../components/ProjectCard/ProjectCard";
import { useEffect, useState } from "react";
import apiClient from "../../services/apiClient";
import { ProjectData } from "../../interfaces/interfaces";
import { Search } from "lucide-react";
import { Spinner } from "@heroui/react";
import { AxiosError } from "axios";

const VipDashBoard = () => {
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    useEffect(() => {
        const fetchUserDetails = async () => {
            setIsLoading(true);
            try {
                const response = await apiClient.get('/api/projects/');
                setProjects(response.data);
                console.log(response.data);
                setIsLoading(false);
            } catch (err) {
                if (err instanceof AxiosError) {
                    console.log('Error fetching projects');
                    setIsLoading(false);
                }
            }
        };

        fetchUserDetails();
    }, []);
    return (
        <>
            <Navbar />
            {isLoading ? (
                <div className='flex w-screen h-60 flex-col justify-center items-center gap-5'>
                    <div className='flex gap-2'><Spinner size="lg" /></div>
                </div>
            ) : projects.length === 0 ? (
                <div className='flex w-screen h-60 flex-col justify-center items-center gap-5'>
                    <div className='flex gap-2'><Search size={30} /><p className='font-semibol'>No project found</p></div>
                </div>
            ) :
                (projects.map((project: ProjectData) => (
                    <ProjectCard
                        key={project.id}
                        id={project.id}
                        name={project.name}
                        description={project.description}
                        owner={project.owner}
                        members={project.members}
                        posts={project.posts}
                        date_created={project.date_created}
                    />
                )))
            }
        </>
    )
}

export default VipDashBoard