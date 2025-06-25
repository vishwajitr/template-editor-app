import React, { useState, useEffect } from 'react';
import { Table, Form, Button, Tabs, Tab, Container, Row, Col, Alert, Card } from 'react-bootstrap';
import './TemplateEditor.css';

const TemplateEditor = () => {
  const [originalJson, setOriginalJson] = useState('');
  const [templates, setTemplates] = useState({});
  const [jsonInput, setJsonInput] = useState('');
  const [jsonError, setJsonError] = useState(null);
  const [activeSection, setActiveSection] = useState('KEYWORD_BLOCK_TEMPLATES');
  const [activeDomain, setActiveDomain] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [originalTemplates, setOriginalTemplates] = useState({});
  const [isApproved, setIsApproved] = useState(false);
  const [currentChangeIndex, setCurrentChangeIndex] = useState(0);
  
  const handleJsonInput = () => {
    try {
      const parsedJson = JSON.parse(jsonInput);
      
      // Validate that required sections exist
      if (!parsedJson.KEYWORD_BLOCK_TEMPLATES && !parsedJson.SERP_BLOCK_TEMPLATES) {
        throw new Error('JSON must contain at least one of: KEYWORD_BLOCK_TEMPLATES or SERP_BLOCK_TEMPLATES');
      }
      
      setTemplates(parsedJson);
      setOriginalTemplates(JSON.parse(JSON.stringify(parsedJson))); // Deep copy
      setOriginalJson(JSON.stringify(parsedJson, null, 2));
      setJsonError(null);
      setShowEditor(true);
      
      // Set first available domain as active
      if (parsedJson.KEYWORD_BLOCK_TEMPLATES && Object.keys(parsedJson.KEYWORD_BLOCK_TEMPLATES).length > 0) {
        setActiveDomain(Object.keys(parsedJson.KEYWORD_BLOCK_TEMPLATES)[0]);
        setActiveSection('KEYWORD_BLOCK_TEMPLATES');
      } else if (parsedJson.SERP_BLOCK_TEMPLATES && Object.keys(parsedJson.SERP_BLOCK_TEMPLATES).length > 0) {
        setActiveDomain(Object.keys(parsedJson.SERP_BLOCK_TEMPLATES)[0]);
        setActiveSection('SERP_BLOCK_TEMPLATES');
      }
      
    } catch (error) {
      setJsonError(`Invalid JSON: ${error.message}`);
      setShowEditor(false);
    }
  };

  const resetEditor = () => {
    setJsonInput('');
    setTemplates({});
    setOriginalTemplates({});
    setOriginalJson('');
    setJsonError(null);
    setShowEditor(false);
    setActiveDomain(null);
    setIsApproved(false);
    setCurrentChangeIndex(0);
  };

  const handleValueChange = (section, domain, index, field, value) => {
    const updatedTemplates = { ...templates };
    
    if (section === 'KEYWORD_BLOCK_TEMPLATES') {
      updatedTemplates[section][domain][index][field] = value;
    } else if (section === 'SERP_BLOCK_TEMPLATES') {
      updatedTemplates[section][domain][index][field] = value;
    }
    
    setTemplates(updatedTemplates);
    setIsApproved(false);
    setCurrentChangeIndex(0);
  };

  const addNewTemplate = (section, domain) => {
    const updatedTemplates = { ...templates };
    
    if (section === 'KEYWORD_BLOCK_TEMPLATES') {
      const newTemplate = {
        TEMPLATE_NAME: "New Template",
        TEMPLATE_KEY: "",
        WIDTH: 300,
        HEIGHT: 250,
        DEVICE: "Mobile"
      };
      
      if (!updatedTemplates[section][domain]) {
        updatedTemplates[section][domain] = [];
      }
      updatedTemplates[section][domain].push(newTemplate);
    } else if (section === 'SERP_BLOCK_TEMPLATES') {
      const newTemplate = {
        TEMPLATE_NAME: "New Template",
        TEMPLATE_KEY: "",
        DEVICE: "Mobile",
        KEYWORD: "",
        TITLE: "",
        DESCRIPTION: "",
        URL: "",
        ADLINK: ""
      };
      
      if (!updatedTemplates[section][domain]) {
        updatedTemplates[section][domain] = [];
      }
      updatedTemplates[section][domain].push(newTemplate);
    }
    
    setTemplates(updatedTemplates);
    setIsApproved(false);
    setCurrentChangeIndex(0);
  };

  const removeTemplate = (section, domain, index) => {
    if (!window.confirm('Are you sure you want to delete this template?')) return;
    
    const updatedTemplates = { ...templates };
    updatedTemplates[section][domain].splice(index, 1);
    setTemplates(updatedTemplates);
    setIsApproved(false);
    setCurrentChangeIndex(0);
  };

  const renderKeywordTemplatesTable = (domain) => {
    if (!templates.KEYWORD_BLOCK_TEMPLATES || !templates.KEYWORD_BLOCK_TEMPLATES[domain]) {
      return <Alert variant="warning">No templates found for {domain}</Alert>;
    }
    
    const domainTemplates = templates.KEYWORD_BLOCK_TEMPLATES[domain];
    
    return (
      <div className="template-table-container">
        <h3>{domain} Templates</h3>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Template Name</th>
              <th>Template Key</th>
              <th>Width</th>
              <th>Height</th>
              <th>Device</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {domainTemplates.map((template, index) => (
              <tr key={index}>
                <td>
                  <Form.Control
                    type="text"
                    value={template.TEMPLATE_NAME}
                    onChange={(e) => handleValueChange('KEYWORD_BLOCK_TEMPLATES', domain, index, 'TEMPLATE_NAME', e.target.value)}
                  />
                </td>
                <td>
                  <Form.Control
                    type="text"
                    value={template.TEMPLATE_KEY}
                    onChange={(e) => handleValueChange('KEYWORD_BLOCK_TEMPLATES', domain, index, 'TEMPLATE_KEY', e.target.value)}
                  />
                </td>
                <td>
                  <Form.Control
                    type="number"
                    value={template.WIDTH}
                    onChange={(e) => handleValueChange('KEYWORD_BLOCK_TEMPLATES', domain, index, 'WIDTH', parseInt(e.target.value))}
                  />
                </td>
                <td>
                  <Form.Control
                    type="number"
                    value={template.HEIGHT}
                    onChange={(e) => handleValueChange('KEYWORD_BLOCK_TEMPLATES', domain, index, 'HEIGHT', parseInt(e.target.value))}
                  />
                </td>
                <td>
                  <Form.Control
                    as="select"
                    value={template.DEVICE}
                    onChange={(e) => handleValueChange('KEYWORD_BLOCK_TEMPLATES', domain, index, 'DEVICE', e.target.value)}
                  >
                    <option>Mobile</option>
                    <option>Desktop</option>
                    <option>Tablet</option>
                  </Form.Control>
                </td>
                <td>
                  <Button variant="danger" onClick={() => removeTemplate('KEYWORD_BLOCK_TEMPLATES', domain, index)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Button 
          variant="primary" 
          onClick={() => addNewTemplate('KEYWORD_BLOCK_TEMPLATES', domain)}
        >
          Add Template
        </Button>
      </div>
    );
  };

  const renderSerpTemplatesTable = (domain) => {
    if (!templates.SERP_BLOCK_TEMPLATES || !templates.SERP_BLOCK_TEMPLATES[domain]) {
      return <Alert variant="warning">No SERP templates found for {domain}</Alert>;
    }
    
    const domainTemplates = templates.SERP_BLOCK_TEMPLATES[domain];
    
    return (
      <div className="template-table-container">
        <h3>{domain} SERP Templates</h3>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Template Name</th>
              <th>Template Key</th>
              <th>Device</th>
              <th>Keyword</th>
              <th>Title</th>
              <th>Description</th>
              <th>URL</th>
              <th>Ad Link</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {domainTemplates.map((template, index) => (
              <tr key={index}>
                <td>
                  <Form.Control
                    type="text"
                    value={template.TEMPLATE_NAME}
                    onChange={(e) => handleValueChange('SERP_BLOCK_TEMPLATES', domain, index, 'TEMPLATE_NAME', e.target.value)}
                  />
                </td>
                <td>
                  <Form.Control
                    type="text"
                    value={template.TEMPLATE_KEY}
                    onChange={(e) => handleValueChange('SERP_BLOCK_TEMPLATES', domain, index, 'TEMPLATE_KEY', e.target.value)}
                  />
                </td>
                <td>
                  <Form.Control
                    as="select"
                    value={template.DEVICE}
                    onChange={(e) => handleValueChange('SERP_BLOCK_TEMPLATES', domain, index, 'DEVICE', e.target.value)}
                  >
                    <option>Mobile</option>
                    <option>Desktop</option>
                    <option>Tablet</option>
                  </Form.Control>
                </td>
                <td>
                  <Form.Control
                    type="text"
                    value={template.KEYWORD || ''}
                    onChange={(e) => handleValueChange('SERP_BLOCK_TEMPLATES', domain, index, 'KEYWORD', e.target.value)}
                  />
                </td>
                <td>
                  <Form.Control
                    type="text"
                    value={template.TITLE || ''}
                    onChange={(e) => handleValueChange('SERP_BLOCK_TEMPLATES', domain, index, 'TITLE', e.target.value)}
                  />
                </td>
                <td>
                  <Form.Control
                    type="text"
                    value={template.DESCRIPTION || ''}
                    onChange={(e) => handleValueChange('SERP_BLOCK_TEMPLATES', domain, index, 'DESCRIPTION', e.target.value)}
                  />
                </td>
                <td>
                  <Form.Control
                    type="text"
                    value={template.URL || ''}
                    onChange={(e) => handleValueChange('SERP_BLOCK_TEMPLATES', domain, index, 'URL', e.target.value)}
                  />
                </td>
                <td>
                  <Form.Control
                    type="text"
                    value={template.ADLINK || ''}
                    onChange={(e) => handleValueChange('SERP_BLOCK_TEMPLATES', domain, index, 'ADLINK', e.target.value)}
                  />
                </td>
                <td>
                  <Button variant="danger" onClick={() => removeTemplate('SERP_BLOCK_TEMPLATES', domain, index)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Button 
          variant="primary" 
          onClick={() => addNewTemplate('SERP_BLOCK_TEMPLATES', domain)}
        >
          Add Template
        </Button>
      </div>
    );
  };

  const getDomainList = (section) => {
    if (!templates[section]) return [];
    return Object.keys(templates[section]);
  };

  const generateCurrentJson = () => {
    return JSON.stringify(templates, null, 2);
  };

  const hasChanges = () => {
    return JSON.stringify(templates) !== JSON.stringify(originalTemplates);
  };

  // Navigation functions for jumping between changes
  const getChangedLines = () => {
    const diffData = generateDiffView();
    return diffData.filter(diff => diff.type !== 'unchanged').map(diff => diff.lineNumber);
  };

  const jumpToNextChange = () => {
    const changedLines = getChangedLines();
    if (changedLines.length === 0) return;
    
    const nextIndex = (currentChangeIndex + 1) % changedLines.length;
    setCurrentChangeIndex(nextIndex);
    jumpToLine(changedLines[nextIndex]);
  };

  const jumpToPreviousChange = () => {
    const changedLines = getChangedLines();
    if (changedLines.length === 0) return;
    
    const prevIndex = currentChangeIndex === 0 ? changedLines.length - 1 : currentChangeIndex - 1;
    setCurrentChangeIndex(prevIndex);
    jumpToLine(changedLines[prevIndex]);
  };

  const jumpToLine = (lineNumber) => {
    const diffContainer = document.querySelector('.diff-content-container');
    const targetRow = document.querySelector(`[data-line-number="${lineNumber}"]`);
    
    if (diffContainer && targetRow) {
      // Remove previous highlights
      const previousHighlights = diffContainer.querySelectorAll('.current-change-highlight');
      previousHighlights.forEach(el => el.classList.remove('current-change-highlight'));
      
      // Add highlight to current row
      targetRow.classList.add('current-change-highlight');
      
      // Calculate scroll position
      const containerRect = diffContainer.getBoundingClientRect();
      const targetRect = targetRow.getBoundingClientRect();
      const scrollTop = targetRect.top - containerRect.top + diffContainer.scrollTop - 100;
      
      diffContainer.scrollTo({
        top: scrollTop,
        behavior: 'smooth'
      });
      
      // Remove highlight after 2 seconds
      setTimeout(() => {
        targetRow.classList.remove('current-change-highlight');
      }, 2000);
    }
  };

  // Keyboard shortcuts for navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Only work when Compare tab is active and has changes
      if (!hasChanges()) return;
      
      const activeTab = document.querySelector('.tab-pane.active');
      const isCompareTabActive = activeTab && activeTab.querySelector('.diff-content-container');
      
      if (!isCompareTabActive) return;
      
      // Ctrl/Cmd + Arrow keys for navigation
      if ((event.ctrlKey || event.metaKey)) {
        if (event.key === 'ArrowDown') {
          event.preventDefault();
          jumpToNextChange();
        } else if (event.key === 'ArrowUp') {
          event.preventDefault();
          jumpToPreviousChange();
        }
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [templates, originalTemplates]);

  // Simple diff algorithm for line-by-line comparison
  const generateDiffView = () => {
    const originalLines = originalJson.split('\n');
    const currentLines = generateCurrentJson().split('\n');
    const maxLines = Math.max(originalLines.length, currentLines.length);
    
    const diffLines = [];
    
    for (let i = 0; i < maxLines; i++) {
      const originalLine = originalLines[i] || '';
      const currentLine = currentLines[i] || '';
      
      if (originalLine === currentLine) {
        diffLines.push({
          type: 'unchanged',
          originalLine,
          currentLine,
          lineNumber: i + 1
        });
      } else if (originalLine && !currentLine) {
        diffLines.push({
          type: 'deleted',
          originalLine,
          currentLine: '',
          lineNumber: i + 1
        });
      } else if (!originalLine && currentLine) {
        diffLines.push({
          type: 'added',
          originalLine: '',
          currentLine,
          lineNumber: i + 1
        });
      } else {
        diffLines.push({
          type: 'modified',
          originalLine,
          currentLine,
          lineNumber: i + 1
        });
      }
    }
    
    return diffLines;
  };

  const renderDiffLine = (diff, index) => {
    const getLineClass = (type) => {
      switch (type) {
        case 'added': return 'diff-line-added';
        case 'deleted': return 'diff-line-deleted';
        case 'modified': return 'diff-line-modified';
        default: return 'diff-line-unchanged';
      }
    };

    return (
      <div 
        key={index} 
        className={`diff-row ${getLineClass(diff.type)}`}
        data-line-number={diff.lineNumber}
      >
        <div className="diff-line-number">{diff.lineNumber}</div>
        <div className="diff-original">
          <pre className="diff-content">{diff.originalLine || ' '}</pre>
        </div>
        <div className="diff-line-number">{diff.lineNumber}</div>
        <div className="diff-modified">
          <pre className="diff-content">{diff.currentLine || ' '}</pre>
        </div>
      </div>
    );
  };

  // Approval and export functions
  const approveChanges = () => {
    setIsApproved(true);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateCurrentJson());
      alert('✅ JSON copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = generateCurrentJson();
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('✅ JSON copied to clipboard!');
    }
  };

  const downloadJson = () => {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const filename = `template-${timestamp}.json`;
    
    if (window.confirm(`💾 Download modified template as "${filename}"?`)) {
      const jsonContent = generateCurrentJson();
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  // JSON Input View
  if (!showEditor) {
    return (
      <div className="template-editor-container">
        <Row className="mb-4">
          <Col>
            <p className="text-muted">Paste your template JSON content below to start editing</p>
          </Col>
        </Row>
        
        <Card>
          <Card.Header>
            <h3>JSON Input</h3>
          </Card.Header>
          <Card.Body>
            <Form.Group className="mb-3">
              <Form.Label>Template JSON Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={15}
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder="Paste your template JSON here..."
                className="json-input"
              />
            </Form.Group>
            
            {jsonError && (
              <Alert variant="danger">{jsonError}</Alert>
            )}
            
            <div className="d-flex gap-2">
              <Button 
                variant="primary" 
                onClick={handleJsonInput}
                disabled={!jsonInput.trim()}
              >
                Load JSON for Editing
              </Button>
              <Button 
                variant="secondary" 
                onClick={() => setJsonInput('')}
              >
                Clear
              </Button>
            </div>
          </Card.Body>
        </Card>
      </div>
    );
  }

  // Editor View
  return (
    <div className="template-editor-container">
      <Row className="mb-4">
        <Col>
          {hasChanges() && !isApproved && (
            <Alert variant="warning">
              ⚠️ You have unsaved changes - Review and approve them in the Compare tab
            </Alert>
          )}
          {hasChanges() && isApproved && (
            <Alert variant="success">
              ✅ Changes approved and ready for export
            </Alert>
          )}
        </Col>
        <Col className="text-end">
          <Button variant="outline-secondary" onClick={resetEditor} className="me-2">
            Start Over
          </Button>
        </Col>
      </Row>
      
      <Tabs defaultActiveKey="editor" className="mb-4">
        <Tab eventKey="editor" title="Template Editor">
          <Tabs
            activeKey={activeSection}
            onSelect={(k) => setActiveSection(k)}
            className="mb-4"
          >
            <Tab eventKey="KEYWORD_BLOCK_TEMPLATES" title="Keyword Templates">
              <Row>
                <Col md={3}>
                  <div className="domain-list-container">
                    <h3>Domains</h3>
                    <div className="list-group">
                      {getDomainList('KEYWORD_BLOCK_TEMPLATES').map(domain => (
                        <Button
                          key={domain}
                          variant={activeDomain === domain ? 'primary' : 'light'}
                          className="list-group-item text-start"
                          onClick={() => setActiveDomain(domain)}
                        >
                          {domain}
                        </Button>
                      ))}
                    </div>
                  </div>
                </Col>
                <Col md={9}>
                  {activeDomain && renderKeywordTemplatesTable(activeDomain)}
                </Col>
              </Row>
            </Tab>
            <Tab eventKey="SERP_BLOCK_TEMPLATES" title="SERP Templates">
              <Row>
                <Col md={3}>
                  <div className="domain-list-container">
                    <h3>Domains</h3>
                    <div className="list-group">
                      {getDomainList('SERP_BLOCK_TEMPLATES').map(domain => (
                        <Button
                          key={domain}
                          variant={activeDomain === domain ? 'primary' : 'light'}
                          className="list-group-item text-start"
                          onClick={() => setActiveDomain(domain)}
                        >
                          {domain}
                        </Button>
                      ))}
                    </div>
                  </div>
                </Col>
                <Col md={9}>
                  {activeDomain && renderSerpTemplatesTable(activeDomain)}
                </Col>
              </Row>
            </Tab>
          </Tabs>
        </Tab>
        
        <Tab eventKey="compare" title={`Compare Changes ${hasChanges() ? '(Modified)' : ''}`}>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <div>
                <h3>JSON Comparison</h3>
                {hasChanges() && (
                  <div className="mt-2">
                    {(() => {
                      const diffData = generateDiffView();
                      const added = diffData.filter(d => d.type === 'added').length;
                      const deleted = diffData.filter(d => d.type === 'deleted').length;
                      const modified = diffData.filter(d => d.type === 'modified').length;
                      return (
                        <small className="text-muted">
                          <span className="badge bg-success me-1">{added}</span> added
                          <span className="ms-3 badge bg-danger me-1">{deleted}</span> deleted
                          <span className="ms-3 badge bg-warning me-1">{modified}</span> modified
                        </small>
                      );
                    })()}
                  </div>
                )}
              </div>
                            <div className="d-flex align-items-center">
                {hasChanges() && (
                  <>
                    <div className="btn-group me-3" role="group">
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={jumpToPreviousChange}
                        title="Previous Change (Ctrl/Cmd + ↑)"
                        disabled={getChangedLines().length === 0}
                      >
                        ⬆️ Prev {getChangedLines().length > 0 && `(${currentChangeIndex + 1}/${getChangedLines().length})`}
                      </Button>
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={jumpToNextChange}
                        title="Next Change (Ctrl/Cmd + ↓)"
                        disabled={getChangedLines().length === 0}
                      >
                        ⬇️ Next {getChangedLines().length > 0 && `(${currentChangeIndex + 1}/${getChangedLines().length})`}
                      </Button>
                    </div>
                    
                    {!isApproved && (
                      <span className="badge bg-warning me-2">Changes Pending Approval</span>
                    )}
                    {isApproved && (
                      <span className="badge bg-success me-2">✅ Changes Approved</span>
                    )}
                  </>
                )}
                
                {hasChanges() && !isApproved && (
                  <Button 
                    variant="primary" 
                    size="sm"
                    onClick={approveChanges}
                    className="me-2"
                  >
                    ✅ Finalized Changes
                  </Button>
                )}
                
                {hasChanges() && isApproved && (
                  <>
                    <Button 
                      variant="outline-success" 
                      size="sm"
                      onClick={copyToClipboard}
                      className="me-2"
                      title="Copy to Clipboard"
                    >
                      📋 Copy
                    </Button>
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      onClick={downloadJson}
                      title="Download JSON File"
                    >
                      💾 Download
                    </Button>
                  </>
                )}
              </div>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="diff-container">
                <div className="diff-header">
                  <div className="diff-header-section">
                    <div className="diff-line-number-header">#</div>
                    <div className="diff-header-title">Original JSON</div>
                  </div>
                  <div className="diff-header-section">
                    <div className="diff-line-number-header">#</div>
                    <div className="diff-header-title">Modified JSON</div>
                  </div>
                </div>
                <div className="diff-content-container">
                  {generateDiffView().map((diff, index) => renderDiffLine(diff, index))}
                </div>
              </div>
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
};

export default TemplateEditor; 