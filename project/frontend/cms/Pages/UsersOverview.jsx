import React, { useState, useEffect } from 'react';
import { Title, Text, Container, Button, Flex, Stack } from '@mantine/core';
import renderPage from '../../Utils/renderPage';
import { Link } from "react-router-dom";
import Navigation from '../Modules/Navigation';
import axios from "axios";

const App = () => {

    const [users, setUsers] = useState([]);

    useEffect(() => {
        axios.get('/api/users/').then((response) => {
            setUsers(response.data.users);
        });
    }, []);

    return (
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
                        Users
                    </Title>
                    <Link to="/user/create/">
                        <Button
                            variant="gradient"
                            gradient={{ from: 'indigo.5', to: 'cyan.5', deg: 105 }}
                        // component="a"
                        // rel="noopener noreferrer"
                        // href="/user/create/"
                        >
                            Create New User
                        </Button>
                    </Link>
                </Flex>

                <Stack>
                    {
                        (users.length != 0) ?
                            users.map(user => {
                                return (
                                    <Text key={user.username}>{user.first_name} {user.last_name} ({user.username})
                                        <Link to={`/user/edit/${user.username}`}>
                                            <Button
                                                variant="gradient"
                                                gradient={{ from: 'indigo.5', to: 'cyan.5', deg: 105 }}
                                                mx="xl"
                                            // component="a"
                                            // rel="noopener noreferrer"
                                            // href={`/user/edit/${user.username}`}
                                            >
                                                Edit {user.username}
                                            </Button>
                                        </Link>
                                    </Text>
                                )
                            })
                            : 'No users'
                    }
                </Stack>
            </Flex>
        </Container>
    )
}
export default <App />;
// renderPage('cms_usersoverview', <App />)
