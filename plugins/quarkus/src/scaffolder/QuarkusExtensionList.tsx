import React, {useEffect} from 'react';
import useAutocomplete from '@material-ui/lab/useAutocomplete';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import styled from 'styled-components'
import { FieldProps } from '@rjsf/utils';
import FormControl from '@material-ui/core/FormControl';
import axios, {AxiosRequestConfig} from 'axios';

const Label = styled.label`
    padding: 0 0 4px;
    line-height: 1.5;
    display: block;
    font-size: 1rem;
    font-family: "Helvetica Neue", Helvetica, Roboto, Arial, sans-serif;
    font-weight: 400;
    line-height: 1;
`;

const InputWrapper = styled.div`
    width: 300px;
    border: 1px solid #d9d9d9;
    background-color: #fff;
    border-radius: 4px;
    padding: 1px;
    display: flex;
    flex-wrap: wrap;

    &:hover {
        border-color: #40a9ff;
    }

    &.focused {
        border-color: #40a9ff;
        box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
    }

    & input {
        font-size: 14px;
        height: 30px;
        box-sizing: border-box;
        padding: 4px 6px;
        width: 0;
        min-width: 30px;
        flex-grow: 1;
        border: 0;
        margin: 0;
        outline: 0;
    }
`;

interface TagProps {
    label: string;
    onDelete?: () => void;
}
const Tag = styled( ({ label, onDelete, ...props }: TagProps) => (
    <div {...props}>
        <span>{label}</span>
        <CloseIcon onClick={onDelete} />
    </div>
))`
    display: flex;
    align-items: center;
    height: 24px;
    margin: 2px;
    line-height: 22px;
    background-color: #fafafa;
    border: 1px solid #e8e8e8;
    border-radius: 2px;
    box-sizing: content-box;
    padding: 0 4px 0 10px;
    outline: 0;
    overflow: hidden;

    &:focus {
        border-color: #40a9ff;
        background-color: #e6f7ff;
    }

    & span {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    & svg {
        font-size: 12px;
        cursor: pointer;
        padding: 4px;
    }
`;

const Listbox = styled.ul`
    width: 300px;
    margin: 2px 0 0;
    padding: 0;
    position: absolute;
    list-style: none;
    background-color: #fff;
    overflow: auto;
    max-height: 250px;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 1;

    & li {
        padding: 5px 12px;
        display: flex;

        & span {
            flex-grow: 1;
        }

        & svg {
            color: transparent;
        }
    }

    & li[aria-selected='true'] {
        background-color: #fafafa;
        font-weight: 600;

        & svg {
            color: #1890ff;
        }
    }

    & li[data-focus='true'] {
        background-color: #e6f7ff;
        cursor: pointer;

        & svg {
            color: #000;
        }
    }
`;

export const QuarkusExtensionList =  ({ onChange, rawErrors, required, formData }: FieldProps<string[]>) => {
    const {
        getRootProps,
        getInputLabelProps,
        getInputProps,
        getTagProps,
        getListboxProps,
        getOptionProps,
        groupedOptions,
        value,
        focused,
        setAnchorEl,
    } = useAutocomplete({
        id: 'customized-hook-demo',
        // TODO: Check if the code change does not break the logic of the plugin
        defaultValue: [quarkusExtensions[1]],
        multiple: true,
        options: quarkusExtensions,
        getOptionLabel: (option: {id: string, name: string}) => option.id,
    });

    const apiUrl = 'https://code.quarkus.io/api/extensions'
    const headers = {
        'Content-Type': 'application/json', // Adjust as needed
        'Access-Control-Allow-Origin' : '*',
        'Access-Control-Allow-Methods': '*',
    };
    const axiosRequestConfig: AxiosRequestConfig = {
        headers: headers
    };
    // Download the Component list
    useEffect(() => {
        axios.get(apiUrl, axiosRequestConfig).then((response) => {
            response.data.forEach((e: QuarkusExtensionType) => {
                console.log(e)
                quarkusExtensions.push({ id: e.id, name: e.name })
            })
        })
    }, []);


    // Populate value changes of autocomplete to the actual field
    useEffect(() => {
        onChange(value
            .filter((extension: QuarkusExtensionType) => extension.id)
            .map((extension: QuarkusExtensionType) => extension.id))
    }, [value]);

    // @ts-ignore
    return (
        <FormControl
            margin="normal"
            required={required}
            error={rawErrors && rawErrors?.length > 0 && !formData}
        >
            <div>
                <div {...getRootProps()}>
                    <Label {...getInputLabelProps()}>Quarkus Extension(s)</Label>
                    <InputWrapper ref={setAnchorEl} className={focused ? 'focused' : ''}>
                        {value.map((option: QuarkusExtensionType, index: number) => (
                            option.name && <Tag label={option.name} {...getTagProps({ index })} />
                        ))}
                        <input {...getInputProps()} />
                    </InputWrapper>
                </div>
                {groupedOptions.length > 0 ? (
                    <Listbox {...getListboxProps()}>
                        {groupedOptions.map((option, index) => (
                            <li {...getOptionProps({ option, index })}>
                                <span>{option.name}</span>
                                <CheckIcon fontSize="small" />
                            </li>
                        ))}
                    </Listbox>
                ) : null}
            </div>
        </FormControl>
    );
}

interface QuarkusExtensionType {
    id: string
    name: string;
    description?: string;
}

const quarkusExtensions: QuarkusExtensionType[] = [
    { id: 'quarkus-resteasy-reactive', name: 'Quarkus Resteasy Reactive' },
    { id: 'quarkus-resteasy-reactive-jackson', name: 'Quarkus Resteasy Reactive Jackson' },
    { id: 'quarkus-container-image-docker', name: 'Quarkus Container Image Docker' },
    { id: 'quarkus-kubernetes', name: 'Quarkus Kubernetes' },
    { id: 'quarkus-openshift', name: 'Quarkus OpenShift' },
];

export default QuarkusExtensionList;