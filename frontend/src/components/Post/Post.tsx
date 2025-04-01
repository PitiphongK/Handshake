import React, { useEffect, useState } from 'react';
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, useDisclosure, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Form, Input, Textarea, addToast } from '@heroui/react';
import { Ellipsis } from 'lucide-react';
import apiClient from '../../services/apiClient';
import { AxiosError } from 'axios';

interface PostProps {
  post_id: number;
  title: string;
  content: string;
  author: number;
  date: string;
  project_id: number;
}

const Post: React.FC<PostProps> = ({ post_id, title, content, author, date, project_id }) => {
  const { isOpen: isEditOpen, onOpen: onEditOpen, onOpenChange: onEditOpenChange } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onOpenChange: onDeleteOpenChange } = useDisclosure();
  const [authorName, setAuthorName] = useState<string>("");
  const [authorImage, setAuthorImage] = useState<string>("");
  const dateObject = new Date(date);
  const userId = Number(localStorage.getItem("user_id"));

  const dateOptions: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  }
  const dateString = dateObject.toLocaleString("default", dateOptions);

  useEffect(() => {
    const fetchAuthorImage = async () => {
      try {
        const response = await apiClient.get(`/api/user-profiles/${author}`);
        if (response.status === 200) {
          console.log("Fetched author image successfully");
          const authorData = response.data;
          setAuthorImage(authorData.picture);
          setAuthorName(`${authorData.first_name} ${authorData.last_name}`);
        }
      } catch (err) {
        if (err instanceof AxiosError) {
          console.log(err?.response?.data.detail);
        }
      }
    }
    fetchAuthorImage();
  }, [author]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userId = localStorage.getItem("user_id");
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    try {
      const response = await apiClient.post("/api/edit-post/", {
        id: post_id,
        title: data.title,
        content: data.content,
        author: userId,
        project: project_id,
      });
      if (response.status === 200) {
        addToast({
          title: "Success",
          description: "Post has been updated successfully",
          color: "success",
          timeout: 3000,
          classNames: {
            base: "shadow-lg",
          },
        });
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        console.log(err);
        addToast({
          title: "Edit post failed",
          description: err?.response?.data.detail,
          color: "danger",
          timeout: 3000,
          classNames: {
            base: "shadow-lg",
          },
        });
      }
    }
    onEditOpenChange();
  };
  const handleDeletePost = async (post_id: number) => {
    try {
      const response = await apiClient.post(`/api/delete-post/`, {
        id: post_id,
      });
      if (response.status === 200) {
        addToast({
          title: "Success",
          description: "Post has been deleted",
          color: "success",
          timeout: 3000,
          classNames: {
            base: "shadow-lg",
          },
        });
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        console.log(err);
        addToast({
          title: "Deleting post failed",
          description: err?.response?.data.detail,
          color: "danger",
          timeout: 3000,
          classNames: {
            base: "shadow-lg",
          },
        });
      }
    }
  };

  return (
    <div className="flex flex-col min-w-fit bg-white lg:mx-[calc((100vw-940px)/2)] mt-6 md:rounded-lg">
      <div className='flex justify-between'>
        <p className="text-base font-bold text-default-900 p-4">{title}</p>
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Button isIconOnly variant='light' radius="full" isDisabled={!(userId === author)} >
              <Ellipsis size={20} />
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Static Actions" variant='flat'>
            <DropdownItem key="edit" onPress={onEditOpen}>Edit post</DropdownItem>
            <DropdownItem key="delete" className="text-danger" color="danger" onPress={onDeleteOpen}>
              Delete post
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <Modal isOpen={isEditOpen} placement="top-center" onOpenChange={onEditOpenChange}>
          <ModalContent>
            {() => (
              <>
                <Form className="items-stretch gap-0" onSubmit={onSubmit}>
                  <ModalHeader className="flex flex-col gap-1">Edit Post</ModalHeader>
                  <ModalBody>
                    <Input
                      isRequired
                      name="title"
                      label="Post Title"
                      variant="bordered"
                      defaultValue={title}
                    />
                    <Textarea
                      isRequired
                      name="content"
                      label="Post Content"
                      variant="bordered"
                      defaultValue={content}
                    />
                  </ModalBody>
                  <ModalFooter>
                    <Button color="primary" type="submit" className='w-full'>
                      Update Post
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
                <ModalHeader className="flex flex-col gap-1">Are you sure you want to delete this post?</ModalHeader>
                <ModalFooter>
                  <Button color="primary" onPress={onClose}>
                    Cancel
                  </Button>
                  <Button color="danger" variant="light" onPress={() => {
                    // Perform delete action here
                    handleDeletePost(post_id);
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
      <div className='flex flex-wrap gap-1 pb-4 px-4'>
        <p className="text-sm text-default-900">{dateString}</p>
        <p className="text-sm text-default-900">·</p>
        <img src={authorImage} alt="owner" className="w-5 h-5 rounded-full" />
        <p className="text-sm text-default-900">{authorName}</p>
      </div>
      <hr className="border-t border-default-300" />
      <p className="text-sm text-default-900 p-4">{content}</p>
    </div>
  )
}

export default Post