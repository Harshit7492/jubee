import React, { useState } from 'react';
import {
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, ChevronDown, Save, Printer, Undo, Redo, Copy,
  Search, FileText, Table, Image, Link, MoreHorizontal, Minus, Square, X,
  ZoomIn, ZoomOut, Eye, File, Home, Layout, Scale, Type, Paintbrush, MessageSquare,
  Settings, ChevronRight, Highlighter, Subscript, Superscript, Strikethrough,
  IndentDecrease, IndentIncrease, ListChecks
} from 'lucide-react';

const MSWordEditor = () => {
  const [activeTab, setActiveTab] = useState('Home');
  const [fontSize, setFontSize] = useState('14');
  const [fontFamily, setFontFamily] = useState('Times New Roman');
  const [zoom, setZoom] = useState(100);

  const tabs = ['File', 'Home', 'Insert', 'Layout', 'References', 'Review', 'View'];

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Quick Access Toolbar */}
     

      {/* Ribbon Tabs */}
      <div className="bg-card border-b border-border">
        <div className="flex items-center px-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === tab
                ? 'text-foreground border-b-2 border-foreground'
                : 'text-muted-foreground hover:bg-muted'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Ribbon Content - HOME TAB */}
      {activeTab === 'Home' && (
        <div className="bg-card border-b border-border px-4 py-2">
          <div className="flex items-start gap-4">
            {/* Clipboard Group */}
            <div className="flex flex-col items-center border-r border-border pr-4">
              <div className="flex gap-1 mb-1">
                <button className="flex flex-col items-center p-2 hover:bg-muted rounded text-foreground" title="Paste">
                  {/* <Paste className="w-5 h-5 text-muted-foreground" /> */}
                  <span className="text-xs mt-1">Paste</span>
                </button>
              </div>
              <div className="flex gap-1">
                <button className="p-1 hover:bg-muted rounded" title="Cut">
                  {/* <Cut className="w-4 h-4 text-muted-foreground" /> */}
                </button>
                <button className="p-1 hover:bg-muted rounded" title="Copy">
                  <Copy className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Font Group */}
            <div className="flex flex-col border-r border-border pr-4">
              <div className="flex items-center gap-2 mb-2">
                {/* Font Family */}
                <select
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value)}
                  className="border border-border rounded px-2 py-1 text-sm w-40 bg-card text-foreground focus:outline-none focus:border-foreground"
                >
                  <option>Times New Roman</option>
                  <option>Arial</option>
                  <option>Calibri</option>
                  <option>Georgia</option>
                  <option>Verdana</option>
                </select>

                {/* Font Size */}
                <select
                  value={fontSize}
                  onChange={(e) => setFontSize(e.target.value)}
                  className="border border-border rounded px-2 py-1 text-sm w-16 bg-card text-foreground focus:outline-none focus:border-foreground"
                >
                  <option>8</option>
                  <option>10</option>
                  <option>11</option>
                  <option>12</option>
                  <option>14</option>
                  <option>16</option>
                  <option>18</option>
                  <option>20</option>
                  <option>24</option>
                </select>
              </div>

              <div className="flex items-center gap-1">
                <button className="p-1 hover:bg-muted rounded border border-transparent hover:border-border" title="Bold">
                  <Bold className="w-4 h-4 text-muted-foreground" />
                </button>
                <button className="p-1 hover:bg-muted rounded border border-transparent hover:border-border" title="Italic">
                  <Italic className="w-4 h-4 text-muted-foreground" />
                </button>
                <button className="p-1 hover:bg-muted rounded border border-transparent hover:border-border" title="Underline">
                  <Underline className="w-4 h-4 text-muted-foreground" />
                </button>
                <button className="p-1 hover:bg-muted rounded border border-transparent hover:border-border" title="Strikethrough">
                  <Strikethrough className="w-4 h-4 text-muted-foreground" />
                </button>
                <button className="p-1 hover:bg-muted rounded border border-transparent hover:border-border" title="Subscript">
                  <Subscript className="w-4 h-4 text-muted-foreground" />
                </button>
                <button className="p-1 hover:bg-muted rounded border border-transparent hover:border-border" title="Superscript">
                  <Superscript className="w-4 h-4 text-muted-foreground" />
                </button>
                <button className="p-1 hover:bg-muted rounded border border-transparent hover:border-border" title="Highlight">
                  <Highlighter className="w-4 h-4 text-yellow-400" />
                </button>
                <button className="p-1 hover:bg-muted rounded border border-transparent hover:border-border flex items-center gap-1" title="Text Color">
                  <Type className="w-4 h-4 text-muted-foreground" />
                  <div className="w-3 h-1 bg-red-600"></div>
                </button>
              </div>
            </div>

            {/* Paragraph Group */}
            <div className="flex flex-col border-r border-border pr-4">
              <div className="flex items-center gap-1 mb-2">
                <button className="p-1 hover:bg-muted rounded border border-transparent hover:border-border" title="Bullets">
                  <List className="w-4 h-4 text-muted-foreground" />
                </button>
                <button className="p-1 hover:bg-muted rounded border border-transparent hover:border-border" title="Numbering">
                  <ListOrdered className="w-4 h-4 text-muted-foreground" />
                </button>
                <button className="p-1 hover:bg-muted rounded border border-transparent hover:border-border" title="Checklist">
                  <ListChecks className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-1 hover:bg-muted rounded border border-transparent hover:border-border" title="Decrease Indent">
                  <IndentDecrease className="w-4 h-4 text-muted-foreground" />
                </button>
                <button className="p-1 hover:bg-muted rounded border border-transparent hover:border-border" title="Increase Indent">
                  <IndentIncrease className="w-4 h-4 text-muted-foreground" />
                </button>
                <button className="p-1 hover:bg-muted rounded border border-transparent hover:border-border" title="Align Left">
                  <AlignLeft className="w-4 h-4 text-muted-foreground" />
                </button>
                <button className="p-1 hover:bg-muted rounded border border-transparent hover:border-border" title="Center">
                  <AlignCenter className="w-4 h-4 text-muted-foreground" />
                </button>
                <button className="p-1 hover:bg-muted rounded border border-transparent hover:border-border" title="Align Right">
                  <AlignRight className="w-4 h-4 text-muted-foreground" />
                </button>
                <button className="p-1 hover:bg-muted rounded border border-transparent hover:border-border" title="Justify">
                  <AlignJustify className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Styles Group */}
            <div className="flex items-center gap-2">
              <div className="flex flex-col gap-1">
                <button className="px-3 py-1 bg-card border border-border rounded hover:bg-muted text-sm text-foreground">
                  Normal
                </button>
                <button className="px-3 py-1 bg-card border border-border rounded hover:bg-muted text-sm text-foreground">
                  No Spacing
                </button>
              </div>
              <div className="flex flex-col gap-1">
                <button className="px-3 py-1 bg-card border border-border rounded hover:bg-muted text-sm font-bold text-foreground">
                  Heading 1
                </button>
                <button className="px-3 py-1 bg-card border border-border rounded hover:bg-muted text-sm font-semibold text-foreground">
                  Heading 2
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* INSERT TAB */}
      {activeTab === 'Insert' && (
        <div className="bg-card border-b border-border px-4 py-2">
          <div className="flex items-start gap-4">
            <div className="flex gap-2 border-r border-border pr-4">
              <button className="flex flex-col items-center p-2 hover:bg-muted rounded text-foreground">
                <Table className="w-5 h-5 text-muted-foreground" />
                <span className="text-xs mt-1">Table</span>
              </button>
              <button className="flex flex-col items-center p-2 hover:bg-muted rounded text-foreground">
                <Image className="w-5 h-5 text-muted-foreground" />
                <span className="text-xs mt-1">Picture</span>
              </button>
              <button className="flex flex-col items-center p-2 hover:bg-muted rounded text-foreground">
                <Link className="w-5 h-5 text-muted-foreground" />
                <span className="text-xs mt-1">Link</span>
              </button>
              <button className="flex flex-col items-center p-2 hover:bg-muted rounded text-foreground">
                <MessageSquare className="w-5 h-5 text-muted-foreground" />
                <span className="text-xs mt-1">Comment</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LAYOUT TAB */}
      {activeTab === 'Layout' && (
        <div className="bg-card border-b border-border px-4 py-2">
          <div className="flex items-start gap-4">
            <div className="flex gap-2">
              <button className="flex flex-col items-center p-2 hover:bg-muted rounded text-foreground">
                <Layout className="w-5 h-5 text-muted-foreground" />
                <span className="text-xs mt-1">Margins</span>
              </button>
              <button className="flex flex-col items-center p-2 hover:bg-muted rounded text-foreground">
                <File className="w-5 h-5 text-muted-foreground" />
                <span className="text-xs mt-1">Orientation</span>
              </button>
              <button className="flex flex-col items-center p-2 hover:bg-muted rounded text-foreground">
                <Settings className="w-5 h-5 text-muted-foreground" />
                <span className="text-xs mt-1">Size</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 bg-muted/50 overflow-auto">
        <div className="flex justify-center py-8">
          {/* Document Page */}
          <div className="bg-card shadow-lg w-[8.5in] min-h-[11in] p-[1in] relative">
            {/* Ruler */}
            <div className="absolute top-0 left-0 right-0 h-6 bg-card border-b border-border flex items-center px-[1in]">
              <div className="flex-1 relative h-full">
                {/* Ruler markings */}
                {[...Array(17)].map((_, i) => (
                  <div key={i} className="absolute h-2 w-px bg-muted-foreground/50" style={{ left: `${i * 6.25}%` }}>
                    {i % 2 === 0 && (
                      <span className="absolute -top-4 -left-1 text-[8px] text-muted-foreground">{i}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Document Content */}
            <div className="mt-6 font-serif text-foreground" style={{ fontSize: `${fontSize}pt`, fontFamily }}>
              <div className="mb-8 text-center">
                <p className="mb-4">This is a sample document containing legal text.</p>
                <p className="font-bold mb-4">BEFORE THE HON'BLE SUPREME COURT OF INDIA</p>
                <p className="mb-4">CIVIL APPEAL NO. 12345 OF 2024</p>
                <p className="mb-2">APPELLANT: Raj Kumar Versus</p>
                <p className="mb-4">RESPONDENT: Sunil Sharma</p>
                <p>HON'BLE COURT,</p>
              </div>

              {/* Editable content area */}
              <div
                contentEditable
                className="outline-none min-h-[400px] leading-relaxed text-foreground"
                suppressContentEditableWarning
              >
                <p className="mb-4">Click here to start typing your document...</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-neutral-900 dark:bg-neutral-950 text-white flex items-center justify-between px-4 py-1 text-xs h-6">
        <div className="flex items-center gap-4">
          <span>Page 1 of 1</span>
          <span>Words: 45</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button onClick={() => setZoom(Math.max(10, zoom - 10))} className="hover:bg-neutral-800 p-1 rounded">
              <ZoomOut className="w-3 h-3" />
            </button>
            <span>{zoom}%</span>
            <button onClick={() => setZoom(Math.min(500, zoom + 10))} className="hover:bg-neutral-800 p-1 rounded">
              <ZoomIn className="w-3 h-3" />
            </button>
          </div>
          <button className="hover:bg-neutral-800 px-2 py-1 rounded flex items-center gap-1">
            <Eye className="w-3 h-3" />
            <span>Print Layout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MSWordEditor;