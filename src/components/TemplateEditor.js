import React, { useState, useEffect } from 'react';
import { Table, Form, Button, Tabs, Tab, Row, Col, Alert, Card } from 'react-bootstrap';
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

  // Navigation functions for jumping between change sets
  const getChangeSets = () => {
    const diffData = generateDiffView();
    const changeSets = [];
    let currentSet = [];
    let inChangeSet = false;
    
    diffData.forEach((diff, index) => {
      if (diff.type !== 'unchanged') {
        // Start or continue a change set
        if (!inChangeSet) {
          inChangeSet = true;
          currentSet = [];
        }
        currentSet.push({
          ...diff,
          globalIndex: index
        });
      } else {
        // End current change set if we were in one
        if (inChangeSet && currentSet.length > 0) {
          changeSets.push([...currentSet]);
          currentSet = [];
          inChangeSet = false;
        }
      }
    });
    
    // Don't forget the last change set if it exists
    if (inChangeSet && currentSet.length > 0) {
      changeSets.push(currentSet);
    }
    
    return changeSets;
  };

  const jumpToNextChangeSet = () => {
    const changeSets = getChangeSets();
    if (changeSets.length === 0) return;
    
    const nextIndex = (currentChangeIndex + 1) % changeSets.length;
    setCurrentChangeIndex(nextIndex);
    jumpToChangeSet(changeSets[nextIndex]);
  };

  const jumpToPreviousChangeSet = () => {
    const changeSets = getChangeSets();
    if (changeSets.length === 0) return;
    
    const prevIndex = currentChangeIndex === 0 ? changeSets.length - 1 : currentChangeIndex - 1;
    setCurrentChangeIndex(prevIndex);
    jumpToChangeSet(changeSets[prevIndex]);
  };

  const jumpToChangeSet = (changeSet) => {
    const diffContainer = document.querySelector('.diff-content-container');
    if (!diffContainer || !changeSet || changeSet.length === 0) return;
    
    // Remove previous highlights
    const previousHighlights = diffContainer.querySelectorAll('.current-change-highlight');
    previousHighlights.forEach(el => el.classList.remove('current-change-highlight'));
    
    // Highlight all rows in the change set
    changeSet.forEach(change => {
      const targetRow = document.querySelector(`[data-line-number="${change.lineNumber}"]`);
      if (targetRow) {
        targetRow.classList.add('current-change-highlight');
      }
    });
    
    // Scroll to the first row of the change set
    const firstRow = document.querySelector(`[data-line-number="${changeSet[0].lineNumber}"]`);
    if (firstRow) {
      const containerRect = diffContainer.getBoundingClientRect();
      const targetRect = firstRow.getBoundingClientRect();
      const scrollTop = targetRect.top - containerRect.top + diffContainer.scrollTop - 100;
      
      diffContainer.scrollTo({
        top: scrollTop,
        behavior: 'smooth'
      });
    }
    
    // Remove highlights after 3 seconds
    setTimeout(() => {
      changeSet.forEach(change => {
        const targetRow = document.querySelector(`[data-line-number="${change.lineNumber}"]`);
        if (targetRow) {
          targetRow.classList.remove('current-change-highlight');
        }
      });
    }, 3000);
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
          jumpToNextChangeSet();
        } else if (event.key === 'ArrowUp') {
          event.preventDefault();
          jumpToPreviousChangeSet();
        }
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [templates, originalTemplates, currentChangeIndex, hasChanges, jumpToNextChangeSet, jumpToPreviousChangeSet]);

  // Proper diff algorithm with insertions, deletions, and modifications
  const generateDiffView = () => {
    const originalLines = originalJson.split('\n');
    const currentLines = generateCurrentJson().split('\n');
    
    // Use Myers diff algorithm for proper line matching
    const diffResult = computeProperDiff(originalLines, currentLines);
    return diffResult;
  };

  // Myers diff algorithm implementation for proper line matching
  const computeProperDiff = (originalLines, currentLines) => {
    const n = originalLines.length;
    const m = currentLines.length;
    
    // If one array is empty, all lines are added/deleted
    if (n === 0) {
      return currentLines.map((line, index) => ({
        type: 'added',
        originalLine: '',
        currentLine: line,
        lineNumber: index + 1
      }));
    }
    
    if (m === 0) {
      return originalLines.map((line, index) => ({
        type: 'deleted',
        originalLine: line,
        currentLine: '',
        lineNumber: index + 1
      }));
    }

    // Find the longest common subsequence
    const lcs = findLongestCommonSubsequence(originalLines, currentLines);
    
    // Build the diff from the LCS
    const diffLines = [];
    let origIndex = 0;
    let currIndex = 0;
    let lcsIndex = 0;
    let lineNumber = 1;

    while (origIndex < n || currIndex < m) {
      if (origIndex < n && currIndex < m && 
          lcsIndex < lcs.length && 
          originalLines[origIndex] === lcs[lcsIndex] && 
          currentLines[currIndex] === lcs[lcsIndex]) {
        // Lines match - unchanged
        diffLines.push({
          type: 'unchanged',
          originalLine: originalLines[origIndex],
          currentLine: currentLines[currIndex],
          lineNumber: lineNumber++
        });
        origIndex++;
        currIndex++;
        lcsIndex++;
      } else if (origIndex < n && 
                 (lcsIndex >= lcs.length || originalLines[origIndex] !== lcs[lcsIndex])) {
        // Line deleted from original
        diffLines.push({
          type: 'deleted',
          originalLine: originalLines[origIndex],
          currentLine: '',
          lineNumber: lineNumber++
        });
        origIndex++;
      } else if (currIndex < m && 
                 (lcsIndex >= lcs.length || currentLines[currIndex] !== lcs[lcsIndex])) {
        // Line added to current
        diffLines.push({
          type: 'added',
          originalLine: '',
          currentLine: currentLines[currIndex],
          lineNumber: lineNumber++
        });
        currIndex++;
      }
    }

    return diffLines;
  };

  // Find longest common subsequence using dynamic programming
  const findLongestCommonSubsequence = (arr1, arr2) => {
    const n = arr1.length;
    const m = arr2.length;
    const dp = Array(n + 1).fill().map(() => Array(m + 1).fill(0));
    
    // Build the DP table
    for (let i = 1; i <= n; i++) {
      for (let j = 1; j <= m; j++) {
        if (arr1[i - 1] === arr2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1] + 1;
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
      }
    }
    
    // Backtrack to find the LCS
    const lcs = [];
    let i = n, j = m;
    while (i > 0 && j > 0) {
      if (arr1[i - 1] === arr2[j - 1]) {
        lcs.unshift(arr1[i - 1]);
        i--;
        j--;
      } else if (dp[i - 1][j] > dp[i][j - 1]) {
        i--;
      } else {
        j--;
      }
    }
    
    return lcs;
  };

  // Enhanced character-level diff with proper highlighting
  const findCharacterLevelDiff = (str1, str2) => {
    if (str1 === str2) return null;
    
    // Special handling for JSON property lines
    const jsonPropertyRegex = /^(\s*)(".*"):\s*(.*)$/;
    const prop1Match = str1.match(jsonPropertyRegex);
    const prop2Match = str2.match(jsonPropertyRegex);
    
    if (prop1Match && prop2Match && prop1Match[2] === prop2Match[2]) {
      // Same property key, but different values - highlight only the value
      const keyPart = prop1Match[1] + prop1Match[2] + ": ";
      return {
        prefixLength: keyPart.length,
        suffixLength: 0,
        originalMiddle: prop1Match[3],
        currentMiddle: prop2Match[3]
      };
    }
    
    // Use Myers diff algorithm for character-level differences
    const chars1 = str1.split('');
    const chars2 = str2.split('');
    const lcs = findLongestCommonSubsequence(chars1, chars2);
    
    let i = 0, j = 0, lcsIndex = 0;
    let prefixLength = 0;
    let suffixLength = 0;
    
    // Find common prefix
    while (i < chars1.length && j < chars2.length && 
           lcsIndex < lcs.length && 
           chars1[i] === lcs[lcsIndex] && chars2[j] === lcs[lcsIndex]) {
      prefixLength++;
      i++;
      j++;
      lcsIndex++;
    }
    
    // Find common suffix
    let suffixStart1 = chars1.length;
    let suffixStart2 = chars2.length;
    let suffixLcsIndex = lcs.length;
    
    while (suffixStart1 > prefixLength && suffixStart2 > prefixLength && 
           suffixLcsIndex > lcsIndex && 
           chars1[suffixStart1 - 1] === lcs[suffixLcsIndex - 1] && 
           chars2[suffixStart2 - 1] === lcs[suffixLcsIndex - 1]) {
      suffixLength++;
      suffixStart1--;
      suffixStart2--;
      suffixLcsIndex--;
    }
    
    return {
      prefixLength,
      suffixLength,
      originalMiddle: str1.substring(prefixLength, suffixStart1),
      currentMiddle: str2.substring(prefixLength, suffixStart2)
    };
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

    // Render modified lines with character-level highlighting
    const renderModifiedContent = (line, isOriginal) => {
      if (diff.type !== 'modified' || !diff.changes) {
        return <pre className="diff-content">{line || ' '}</pre>;
      }
      
      const { prefixLength, suffixLength, originalMiddle, currentMiddle } = diff.changes;
      const middle = isOriginal ? originalMiddle : currentMiddle;
      
      if (prefixLength === 0 && suffixLength === 0) {
        // If no common parts found, show the whole line
        return <pre className="diff-content">{line || ' '}</pre>;
      }
      
      const prefix = line.substring(0, prefixLength);
      const suffix = line.substring(line.length - suffixLength);
      
      return (
        <pre className="diff-content">
          {prefix}
          <span className={isOriginal ? "diff-deleted-text" : "diff-added-text"}>
            {middle}
          </span>
          {suffix}
        </pre>
      );
    };

    return (
      <div 
        key={index} 
        className={`diff-row ${getLineClass(diff.type)}`}
        data-line-number={diff.lineNumber}
      >
        <div className="diff-line-number">{diff.lineNumber}</div>
        <div className="diff-original">
          {diff.type === 'modified' ? 
            renderModifiedContent(diff.originalLine, true) : 
            <pre className="diff-content">{diff.originalLine || ' '}</pre>
          }
        </div>
        <div className="diff-line-number">{diff.lineNumber}</div>
        <div className="diff-modified">
          {diff.type === 'modified' ? 
            renderModifiedContent(diff.currentLine, false) : 
            <pre className="diff-content">{diff.currentLine || ' '}</pre>
          }
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
                        onClick={jumpToPreviousChangeSet}
                        title="Previous Change Set (Ctrl/Cmd + ↑)"
                        disabled={getChangeSets().length === 0}
                      >
                        ⬆️ Prev Set {getChangeSets().length > 0 && `(${currentChangeIndex + 1}/${getChangeSets().length})`}
                      </Button>
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={jumpToNextChangeSet}
                        title="Next Change Set (Ctrl/Cmd + ↓)"
                        disabled={getChangeSets().length === 0}
                      >
                        ⬇️ Next Set {getChangeSets().length > 0 && `(${currentChangeIndex + 1}/${getChangeSets().length})`}
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