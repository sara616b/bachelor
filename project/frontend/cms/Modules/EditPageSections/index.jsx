import React, { useState, useEffect } from 'react';
import { Title, Text, Container, Button, Flex, Input, Accordion, TextInput } from '@mantine/core';
import renderPage from '../../../Utils/renderPage';
import Cookies from 'js-cookie';
import axios from "axios";
import EditComponents from './EditComponents';

const App = ({ section, index }) => {
    console.log('section', section)
    return (
        <Accordion.Item value={`${section.name}${index}`} bg="white" key={section.name} order={index}>
            <Accordion.Control>Nr. {1} // <strong>{section.name}</strong></Accordion.Control>
            <Accordion.Panel>
                <Title order={5}>
                    Columns
                </Title>
                {
                    section.columns ? section.columns.map((column, index) => {
                        return (
                            <Flex direction="column"
                                key={`${index}${column.name}`}>
                                <Text>{index + 1}. Column</Text>
                                <Accordion defaultValue="customization">
                                    {
                                        column.components ? column.components.map((component, index) => {
                                            return (
                                                <EditComponents component={component} index={index} key={`${index}${component.name}`} />
                                            )
                                        }) : 'no components'
                                    }
                                </Accordion>
                                <Button>
                                    Add Component
                                </Button>
                            </Flex>
                        )
                    }) : 'Error'
                }

            </Accordion.Panel>
        </Accordion.Item>
    );
}

export default App;

