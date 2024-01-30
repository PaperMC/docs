import React from 'react';
import { Icon } from '@iconify/react';
import MDXComponents from '@theme-original/MDXComponents';
import TabItem from '@theme/TabItem';
import Tabs from '@theme/Tabs';
import VersionFormattedCode from '@site/src/components/VersionFormattedCode';
import SoftwareVersion from '@site/src/components/SoftwareVersion';
import VersionedJavaDocLink from '../components/VersionedJavaDocLink';
import ConfiguredProperty from '@site/src/components/ConfiguredProperty';

export default {
    // Re-use the default mapping
    ...MDXComponents,
    Tabs,
    TabItem,
    // Add a custom mapping
    VersionFormattedCode,
    SoftwareVersion,
    VersionedJavaDocLink,
    ConfiguredProperty,
    Icon: Icon,
};
