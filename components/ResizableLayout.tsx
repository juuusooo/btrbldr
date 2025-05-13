'use client'

import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';
import Directory from './directory/DirectoryComponent';
import EditorComponent from './editor/EditorComponents';

const ResizableLayout: React.FC = () => {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <PanelGroup direction="horizontal">
        <Panel defaultSize={14.28} minSize={10}>
          <Directory />
        </Panel>
        <PanelResizeHandle />
        <Panel minSize={20}>
          <EditorComponent />
        </Panel>
        <PanelResizeHandle />
        <Panel defaultSize={42.86} minSize={20}>
          <div style={{ background: '#d0d0d0', border: '1px solid #ccc', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            Preview
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
};

export default ResizableLayout;