import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { IconButton, Tooltip } from '@mui/material';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';

function CodeBlock({ language, value, isDark }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard?.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="code-block">
      <div className="code-block__header">
        <span className="code-block__lang">{language || 'text'}</span>
        <Tooltip title={copied ? 'Copied!' : 'Copy'} placement="left">
          <IconButton
            size="small"
            onClick={handleCopy}
            aria-label="Copy code"
            sx={{ color: 'inherit', opacity: 0.8, '&:hover': { opacity: 1 } }}
          >
            {copied ? (
              <CheckRoundedIcon sx={{ fontSize: 16, color: '#22c55e' }} />
            ) : (
              <ContentCopyRoundedIcon sx={{ fontSize: 16 }} />
            )}
          </IconButton>
        </Tooltip>
      </div>
      <SyntaxHighlighter
        style={isDark ? vscDarkPlus : oneLight}
        language={language || 'text'}
        PreTag="div"
        className="code-block__body"
        showLineNumbers={!!language && language !== 'bash' && language !== 'shell'}
        wrapLongLines
      >
        {value}
      </SyntaxHighlighter>
    </div>
  );
}

const buildComponents = (isDark) => ({
  code({ inline, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || '');
    const value = String(children).replace(/\n$/, '');
    if (inline) {
      return (
        <code className="md-inline-code" {...props}>
          {children}
        </code>
      );
    }
    return <CodeBlock language={match?.[1]} value={value} isDark={isDark} />;
  },
  a({ href, children }) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="md-link">
        {children}
      </a>
    );
  },
  table({ children }) {
    return (
      <div className="md-table-wrap">
        <table className="md-table">{children}</table>
      </div>
    );
  },
  blockquote({ children }) {
    return <blockquote className="md-blockquote">{children}</blockquote>;
  },
});

export default function MarkdownRenderer({ content, isDark }) {
  return (
    <div className="md">
      <ReactMarkdown components={buildComponents(isDark)}>{content}</ReactMarkdown>
    </div>
  );
}
