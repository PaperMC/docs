import React from 'react';
import MDXComponents from '@theme-original/MDXComponents';
import TabItem from "@theme/TabItem";
import Tabs from "@theme/Tabs";
import VersionFormattedCode from '../components/VersionFormattedCode';
import SoftwareVersion from "../components/SoftwareVersion";
import VersionedJavaDocLink from "../components/VersionedJavaDocLink";

export default {
    // Re-use the default mapping
    ...MDXComponents,
    Tabs,
    TabItem,
    // Add a custom mapping
    VersionFormattedCode,
    SoftwareVersion,
    VersionedJavaDocLink,
};
