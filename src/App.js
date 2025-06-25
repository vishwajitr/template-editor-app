import React from 'react';
import { Container, Navbar } from 'react-bootstrap';
import TemplateEditor from './components/TemplateEditor';
import './App.css';

function App() {
  return (
    <div className="App">
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container className="justify-content-center">
          <Navbar.Brand href="#home" className="template-editor-brand">
            <span className="brand-icon">📝</span>
            <div className="brand-text-container">
              <span className="brand-text">Template Editor</span>
              <span className="brand-subtitle">JSON Configuration Tool</span>
            </div>
          </Navbar.Brand>
        </Container>
      </Navbar>
      
      <Container fluid className="p-4">
        <TemplateEditor />
      </Container>
    </div>
  );
}

export default App; 