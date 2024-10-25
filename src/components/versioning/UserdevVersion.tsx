import React, { useEffect, useRef, useState } from "react";
import CodeBlock from "@docusaurus/theme-classic/lib/theme/CodeBlock";

async function getUserdevVersion(): Promise<string> {
  const response = await fetch(
    "https://api.github.com/repos/PaperMC/paperweight/tags"
  );

  if (!response.ok) {
    return "<insert_latest_version>";
  }

  const json = await response.json();
  return json[0].name.substring(1);
}

export default function UserdevVersionCode({
  language = "",
  title = "",
  showLineNumbers = false,
  plainText = false,
  children
}: UserdevVersionFormattedCodeProps) {
  const [formattedCode, setFormattedCode] = useState<FormattedCodeProps>(null);
  const mounted = useRef<Boolean>(true);

  useEffect(() => {
    (async () => {
      let code;
      let inline = true;

      if (plainText) {
        code = children;
      } else {
        code = children.props.children;

        if (code.props) {
          code = code.props.children;
          inline = false;
        }
      }

      code = code.replace(/%%_USERDEV_VER_%%/g, await getUserdevVersion());

      if (mounted.current) {
        setFormattedCode({ code, inline });
      }
    })();

    return () => {
      mounted.current = false;
    };
  }, [children]);

  if (!formattedCode) {
    return null;
  }

  const { code, inline } = formattedCode;

  return plainText ? (
    code
  ) : inline ? (
    <code>{code}</code>
  ) : (
    <CodeBlock language={language} title={title} showLineNumbers={showLineNumbers}>
      {code}
    </CodeBlock>
  );
}

interface FormattedCodeProps {
  code: string;
  inline: boolean;
}

interface UserdevVersionFormattedCodeProps {
  language?: string;
  title?: string;
  showLineNumbers?: boolean;
  plainText?: boolean;
  children: any;
}
