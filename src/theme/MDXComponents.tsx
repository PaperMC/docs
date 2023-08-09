import React from 'react';
import MDXComponents from '@theme-original/MDXComponents';
import VersionFormattedCode from '@site/src/components/VersionFormattedCode';

export default {
    // Re-use the default mapping
    ...MDXComponents,
    // Add a custom mapping
    VersionFormattedCode,
};