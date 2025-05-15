import React, { useEffect, useRef, useState } from 'react';
import { useDirectoryStore } from '@/stores/directoryStore';  // Adjust path if necessary

const PreviewComponent = () => {
  const { currentFile } = useDirectoryStore();

  const [htmlContent, setHtmlContent] = useState<string | null>(null);

  // Update iframe content only when currentFile.content changes
  useEffect(() => {
    if (typeof window !== 'undefined' && currentFile?.content !== htmlContent) {
      setHtmlContent(currentFile?.content ?? ''); // Ensure content is a string
    }
  }, [currentFile, htmlContent]);

  if (!currentFile) {
    return <div>Select a file to preview</div>;
  }

  return (
    <div>
      <h2>Preview: {currentFile.name}</h2>
      <iframe
        title="Live Preview"
        srcDoc={htmlContent ?? ""}
        style={{
          width: '100%',
          height: '600px',
          border: 'none',
        }}
      />
    </div>
  );
};

export default PreviewComponent;
