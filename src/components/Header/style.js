// for more complex styling with selectors or when responsive media queries are needed
import styled from 'styled-components';

export const HeaderWrapper = styled.div`
    display: flex;
    align-items: center;
    flex-direction: row;
    font-family: 'Montserrat';
    height: 9%;
    min-height: 4rem;
    background-color: #445D66;
`

export const UserPanelWrapper = styled.div`
    display: flex;
    align-items: center;
    margin-right: 1rem;
    padding: 0.5rem;
    cursor: pointer;
    :hover {
        background-color: rgb(135, 183, 212);
    }
`