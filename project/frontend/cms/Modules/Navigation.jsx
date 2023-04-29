import React from 'react';
import { Button, Flex } from '@mantine/core';
import { Link } from "react-router-dom";

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
                <Link to="/">
                    <Button
                        variant="default"
                    // component="a"
                    // rel="noopener noreferrer"
                    // href="/"
                    >
                        Home
                    </Button>
                </Link>
                <Link to="/page/create/">
                    <Button
                        variant="default"
                    // component="a"
                    // rel="noopener noreferrer"
                    // href="/page/create/"
                    >
                        Create New Page
                    </Button>
                </Link>
                <Link to="/page/all/">
                    <Button
                        variant="default"
                    // component="a"
                    // rel="noopener noreferrer"
                    // href="/page/all/"
                    >
                        View All Pages
                    </Button>
                </Link>
                <Link to="/users/">
                    <Button
                        variant="default"
                    // component="a"
                    // rel="noopener noreferrer"
                    // href="/users/"
                    >
                        Users
                    </Button>
                </Link>
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
