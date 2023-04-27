import React, { useState, useEffect } from 'react';
import { Title, Text, Container, Button, Flex, TextInput } from '@mantine/core';
import renderPage from '../../../Utils/renderPage';
import Navigation from '../../Modules/Navigation/Navigation';
import Cookies from 'js-cookie';
import axios from "axios";

const App = () => {
    const [user, setUser] = useState({})
    const username = window.__INITIAL__.username

    useEffect(() => {
        axios.get(`/api/user/${username}`).then((response) => {
            setUser(response.data.user[0]);
        });
    }, []);
    console.log(user)

    // const csrftoken = Cookies.get('csrftoken');
    // axios.defaults.headers.common['X-CSRFToken'] = csrftoken;

    // const SubmitForm = (e) => {
    //     e.preventDefault()
    //     const data = new FormData()
    //     data.append('firstname', e.target.elements.firstname.value);
    //     data.append('lastname', e.target.elements.lastname.value);
    //     data.append('username', e.target.elements.username.value);
    //     data.append('email', e.target.elements.email.value);
    //     data.append('password', e.target.elements.password.value);
    //     axios
    //         .post('/user/create/', data)
    //         .then((response) => {
    //             if (response.status == 200) {
    //                 // redirect
    //                 location.href = '/users/'
    //             }
    //         });
    // }
    return (
        <Container size="lg">
            <Navigation />
            <Container size="xs">
                <Flex
                    bg="blue.1"
                    gap="lg"
                    justify="center"
                    align="center"
                    direction="column"
                    wrap="wrap"
                    px="xl"
                    py="xl"
                >
                    <Flex
                        bg="blue.1"
                        gap="lg"
                        justify="center"
                        align="center"
                        direction="row"
                        wrap="wrap"
                        px="xl"
                        py="xl"
                    >
                        <Title>
                            Edit User
                        </Title>
                    </Flex>
                    <form onSubmit={(event) => SubmitForm(event)}>
                        <Flex
                            bg="blue.1"
                            gap="md"
                            justify="center"
                            align="center"
                            direction="column"
                            wrap="wrap"
                        >
                            <TextInput
                                placeholder="First Name"
                                name="firstname"
                                id="firstname"
                                label="First Name"
                                defaultValue={user?.first_name || ''}
                                required
                            />
                            <TextInput
                                placeholder="Last Name"
                                name="lastname"
                                id="lastname"
                                label="Last Name"
                                defaultValue={user?.last_name || ''}
                                required
                            />
                            <TextInput
                                placeholder="Username"
                                name="username"
                                id="username"
                                label="Username"
                                defaultValue={user?.username || ''}
                                required
                            />
                            <TextInput
                                placeholder="Email"
                                name="email"
                                id="email"
                                label="Email"
                                defaultValue={user?.email || ''}
                                required
                            />
                            <Button
                                variant="gradient"
                                gradient={{ from: 'indigo.5', to: 'cyan.5', deg: 105 }}
                                type="submit"
                            >
                                Create
                            </Button>
                        </Flex>
                    </form>
                </Flex>
            </Container >
        </Container >
    )
}

renderPage('cms_edituser', <App />)
