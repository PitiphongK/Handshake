import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Ellipsis, Search } from 'lucide-react';
import userImage from "../../assets/user.png";
import {
    Button,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
    Input,
    Select,
    SelectItem,
    Avatar,
    Form,
    Textarea,
    SharedSelection,
    addToast,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Spinner
} from "@heroui/react";
import Navbar from '../../components/Navbar/Navbar';
import apiClient from '../../services/apiClient';
import Post from '../../components/Post/Post';
import { UserData, PostData } from '../../interfaces/interfaces';
import { AxiosError } from 'axios';

interface ProjectProps {
    id: number;
    name: string;
    description: string;
    ownerImage: string;
    ownerName: string;
    members: number[];
    posts: number[];
    date: string;
}

const Vip = () => {
    const [users, setUsers] = useState<UserData[]>([]);
    const [selectedMembers, setSelectedMembers] = useState<Set<string>>(new Set());
    const { isOpen: isEditOpen, onOpen: onEditOpen, onOpenChange: onEditOpenChange } = useDisclosure();
    const { isOpen: isAddPostOpen, onOpen: onAddPostOpen, onOpenChange: onAddPostOpenChange } = useDisclosure();
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onOpenChange: onDeleteOpenChange } = useDisclosure();
    const [currentUserIsOwner, setCurrentUserIsOwner] = useState(false);
    const [project, setProject] = useState<ProjectProps>();
    const [isLoading, setIsLoading] = useState(true);
    const [posts, setPosts] = useState<PostData[]>([]);
    const [refreshPosts, setRefreshPosts] = useState(0);
    const [refreshProject, setRefreshProject] = useState(0);
    const navigate = useNavigate();
    const params = useParams();
    const id = params.id;

    useEffect(() => {
        const fetchProjectAndOwner = async () => {
            try {
                // First, fetch the project details
                const projectResponse = await apiClient.get(`/api/projects/${id}`);
                const projectData = projectResponse.data;
                console.log(projectData);

                // Then, fetch the owner details using the owner ID from the project
                const ownerResponse = await apiClient.get(`/api/user-profiles/${projectData.owner}`);
                const ownerData = ownerResponse.data;
                const user_id = localStorage.getItem('user_id');
                setCurrentUserIsOwner(Number(user_id) == ownerData.id);
                const dateObject = new Date(projectData.date_created);
                const dateOptions: Intl.DateTimeFormatOptions = {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                }
                const dateString = dateObject.toLocaleString("default", dateOptions);

                // Update the project state with both project and owner information
                setProject({
                    ...projectData,
                    ownerName: `${ownerData.first_name} ${ownerData.last_name}`,
                    ownerImage: ownerData.picture,
                    date: dateString
                });
                setSelectedMembers(new Set(projectData.members.map(String)));

                setIsLoading(false);
            } catch (err) {
                console.error(err);
                setIsLoading(false);
            }
        };

        fetchProjectAndOwner();

    }, [id, refreshProject]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await apiClient.get(`/api/posts/`);
                if (response.status === 200 && project) {
                    const filteredPosts = response.data.filter((post: PostData) =>
                        project.posts.includes(post.id)
                    );
                    setPosts(filteredPosts);
                    console.log("Filtered posts for project:", filteredPosts);
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchPosts();
    }, [refreshPosts, project]);

    const handleSelectionChange = (keys: SharedSelection) => {
        setSelectedMembers(new Set(keys as unknown as string[]));
    };

    const handleResetSelection = () => {
        setSelectedMembers(new Set());
    };

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await apiClient.get('/api/user-profiles/');
                setUsers(response.data);
            } catch (err) {
                if (err instanceof AxiosError) {
                    console.log('Error fetching profiles');
                }
            }
        };

        fetchUserDetails();
    }, []);

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData) as { name: string; description: string };

        // Now combine the form data with the selected members
        const submissionData = {
            ...data,
            members: Array.from(selectedMembers).map(id => Number(id)) // Convert Set to Array
        };
        try {
            const response = await apiClient.post("/api/edit-project/", {
                id: id,
                name: submissionData.name,
                description: submissionData.description,
                members: submissionData.members,
            })
            if (response.status === 200) {
                setRefreshProject(prev => prev + 1);
                addToast({
                    title: "Success",
                    description: "VIP has been updated successfully",
                    color: "success",
                    timeout: 3000,
                    classNames: {
                        base: "shadow-lg",
                    },
                });
            }
        } catch (err) {
            console.log(err);
        }

        onEditOpenChange();
    };

    const handleAddPost = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData) as { title: string; content: string };
        try {
            const response = await apiClient.post('/api/create-post/', {
                title: data.title,
                content: data.content,
                project: id
            });
            if (response.status === 201) {
                console.log("Post has been added successfully");
                setRefreshPosts(prev => prev + 1);
                addToast({
                    title: "Success",
                    description: "Post has been added successfully",
                    color: "success",
                    timeout: 3000,
                    classNames: {
                        base: "shadow-lg",
                    },
                });

            }
        } catch (err) {
            if (err instanceof AxiosError) {
                console.log('Error fetching projects');
            }
        }

        onAddPostOpenChange();
    };

    const handleDeleteProject = async () => {
        try {
            const response = await apiClient.post(`/api/delete-project/`, {
                id: id,
            });
            if (response.status === 200) {
                addToast({
                    title: "Success",
                    description: "Project has been deleted",
                    color: "success",
                    timeout: 3000,
                    classNames: {
                        base: "shadow-lg",
                    },
                });
            }
        } catch (err) {
            console.log(err);
        }
    };

    if (isLoading) {
        return (
            <>
                <Navbar />
                <div className='flex w-screen h-60 flex-col justify-center items-center gap-5'>
                    <div className='flex gap-2'><Spinner size="lg" /></div>
                </div>
            </>);
    }

    if (!project) {
        return (
            <>
                <Navbar />
                <div className='flex w-screen h-60 flex-col justify-center items-center gap-5'>
                    <div className='flex gap-2'><Search size={30} /><p className='font-semibol'>No project found</p></div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className='flex flex-col bg-white lg:px-[calc((100vw-940px)/2)] pt-10 pb-4 md:rounded-lg'>
                <div className='flex'>
                    <div className="flex flex-col gap-4 w-full p-4  ">
                        <h1 className='text-xl font-bold'>{project.name}</h1>
                        <div className='flex flex-wrap gap-1'>
                            <p className="text-sm text-default-900">{project.date}</p>
                            <p className="text-sm text-default-900">·</p>
                            <p className="text-sm text-default-900">{project.posts.length} posts</p>
                            <p className="text-sm text-default-900">·</p>
                            <p className="text-sm text-default-900">{project.members.length} members</p>
                        </div>
                        <div className='flex flex-wrap gap-1'>
                            <img src={project.ownerImage ? project.ownerImage : userImage} alt="owner" className="w-5 h-5 rounded-full" />
                            <p className="text-sm text-default-900">{project.ownerName}</p>
                        </div>
                    </div>
                    <div className="py-2">
                        <Dropdown placement="bottom-end">
                            <DropdownTrigger>
                                <Button isIconOnly variant='light' radius="full" isDisabled={!currentUserIsOwner} >
                                    <Ellipsis size={24} />
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu aria-label="Static Actions" variant='flat'>
                                <DropdownItem key="edit" onPress={onEditOpen}>Edit project</DropdownItem>
                                <DropdownItem key="delete" className="text-danger" color="danger" onPress={onDeleteOpen}>
                                    Delete project
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                        <Modal isOpen={isEditOpen} placement="top-center" onOpenChange={onEditOpenChange}>
                            <ModalContent>
                                {() => (
                                    <>
                                        <Form
                                            className="items-stretch gap-0"
                                            onSubmit={onSubmit}
                                        >
                                            <ModalHeader className="flex flex-col gap-1">Edit your VIP details</ModalHeader>
                                            <ModalBody>
                                                <Input
                                                    isRequired
                                                    name="name"
                                                    label="Project name"
                                                    variant="bordered"
                                                    defaultValue={project.name}
                                                />
                                                <Textarea
                                                    isRequired
                                                    name="description"
                                                    label="Project description"
                                                    variant="bordered"
                                                    defaultValue={project.description}
                                                />
                                                <div className='flex gap-4 justify-center items-center max-w-full'>
                                                    <Select
                                                        className="max-w-xs"
                                                        name="members"
                                                        items={users}
                                                        label="Add members"
                                                        placeholder="Select a user"
                                                        selectionMode='multiple'
                                                        variant="bordered"
                                                        selectedKeys={selectedMembers}
                                                        onSelectionChange={handleSelectionChange}
                                                    >
                                                        {(user) => (
                                                            <SelectItem key={user.id} textValue={`${user.first_name} ${user.last_name}`}>
                                                                <div className="flex gap-2 items-center">
                                                                    <Avatar alt={`${user.first_name} ${user.last_name}`} className="flex-shrink-0" size="sm" src={user.picture} />
                                                                    <div className="flex flex-col">
                                                                        <span className="text-small">{`${user.first_name} ${user.last_name}`}</span>
                                                                        <span className="text-tiny text-default-400">{user.email}</span>
                                                                    </div>
                                                                </div>
                                                            </SelectItem>
                                                        )}
                                                    </Select>
                                                    <Button
                                                        variant="bordered"
                                                        color="warning"
                                                        onPress={handleResetSelection}
                                                    >
                                                        Reset
                                                    </Button>
                                                </div>
                                            </ModalBody>
                                            <ModalFooter>
                                                <Button color="primary" type="submit" className='w-full'>
                                                    Update
                                                </Button>
                                            </ModalFooter>
                                        </Form>
                                    </>
                                )}
                            </ModalContent>
                        </Modal>
                        <Modal isOpen={isDeleteOpen} onOpenChange={onDeleteOpenChange}>
                            <ModalContent>
                                {(onClose) => (
                                    <>
                                        <ModalHeader className="flex flex-col gap-1">Are you sure you want to delete this project?</ModalHeader>
                                        <ModalFooter>
                                            <Button color="primary" onPress={onClose}>
                                                Cancel
                                            </Button>
                                            <Button color="danger" variant="light" onPress={() => {
                                                console.log("Deleting project");
                                                handleDeleteProject();
                                                navigate("/vip");
                                                onClose();
                                            }}>
                                                Delete
                                            </Button>
                                        </ModalFooter>
                                    </>
                                )}
                            </ModalContent>
                        </Modal>
                    </div>
                </div>
                {currentUserIsOwner && (
                    <>
                        <hr className="border-t border-default-300 pb-4" />
                        <div className='px-2'>
                            <Button color='primary' variant="solid" radius='full' className='h-8 pl-3' startContent={<Plus size={20} />} onPress={onAddPostOpen}>Add post</Button>
                            <Modal isOpen={isAddPostOpen} placement="top-center" onOpenChange={onAddPostOpenChange}>
                                <ModalContent>
                                    {() => (
                                        <>
                                            <Form className="items-stretch gap-0" onSubmit={handleAddPost}>
                                                <ModalHeader className="flex flex-col gap-1">Add New Post</ModalHeader>
                                                <ModalBody>
                                                    <Input
                                                        isRequired
                                                        name="title"
                                                        label="Post Title"
                                                        variant="bordered"
                                                    />
                                                    <Textarea
                                                        isRequired
                                                        name="content"
                                                        label="Post Content"
                                                        variant="bordered"
                                                    />
                                                </ModalBody>
                                                <ModalFooter>
                                                    <Button color="primary" type="submit" className='w-full'>
                                                        Create Post
                                                    </Button>
                                                </ModalFooter>
                                            </Form>
                                        </>
                                    )}
                                </ModalContent>
                            </Modal>
                        </div>
                    </>
                )}
            </div>
            <div className='mb-6'>
                <div className="flex flex-col min-w-fit bg-white lg:mx-[calc((100vw-940px)/2)] mt-6 md:rounded-lg">
                    <p className="text-base font-bold text-default-900 p-4">Description</p>
                    <hr className="border-t border-default-300" />
                    <p className="text-sm text-default-900 p-4">{project.description}</p>
                </div>
                {posts.map((post: PostData) => (
                    <Post
                        key={post.id}
                        post_id={post.id}
                        date={post.date_created}
                        title={post.title}
                        content={post.content}
                        author={post.author}
                        project_id={id ? Number(id) : -1}
                    />
                ))
                }
            </div>

        </>
    )


}

export default Vip;