import React from 'react';
import { Title, Text, Container, Button, Flex, Input, Grid, Accordion, TextInput, Box, AccordionControlProps, ActionIcon } from '@mantine/core';


const AccordionControl = ({ children, deleteIcon, moveUp, moveDown }) => {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Accordion.Control>
                {React.Children.map(children, child => { return child })}
            </Accordion.Control>
            <Flex
                direction="column"
            >
                <ActionIcon size="sm" {...moveUp.props} title='Move Up'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 8L18 14H6L12 8Z"></path></svg>
                </ActionIcon>
                <ActionIcon size="sm" {...moveDown.props} title='Move Down'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 16L6 10H18L12 16Z"></path></svg>
                </ActionIcon>
            </Flex>
            {
                deleteIcon && deleteIcon.display ?
                    <ActionIcon size="lg" {...deleteIcon.props} title="Delete">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#bf7070"><path d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM9 11V17H11V11H9ZM13 11V17H15V11H13ZM9 4V6H15V4H9Z"></path></svg>
                    </ActionIcon> : ''
            }
        </Box>
    );
}

export default AccordionControl;