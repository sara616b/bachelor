import React from 'react';
import { Title, Text, Container, Button, Flex, Input } from '@mantine/core';
import renderPage from '../../../Utils/renderPage';

const App = () => {

    const SubmitForm = (e) => {
        e.preventDefault()
        console.log(e)
        console.log('submitting form');
    }

    return (
        <Container size="lg">
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
                    <Title>
                        Log In
                    </Title>
                    <form onSubmit={(event) => SubmitForm(event)}>
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
                            <Input
                                placeholder="Username"
                                name="username"
                                id="username"
                            />
                            <Input
                                placeholder="Password"
                                name="password"
                                id="password"
                            />
                            <Button
                                variant="gradient"
                                gradient={{ from: 'indigo.5', to: 'cyan.5', deg: 105 }}
                                type="submit"
                            >
                                Log In
                            </Button>
                        </Flex>
                    </form>
                </Flex>
            </Container>
        </Container>
    )
}

renderPage('cms_login', <App />)
