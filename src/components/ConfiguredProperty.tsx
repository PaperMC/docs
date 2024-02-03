import configuredProperties from '@site/config-specs/properties/properties.json';

const CONFIGURED_PROPERTY_NAMES = Object.keys(configuredProperties);

export function isConfiguredProperty(propertyKey: string): boolean {
    return CONFIGURED_PROPERTY_NAMES.includes(propertyKey);
}

export function getConfiguredProperty(propertyKey: string): string {
    return configuredProperties[propertyKey];
}

export default function ConfiguredProperty({ propertyKey }) {

    if (!isConfiguredProperty(propertyKey)) {
        return null;
    }

    return getConfiguredProperty(propertyKey);
}
