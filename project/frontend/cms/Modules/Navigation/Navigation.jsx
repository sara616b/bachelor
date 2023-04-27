import React from 'react';
import { Button, Flex } from '@mantine/core';

const App = () => {
    return (
        <Flex
            gap="lg"
            justify="center"
            align="center"
            direction="column"
            wrap="wrap"
            px="xl"
            py="xl"
        >
            <Button.Group>
                <Button
                    variant="default"
                    component="a"
                    rel="noopener noreferrer"
                    href="/"
                >
                    Home
                </Button>
                <Button
                    variant="default"
                    component="a"
                    rel="noopener noreferrer"
                    href="/page/create/"
                >
                    Create New Page
                </Button>
                <Button
                    variant="default"
                    component="a"
                    rel="noopener noreferrer"
                    href="/page/all/"
                >
                    View All Pages
                </Button>
                <Button
                    variant="default"
                    component="a"
                    rel="noopener noreferrer"
                    href="/users/"
                >
                    Users
                </Button>
                <Button
                    variant="default"
                    component="a"
                    rel="noopener noreferrer"
                    href="/logout/"
                >
                    Log Out
                </Button>
            </Button.Group>
        </Flex>
    );
}

export default App;
