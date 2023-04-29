import React from 'react';
import { Title, Text, Container, Button, Flex } from '@mantine/core';
import renderPage from '../../Utils/renderPage';
import Navigation from '../Modules/Navigation';

const App = () => {
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
                <Title>
                    CMS
                </Title>
                <Text>
                    This is the CMS for the bachelor project PageManager. Here, you can create and edit Pages.
                </Text>
                <Button
                    variant="gradient"
                    gradient={{ from: 'indigo.9', to: 'indigo.5', deg: 105 }}
                    component="a"
                    rel="noopener noreferrer"
                    href="/page/create/"
                >
                    Create New Page
                </Button>
                <Button
                    variant="gradient"
                    gradient={{ from: 'indigo.5', to: 'cyan.5', deg: 105 }}
                    component="a"
                    rel="noopener noreferrer"
                    href="/page/all/"
                >
                    View All Pages
                </Button>
            </Flex>
        </Container>
    )
}
export default <App />;

// renderPage('cms_frontpage', <App />)
