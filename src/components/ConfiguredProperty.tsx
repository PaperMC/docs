import React from 'react';

const CONFIGURED_PROPERTIES = {
    MIN_VELOCITY_JAVA: "17",
}

const CONFIGURED_PROPERTY_NAMES = Object.keys(CONFIGURED_PROPERTIES);

export function isConfiguredProperty(propertyKey: string): boolean {
    return CONFIGURED_PROPERTY_NAMES.includes(propertyKey);
}

export function getConfiguredProperty(propertyKey: string): string {
    return CONFIGURED_PROPERTIES[propertyKey];
}

export default function ConfiguredProperty({ propertyKey }) {

    if (!isConfiguredProperty(propertyKey)) {
        return null;
    }

    const value = getConfiguredProperty(propertyKey);

    return (
        <span className="configured-property">
            {value}
        </span>
    );
}
