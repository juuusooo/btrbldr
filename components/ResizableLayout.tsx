'use client'

import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';
import Directory from './directory/DirectoryComponent';
import EditorComponent from './editor/EditorComponents';
import PreviewComponent from './preview/PreviewComponent';
import TerminalComponent from './terminal/TerminalComponent';

const ResizableLayout: React.FC = () => {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <PanelGroup direction="horizontal">
        <Panel defaultSize={15} minSize={10}>
          <Directory />
        </Panel>
        <PanelResizeHandle />
        <Panel defaultSize={40} minSize={40}>
          <PanelGroup direction="vertical">
            <Panel defaultSize={30} minSize={30}>
              <PanelGroup direction="horizontal">
              <Panel minSize={40}>
                <EditorComponent />
              </Panel>
              <PanelResizeHandle />
              <Panel defaultSize={40} minSize={20}>
                <PreviewComponent />
              </Panel>
              </PanelGroup>
            </Panel>
            <PanelResizeHandle />
            <Panel defaultSize={15} minSize={20}>
              <TerminalComponent />
            </Panel>
          </PanelGroup>
        </Panel>
      </PanelGroup>
    </div>
  );
};

export default ResizableLayout;